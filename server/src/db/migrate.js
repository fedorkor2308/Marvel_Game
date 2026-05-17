import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dir, 'migrations/001_init.sql'), 'utf8');

const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .filter(s => !s.toUpperCase().startsWith('CREATE DATABASE'))
  .filter(s => !s.toUpperCase().startsWith('USE '))
  .filter(s => !s.startsWith('--'));

for (const stmt of statements) {
  await pool.query(stmt);
}

console.log('Migration complete');
await pool.end();
process.exit(0);