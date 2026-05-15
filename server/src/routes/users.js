import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [user] = await query(
      'SELECT id, username, email, avatar_url, wins, losses, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.patch('/me/avatar', requireAuth, async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    await query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);
    res.json({ avatarUrl });
  } catch (err) { next(err); }
});

export default router;
