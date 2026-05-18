import { query } from '../config/db.js';

export const User = {
  findById: (id) =>
    query(
      'SELECT id, username, email, avatar_url, wins, losses FROM users WHERE id = ?',
      [id]
    ),

  // For Dev 3 to call
  updateStats: async (winnerId, loserId) => {
    await query('UPDATE users SET wins = wins + 1 WHERE id = ?', [winnerId]);
    await query('UPDATE users SET losses = losses + 1 WHERE id = ?', [loserId]);
  },
};