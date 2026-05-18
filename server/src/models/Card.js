import { query } from '../config/db.js';

export const Card = {
  getAll: () => query('SELECT * FROM cards ORDER BY cost, name'),
  getById: (id) => query('SELECT * FROM cards WHERE id = ?', [id]),
};