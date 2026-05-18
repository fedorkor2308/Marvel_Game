import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerMatchmaking } from './matchmaking.js';
import { registerGameHandlers } from './gameHandlers.js';
import { registerRoomHandlers }  from './roomHandlers.js';
import { userSockets, playerToGame, gameToRoom } from './state.js';

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
    userSockets.set(String(socket.user.id), socket);
    console.log(`[socket] connected: ${socket.user.username} (${socket.id})`);

    registerRoomHandlers(io, socket);
    registerMatchmaking(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`[socket] disconnected: ${socket.id}`);

      // Only act if this is still the active socket for this user.
      // If the player navigated (lobby → game), the game socket already
      // replaced this one in userSockets — don't delete it or fire disconnect.
      if (userSockets.get(String(socket.user.id)) !== socket) return;

      userSockets.delete(String(socket.user.id));

      const gameId = playerToGame.get(String(socket.user.id));
      if (gameId) {
        const roomName = gameToRoom.get(gameId);
        if (roomName) io.to(roomName).emit('player:disconnect');
      }
    });
  });

  return io;
}
