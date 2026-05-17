import * as E          from '../../../shared/events.js';
import { Room }        from '../models/Room.js';
import { userSockets } from './state.js';
import { initGame }    from './gameHandlers.js';

/** roomId → Set<userId> of players who clicked Ready */
const readySet = new Map();

export function registerRoomHandlers(io, socket) {

  // ── Create a private room ──────────────────────────────────────────────────
  socket.on(E.ROOM_CREATE, async () => {
    try {
      const room = await Room.create(socket.user.id);
      socket.join(`room:${room.id}`);
      socket.data.roomId = room.id;
      readySet.set(room.id, new Set());

      socket.emit(E.ROOM_STATE, {
        roomId: room.id,
        code:   room.code,
        host:   { id: socket.user.id, username: socket.user.username },
        guest:  null,
        status: 'waiting',
      });
    } catch {
      socket.emit(E.ERROR, { message: 'Could not create room' });
    }
  });

  // ── Join a room by 6-char code ─────────────────────────────────────────────
  socket.on(E.ROOM_JOIN, async ({ code }) => {
    try {
      const room = await Room.findByCode(String(code).toUpperCase());
      if (!room)                         return socket.emit(E.ERROR, { message: 'Room not found' });
      if (room.status !== 'waiting')     return socket.emit(E.ERROR, { message: 'Room is not open' });
      if (room.host_id === socket.user.id) return socket.emit(E.ERROR, { message: 'Cannot join your own room' });

      await Room.setGuest(room.id, socket.user.id);
      socket.join(`room:${room.id}`);
      socket.data.roomId = room.id;
      if (!readySet.has(room.id)) readySet.set(room.id, new Set());

      io.to(`room:${room.id}`).emit(E.ROOM_STATE, {
        roomId: room.id,
        code:   room.code,
        host:   { id: room.host_id },
        guest:  { id: socket.user.id, username: socket.user.username },
        status: 'both_joined',
      });
    } catch {
      socket.emit(E.ERROR, { message: 'Could not join room' });
    }
  });

  // ── Mark yourself ready ────────────────────────────────────────────────────
  socket.on(E.ROOM_READY, async () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const ready = readySet.get(roomId);
    if (!ready) return;
    ready.add(socket.user.id);

    io.to(`room:${roomId}`).emit(E.ROOM_STATE, {
      roomId,
      readyCount: ready.size,
      status: ready.size >= 2 ? 'starting' : 'ready',
    });

    if (ready.size >= 2) {
      readySet.delete(roomId);

      const room = await Room.findById(roomId);
      if (!room) return;

      const p1 = userSockets.get(room.host_id);
      const p2 = userSockets.get(room.guest_id);
      if (!p1 || !p2) {
        io.to(`room:${roomId}`).emit(E.ERROR, { message: 'A player disconnected before start' });
        return;
      }

      await Room.setStatus(roomId, 'in_progress');
      await initGame(io, p1, p2, roomId);
    }
  });

  // ── Leave room before game starts ──────────────────────────────────────────
  socket.on(E.ROOM_LEAVE, () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    socket.leave(`room:${roomId}`);
    socket.data.roomId = null;
    readySet.delete(roomId);
    socket.to(`room:${roomId}`).emit(E.ROOM_STATE, { roomId, status: 'abandoned' });
  });

  // ── In-room chat ───────────────────────────────────────────────────────────
  socket.on(E.CHAT_MESSAGE, ({ text }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !text?.trim()) return;
    io.to(`room:${roomId}`).emit(E.CHAT_MESSAGE, {
      userId:   socket.user.id,
      username: socket.user.username,
      text:     String(text).slice(0, 200),
      ts:       Date.now(),
    });
  });
}
