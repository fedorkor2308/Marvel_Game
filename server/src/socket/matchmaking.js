import * as E    from '../../../shared/events.js';
import { Room }  from '../models/Room.js';
import { initGame } from './gameHandlers.js';

/** userId → socket — players currently in the auto-match queue */
const queue = new Map();

export function registerMatchmaking(io, socket) {
  socket.on(E.MATCH_JOIN_QUEUE, async () => {
    const uid = socket.user.id;
    if (queue.has(uid)) return; // already queued, ignore

    if (queue.size === 0) {
      // First player — wait in queue
      queue.set(uid, socket);
      socket.emit('match:queued', { position: 1 });
      return;
    }

    // Second player arrives — pair immediately
    const [[waitingUid, waitingSocket]] = queue;
    queue.delete(waitingUid);

    try {
      // Create a DB room owned by the waiting player
      const room = await Room.create(waitingUid);
      await Room.setGuest(room.id, uid);
      await Room.setStatus(room.id, 'in_progress');

      // Both join the socket room
      waitingSocket.join(`room:${room.id}`);
      socket.join(`room:${room.id}`);
      waitingSocket.data.roomId = room.id;
      socket.data.roomId        = room.id;

      io.to(`room:${room.id}`).emit(E.MATCH_FOUND, { roomId: room.id });

      await initGame(io, waitingSocket, socket, room.id);
    } catch (err) {
      console.error('[matchmaking] pairing error:', err);
      // Put the waiting player back so they are not stuck
      queue.set(waitingUid, waitingSocket);
      socket.emit(E.ERROR, { message: 'Matchmaking failed, please try again' });
    }
  });

  socket.on(E.MATCH_LEAVE_QUEUE, () => {
    queue.delete(socket.user.id);
  });

  // Clean up if player disconnects while queuing
  socket.on('disconnect', () => {
    queue.delete(socket.user.id);
  });
}
