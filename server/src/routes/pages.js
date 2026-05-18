import { Router } from 'express';
const router = Router();

router.get('/',            (_req, res) => res.redirect('/login'));
router.get('/login',       (_req, res) => res.render('login'));
router.get('/register',    (_req, res) => res.render('register'));
router.get('/lobby',       (_req, res) => res.render('lobby'));
router.get('/game',        (_req, res) => res.render('game'));
router.get('/leaderboard', (_req, res) => res.render('leaderboard'));

export default router;
