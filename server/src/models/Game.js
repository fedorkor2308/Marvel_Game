import { query } from '../config/db.js';

export const Game = {
  create: (roomId, player1Id, player2Id) =>
    query(
      'INSERT INTO games (room_id, player1_id, player2_id) VALUES (?, ?, ?)',
      [roomId, player1Id, player2Id]
    ),

  finish: (gameId, winnerId, turnsPlayed) =>
    query(
      'UPDATE games SET winner_id = ?, turns_played = ?, ended_at = NOW() WHERE id = ?',
      [winnerId, turnsPlayed, gameId]
    ),
};