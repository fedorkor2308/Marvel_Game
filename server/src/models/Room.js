import { query } from '../config/db.js';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode() {
  let code = '';
  for (let i = 0; i < 6; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

export const Room = {
  getOpen: () =>
    query(
      `SELECT r.id, r.code, r.status, u.username AS host, r.created_at
       FROM rooms r JOIN users u ON u.id = r.host_id
       WHERE r.status = 'waiting'
       ORDER BY r.created_at DESC LIMIT 20`
    ),

  create: async (hostId) => {
    const code   = generateCode();
    const result = await query(
      'INSERT INTO rooms (code, host_id) VALUES (?, ?)',
      [code, hostId]
    );
    return { id: result.insertId, code };
  },

  findByCode: async (code) => {
    const rows = await query('SELECT * FROM rooms WHERE code = ?', [code]);
    return rows[0] ?? null;
  },

  findById: async (id) => {
    const rows = await query('SELECT * FROM rooms WHERE id = ?', [id]);
    return rows[0] ?? null;
  },

  setGuest: (roomId, guestId) =>
    query('UPDATE rooms SET guest_id = ? WHERE id = ?', [guestId, roomId]),

  setStatus: (roomId, status) =>
    query('UPDATE rooms SET status = ? WHERE id = ?', [status, roomId]),
};
