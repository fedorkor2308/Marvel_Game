import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT username, avatar_url, wins, losses,
              ROUND(wins / GREATEST(wins + losses, 1) * 100, 1) AS win_rate
       FROM users WHERE wins + losses > 0
       ORDER BY wins DESC, losses ASC LIMIT 50`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
