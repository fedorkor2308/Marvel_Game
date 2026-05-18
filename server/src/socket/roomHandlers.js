import * as E from '../../../shared/events.js';
import { Room } from '../models/Room.js';
import { initGame } from './gameHandlers.js';

function findSocketByUserId(io, userId) {
  for (const [, sock] of io.sockets.sockets) {
    if (String(sock.user?.id) === String(userId)) return sock;
  }
  return null;
}

export function registerRoomHandlers(io, socket) {
  const { id: userId, username } = socket.user;

  socket.on(E.ROOM_CREATE, async () => {
    try {
      const { id: roomId, code } = await Room.create(userId);
      const roomName = `room:${roomId}`;
      socket.join(roomName);
      socket.emit(E.ROOM_STATE, { roomId, code, status: 'waiting', host: username });
    } catch (err) {
      console.error('[ROOM_CREATE]', err);
      socket.emit(E.ERROR, { message: 'Could not create room' });
    }
  });

  socket.on(E.ROOM_JOIN, async ({ code }) => {
    try {
      const room = await Room.findByCode(code);
      if (!room)
        return socket.emit(E.ERROR, { message: 'Room not found' });
      if (room.status !== 'waiting')
        return socket.emit(E.ERROR, { message: 'Room is not available' });
      if (String(room.host_id) === String(userId))
        return socket.emit(E.ERROR, { message: 'You created this room' });

      const hostSocket = findSocketByUserId(io, room.host_id);
      if (!hostSocket)
        return socket.emit(E.ERROR, { message: 'Host has disconnected' });

      await Room.setStatus(room.id, 'in_progress');
      const roomName = `room:${room.id}`;
      socket.join(roomName);

      io.to(roomName).emit(E.ROOM_STATE, {
        roomId: room.id,
        code:   room.code,
        status: 'starting',
      });

      await initGame(io, hostSocket, socket, roomName);
    } catch (err) {
      console.error('[ROOM_JOIN]', err);
      socket.emit(E.ERROR, { message: 'Could not join room' });
    }
  });

  socket.on(E.ROOM_LEAVE, () => {
    for (const room of socket.rooms) {
      if (room.startsWith('room:')) socket.leave(room);
    }
  });

  socket.on(E.CHAT_MESSAGE, ({ text }) => {
    const room = [...socket.rooms].find(r => r.startsWith('room:'));
    if (!room) return;
    io.to(room).emit(E.CHAT_MESSAGE, {
      from: username,
      text: String(text).slice(0, 200),
      ts:   Date.now(),
    });
  });
}
