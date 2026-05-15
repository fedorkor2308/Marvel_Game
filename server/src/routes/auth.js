import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register',
  body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  register
);

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  login
);

router.post('/refresh', refresh);

export default router;
