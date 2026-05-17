import { query } from '../config/db.js';

export async function getLeaderboard(_req, res, next) {
  try {
    const rows = await query(
      `SELECT username, avatar_url, wins, losses,
              ROUND(wins / GREATEST(wins + losses, 1) * 100, 1) AS win_rate
       FROM users WHERE wins + losses > 0
       ORDER BY wins DESC, losses ASC LIMIT 50`
    );
    res.json(rows);
  } catch (err) { next(err); }
}