/**
 * Shared in-memory state for all socket modules.
 * Single source of truth — import from here, never duplicate these maps.
 */

/** gameId → GameEngine instance */
export const activeGames = new Map();

/** gameId → TurnTimer instance */
export const activeTimers = new Map();

/** userId → gameId  (lets any handler find a player's current game) */
export const playerToGame = new Map();

/** gameId → roomId  (lets game handlers know which socket room to broadcast to) */
export const gameToRoom = new Map();

/** userId → socket  (needed to emit private events like player:hand) */
export const userSockets = new Map();

/**
 * userId → { gameId, roomId, ts }
 * Written on disconnect so the reconnect handler can restore the session
 * within GAME.RECONNECT_TIMEOUT_SEC seconds.
 */
export const disconnectLog = new Map();
