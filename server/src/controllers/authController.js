import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

function signAccess(payload)  { return jwt.sign(payload, process.env.JWT_ACCESS_SECRET,  { expiresIn: process.env.JWT_ACCESS_EXPIRES  }); }
function signRefresh(payload) { return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES }); }

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length) return res.status(409).json({ error: 'Username or email already taken' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await query(
      'INSERT INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      [username, email, hash, `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`]
    );

    const payload = { id: result.insertId, username };
    res.status(201).json({
      accessToken:  signAccess(payload),
      refreshToken: signRefresh(payload),
      user: { id: result.insertId, username, email },
    });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [user] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username };
    res.json({
      accessToken:  signAccess(payload),
      refreshToken: signRefresh(payload),
      user: { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatar_url },
    });
  } catch (err) { next(err); }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newPayload = { id: payload.id, username: payload.username };
    res.json({ accessToken: signAccess(newPayload) });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}
