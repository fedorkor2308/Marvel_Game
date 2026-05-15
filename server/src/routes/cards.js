import { Router } from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const cards = await query('SELECT * FROM cards ORDER BY cost, name');
    res.json(cards);
  } catch (err) { next(err); }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const [card] = await query('SELECT * FROM cards WHERE id = ?', [req.params.id]);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) { next(err); }
});

export default router;
