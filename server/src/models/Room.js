import { query } from '../config/db.js';

export const Room = {
  getOpen: () =>
    query(
      `SELECT r.id, r.code, r.status, u.username AS host, r.created_at
       FROM rooms r JOIN users u ON u.id = r.host_id
       WHERE r.status = 'waiting'
       ORDER BY r.created_at DESC LIMIT 20`
    ),
};