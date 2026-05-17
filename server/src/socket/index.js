import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerMatchmaking }  from './matchmaking.js';
import { registerGameHandlers } from './gameHandlers.js';
import { registerRoomHandlers } from './roomHandlers.js';
import { userSockets, playerToGame, activeGames, gameToRoom, disconnectLog } from './state.js';
import * as E from '../../../shared/events.js';

export function initSocket(server) {
  const io = new Server(server, {
    cors:         { origin: process.env.CLIENT_ORIGIN, credentials: true },
    pingInterval: 10000,
    pingTimeout:  5000,
  });

  // ─── JWT auth middleware ──────────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Missing token'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    userSockets.set(userId, socket);
    console.log(`[socket] + ${socket.user.username} (${socket.id})`);

    registerRoomHandlers(io, socket);
    registerMatchmaking(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', () => {
      userSockets.delete(userId);
      console.log(`[socket] - ${socket.user.username} (${socket.id})`);

      // If the player was mid-game, log the disconnect for potential reconnect
      const gameId = playerToGame.get(userId);
      if (gameId && activeGames.has(gameId)) {
        const roomId = gameToRoom.get(gameId);
        disconnectLog.set(userId, { gameId, roomId, ts: Date.now() });
        socket.to(`room:${roomId}`).emit(E.PLAYER_DISCONNECT, { userId });
      }
    });
  });

  return io;
}
