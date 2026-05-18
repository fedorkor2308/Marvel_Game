import * as E from '../../../shared/events.js';
import { Room } from '../models/Room.js';
import { initGame } from './gameHandlers.js';

const queue = new Map(); // String(userId) → socket

export function registerMatchmaking(io, socket) {
  const userId = String(socket.user.id);

  socket.on(E.MATCH_JOIN_QUEUE, async () => {
    if (queue.has(userId)) return;

    // Find a waiting opponent (not ourselves)
    const opponent = [...queue.entries()].find(([id]) => id !== userId);

    if (opponent) {
      const [opponentId, opponentSocket] = opponent;
      queue.delete(opponentId);

      try {
        const { id: roomId, code } = await Room.create(socket.user.id);
        await Room.setGuest(roomId, opponentSocket.user.id);
        await Room.setStatus(roomId, 'in_progress');

        const roomName = `room:${roomId}`;
        socket.join(roomName);
        opponentSocket.join(roomName);

        socket.emit(E.MATCH_FOUND);
        opponentSocket.emit(E.MATCH_FOUND);

        await initGame(io, socket, opponentSocket, roomName);
      } catch (err) {
        console.error('[matchmaking] error:', err);
      }
    } else {
      queue.set(userId, socket);
    }
  });

  socket.on(E.MATCH_LEAVE_QUEUE, () => {
    queue.delete(userId);
  });

  socket.on('disconnect', () => {
    queue.delete(userId);
  });
}
