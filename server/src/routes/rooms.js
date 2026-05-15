import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

// List open rooms
router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const rooms = await query(
      `SELECT r.id, r.code, r.status, u.username AS host, r.created_at
       FROM rooms r JOIN users u ON u.id = r.host_id
       WHERE r.status = 'waiting' ORDER BY r.created_at DESC LIMIT 20`
    );
    res.json(rooms);
  } catch (err) { next(err); }
});

export default router;
