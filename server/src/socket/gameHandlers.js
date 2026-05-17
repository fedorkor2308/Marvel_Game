import * as E          from '../../../shared/events.js';
import { GAME }        from '../../../shared/constants.js';
import { GameEngine }  from '../services/GameEngine.js';
import { Card }        from '../models/Card.js';
import { User }        from '../models/User.js';
import { Game }        from '../models/Game.js';
import { TurnTimer }   from './turnTimer.js';
import {
  activeGames, activeTimers,
  playerToGame, gameToRoom,
  userSockets, disconnectLog,
} from './state.js';

// ─── Public: called by matchmaking + roomHandlers ────────────────────────────

export async function initGame(io, p1Socket, p2Socket, roomId) {
  try {
    const allCards = await Card.getAll();

    const [p1Info] = await User.findById(p1Socket.user.id);
    const [p2Info] = await User.findById(p2Socket.user.id);
    p1Info.avatarUrl = p1Info.avatar_url;
    p2Info.avatarUrl = p2Info.avatar_url;

    const engine = new GameEngine(p1Info, p2Info, allCards);

    const dbResult = await Game.create(roomId, p1Info.id, p2Info.id);
    engine.id = dbResult.insertId;

    activeGames.set(engine.id, engine);
    playerToGame.set(p1Info.id, engine.id);
    playerToGame.set(p2Info.id, engine.id);
    gameToRoom.set(engine.id, roomId);

    const state    = engine.startTurn();
    const roomKey  = `room:${roomId}`;

    io.to(roomKey).emit(E.GAME_START, {
      gameId:        engine.id,
      firstPlayerId: engine.currentPlayerId,
      players: {
        [p1Info.id]: { id: p1Info.id, username: p1Info.username, avatarUrl: p1Info.avatarUrl },
        [p2Info.id]: { id: p2Info.id, username: p2Info.username, avatarUrl: p2Info.avatarUrl },
      },
    });

    io.to(roomKey).emit(E.GAME_STATE, state);
    p1Socket.emit(E.PLAYER_HAND, engine.privateHand(p1Info.id));
    p2Socket.emit(E.PLAYER_HAND, engine.privateHand(p2Info.id));

    _startTimer(io, roomKey, engine);
  } catch (err) {
    console.error('[game] initGame failed:', err);
    io.to(`room:${roomId}`).emit(E.ERROR, { message: 'Failed to start game' });
  }
}

// ─── Per-socket handlers ─────────────────────────────────────────────────────

export function registerGameHandlers(io, socket) {

  // Play a card from hand onto the board
  socket.on(E.CARD_PLAY, ({ instanceId }) => {
    const engine = _engineFor(socket.user.id);
    if (!engine) return;

    const result = engine.playCard(socket.user.id, instanceId);
    if (!result.ok) return socket.emit(E.ERROR, { message: result.error });

    const roomKey = `room:${gameToRoom.get(engine.id)}`;
    io.to(roomKey).emit(E.GAME_STATE, result.state);
    // Hand changed for the active player
    socket.emit(E.PLAYER_HAND, engine.privateHand(socket.user.id));

    if (result.state.status === 'finished') _endGame(io, engine);
  });

  // Attack with a board card (targetId = opponent's instanceId or 'hero')
  socket.on(E.CARD_ATTACK, ({ attackerInstanceId, targetId }) => {
    const engine = _engineFor(socket.user.id);
    if (!engine) return;

    const result = engine.attackWith(socket.user.id, attackerInstanceId, targetId);
    if (!result.ok) return socket.emit(E.ERROR, { message: result.error });

    const roomKey = `room:${gameToRoom.get(engine.id)}`;
    io.to(roomKey).emit(E.GAME_STATE, result.state);

    if (result.state.status === 'finished') _endGame(io, engine);
  });

  // Player ends their turn voluntarily
  socket.on(E.TURN_END, () => {
    const engine = _engineFor(socket.user.id);
    if (!engine) return;
    if (String(socket.user.id) !== String(engine.currentPlayerId)) return;
    _advanceTurn(io, engine);
  });

  // Reconnect after a brief disconnect
  socket.on(E.GAME_RECONNECT, () => {
    const log = disconnectLog.get(socket.user.id);
    if (!log) return socket.emit(E.ERROR, { message: 'No game to reconnect to' });

    const elapsed = Date.now() - log.ts;
    if (elapsed > GAME.RECONNECT_TIMEOUT_SEC * 1000) {
      disconnectLog.delete(socket.user.id);
      return socket.emit(E.ERROR, { message: 'Reconnect window expired' });
    }

    const engine = activeGames.get(log.gameId);
    if (!engine) return socket.emit(E.ERROR, { message: 'Game is no longer active' });

    // Re-join socket room and restore references
    socket.join(`room:${log.roomId}`);
    socket.data.roomId = log.roomId;
    userSockets.set(socket.user.id, socket);
    disconnectLog.delete(socket.user.id);

    // Resync full state to reconnecting player
    socket.emit(E.GAME_STATE, engine.publicState());
    socket.emit(E.PLAYER_HAND, engine.privateHand(socket.user.id));

    // Notify opponent
    socket.to(`room:${log.roomId}`).emit(E.PLAYER_RECONNECT, { userId: socket.user.id });
  });
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function _engineFor(userId) {
  const gameId = playerToGame.get(userId);
  return gameId ? activeGames.get(gameId) : null;
}

function _emitHands(engine) {
  for (const pid of Object.keys(engine.players)) {
    userSockets.get(Number(pid))?.emit(E.PLAYER_HAND, engine.privateHand(pid));
  }
}

function _startTimer(io, roomKey, engine) {
  const timer = new TurnTimer(
    GAME.TURN_DURATION_SEC,
    (remaining) => io.to(roomKey).emit(E.TURN_TICK, { remaining }),
    ()          => _advanceTurn(io, engine),
  );
  activeTimers.set(engine.id, timer);
}

function _advanceTurn(io, engine) {
  const roomKey = `room:${gameToRoom.get(engine.id)}`;

  activeTimers.get(engine.id)?.clear();
  activeTimers.delete(engine.id);

  const state = engine.endTurn();
  io.to(roomKey).emit(E.GAME_STATE, state);
  _emitHands(engine);

  if (state.status === 'finished') {
    _endGame(io, engine);
  } else {
    _startTimer(io, roomKey, engine);
  }
}

async function _endGame(io, engine) {
  const roomId = gameToRoom.get(engine.id);

  activeTimers.get(engine.id)?.clear();
  activeTimers.delete(engine.id);

  try {
    await Game.finish(engine.id, engine.winnerId, engine.turn);
    const pids    = Object.keys(engine.players).map(Number);
    const loserId = pids.find(id => id !== engine.winnerId);
    await User.updateStats(engine.winnerId, loserId);
  } catch (err) {
    console.error('[game] failed to persist result:', err);
  }

  io.to(`room:${roomId}`).emit(E.GAME_END, {
    winnerId:       engine.winnerId,
    winnerUsername: engine.players[engine.winnerId]?.username,
  });

  // Cleanup state
  activeGames.delete(engine.id);
  gameToRoom.delete(engine.id);
  for (const pid of Object.keys(engine.players)) {
    playerToGame.delete(Number(pid));
  }
}
