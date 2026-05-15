import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerMatchmaking } from './matchmaking.js';
import { registerGameHandlers } from './gameHandlers.js';
import { registerRoomHandlers }  from './roomHandlers.js';

/** Active games: gameId → GameEngine instance */
export const activeGames = new Map();

/** socket.id → userId (for reconnect) */
export const socketUsers = new Map();

export function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
    pingInterval: 10000,
    pingTimeout:  5000,
  });

  // ─── Auth middleware ──────────────────────────────────────────────────────
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
    socketUsers.set(socket.id, socket.user.id);
    console.log(`[socket] connected: ${socket.user.username} (${socket.id})`);

    registerRoomHandlers(io, socket);
    registerMatchmaking(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', () => {
      socketUsers.delete(socket.id);
      console.log(`[socket] disconnected: ${socket.id}`);
    });
  });

  return io;
}
