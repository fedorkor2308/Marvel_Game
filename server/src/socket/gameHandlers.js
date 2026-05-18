import jwt from 'jsonwebtoken';
import * as E from '../../../shared/events.js';
import { GAME } from '../../../shared/constants.js';
import { GameEngine } from '../services/GameEngine.js';
import { Card } from '../models/Card.js';
import { Game } from '../models/Game.js';
import { User } from '../models/User.js';
import { TurnTimer } from './turnTimer.js';
import { activeGames, activeTimers, playerToGame, gameToRoom, userSockets } from './state.js';

function signGameToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '2h' }
  );
}

export async function initGame(io, p1Socket, p2Socket, roomName) {
  try {
    const [p1Info] = await User.findById(p1Socket.user.id);
    const [p2Info] = await User.findById(p2Socket.user.id);
    const cards    = await Card.getAll();

    const engine = new GameEngine(
      { id: p1Socket.user.id, username: p1Info.username, avatarUrl: p1Info.avatar_url },
      { id: p2Socket.user.id, username: p2Info.username, avatarUrl: p2Info.avatar_url },
      cards
    );

    // roomName is "room:<id>" — extract DB id
    const roomId   = Number(roomName.split(':')[1]);
    const dbResult = await Game.create(roomId, p1Socket.user.id, p2Socket.user.id);
    engine.id = dbResult.insertId;

    // Store state
    activeGames.set(engine.id, engine);
    gameToRoom.set(engine.id, roomName);
    playerToGame.set(String(p1Socket.user.id), engine.id);
    playerToGame.set(String(p2Socket.user.id), engine.id);
    userSockets.set(String(p1Socket.user.id), p1Socket);
    userSockets.set(String(p2Socket.user.id), p2Socket);

    p1Socket.join(roomName);
    p2Socket.join(roomName);

    const state = engine.startTurn();

    // Emit separately — each player gets their own game token so the game page
    // socket uses the right identity even when localStorage is shared (same browser)
    p1Socket.emit(E.GAME_START, {
      gameId:        engine.id,
      firstPlayerId: engine.currentPlayerId,
      myPlayerId:    p1Socket.user.id,
      gameToken:     signGameToken(p1Socket.user),
    });
    p2Socket.emit(E.GAME_START, {
      gameId:        engine.id,
      firstPlayerId: engine.currentPlayerId,
      myPlayerId:    p2Socket.user.id,
      gameToken:     signGameToken(p2Socket.user),
    });

    // Small delay so clients can navigate to GamePage before state arrives
    setTimeout(() => {
      io.to(roomName).emit(E.GAME_STATE, state);
      _emitHands(engine);
      _startTimer(io, engine);
    }, 500);

  } catch (err) {
    console.error('[initGame] error:', err);
  }
}

function _emitHands(engine) {
  for (const playerId of Object.keys(engine.players)) {
    const sock = userSockets.get(String(playerId));
    if (sock) sock.emit(E.PLAYER_HAND, engine.privateHand(playerId));
  }
}

function _startTimer(io, engine) {
  const roomName = gameToRoom.get(engine.id);
  const existing = activeTimers.get(engine.id);
  if (existing) existing.clear();

  const timer = new TurnTimer(
    GAME.TURN_DURATION_SEC,
    (remaining) => io.to(roomName).emit(E.TURN_TICK, remaining),
    ()          => _doEndTurn(io, engine)
  );
  activeTimers.set(engine.id, timer);
}

function _doEndTurn(io, engine) {
  const roomName = gameToRoom.get(engine.id);
  const state    = engine.endTurn();
  io.to(roomName).emit(E.GAME_STATE, state);
  _emitHands(engine);

  if (engine.status === 'finished') {
    _endGame(io, engine);
  } else {
    _startTimer(io, engine);
  }
}

async function _endGame(io, engine) {
  const roomName = gameToRoom.get(engine.id);
  const timer    = activeTimers.get(engine.id);
  if (timer) timer.clear();

  activeTimers.delete(engine.id);
  activeGames.delete(engine.id);
  gameToRoom.delete(engine.id);

  const playerIds = Object.keys(engine.players);
  playerIds.forEach(id => playerToGame.delete(id));

  if (engine.winnerId) {
    const loserId = playerIds.find(id => String(id) !== String(engine.winnerId));
    await Promise.all([
      Game.finish(engine.id, engine.winnerId, engine.turn),
      User.updateStats(engine.winnerId, loserId),
    ]).catch(err => console.error('[endGame] db error:', err));
  } else {
    // Draw — record end time but no winner
    await Game.finish(engine.id, null, engine.turn)
      .catch(err => console.error('[endGame] db error:', err));
  }

  const winner = engine.players[engine.winnerId];
  io.to(roomName).emit(E.GAME_END, {
    winnerId:       engine.winnerId,
    winnerUsername: winner?.username,
  });
}

export function registerGameHandlers(io, socket) {
  socket.on(E.CARD_PLAY, ({ instanceId }) => {
    const engine = _engineFor(socket);
    if (!engine) return;

    const result = engine.playCard(socket.user.id, instanceId);
    if (!result.ok) return socket.emit(E.ERROR, { message: result.error });

    io.to(gameToRoom.get(engine.id)).emit(E.GAME_STATE, result.state);
    socket.emit(E.PLAYER_HAND, engine.privateHand(socket.user.id));
  });

  socket.on(E.CARD_ATTACK, ({ attackerInstanceId, targetId }) => {
    const engine = _engineFor(socket);
    if (!engine) { console.warn('[card:attack] no engine for user', socket.user.id); return; }

    const result = engine.attackWith(socket.user.id, attackerInstanceId, targetId);
    console.log(`[card:attack] user=${socket.user.username} target=${targetId} ok=${result.ok}`, result.ok ? '' : result.error);
    if (!result.ok) return socket.emit(E.ERROR, { message: result.error });

    io.to(gameToRoom.get(engine.id)).emit(E.GAME_STATE, result.state);
    if (engine.status === 'finished') _endGame(io, engine);
  });

  socket.on(E.TURN_END, () => {
    const engine = _engineFor(socket);
    if (!engine) return;
    if (String(engine.currentPlayerId) !== String(socket.user.id)) return;

    const timer = activeTimers.get(engine.id);
    if (timer) timer.clear();

    _doEndTurn(io, engine);
  });

  socket.on(E.GAME_RECONNECT, () => {
    const gameId = playerToGame.get(String(socket.user.id));
    if (!gameId) return;
    const engine = activeGames.get(gameId);
    if (!engine) return;

    userSockets.set(String(socket.user.id), socket);
    const roomName = gameToRoom.get(gameId);
    socket.join(roomName);
    // Tell client their confirmed player ID before sending state
    socket.emit('player:identity', { myPlayerId: socket.user.id });
    socket.emit(E.GAME_STATE, engine.publicState());
    socket.emit(E.PLAYER_HAND, engine.privateHand(socket.user.id));
    // Let opponent know this player is back (exclude self)
    socket.to(roomName).emit('player:reconnect');
  });
}

function _engineFor(socket) {
  const gameId = playerToGame.get(String(socket.user.id));
  return gameId ? activeGames.get(gameId) : null;
}
