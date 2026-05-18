import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes     from './routes/auth.js';
import userRoutes     from './routes/users.js';
import cardRoutes     from './routes/cards.js';
import roomRoutes     from './routes/rooms.js';
import leaderRoutes   from './routes/leaderboard.js';
import pageRoutes     from './routes/pages.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// ─── View engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', join(__dirname, '../views'));

// ─── Static files ────────────────────────────────────────────────────────────
app.use(express.static(join(__dirname, '../public')));

// ─── Security / middleware ───────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api', limiter);

// ─── Page routes ─────────────────────────────────────────────────────────────
app.use('/', pageRoutes);

// ─── API routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/cards',       cardRoutes);
app.use('/api/rooms',       roomRoutes);
app.use('/api/leaderboard', leaderRoutes);

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

// ─── Error handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
