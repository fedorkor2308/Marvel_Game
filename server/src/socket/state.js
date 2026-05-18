export const activeGames  = new Map(); // gameId → GameEngine
export const activeTimers = new Map(); // gameId → TurnTimer
export const playerToGame = new Map(); // String(userId) → gameId
export const gameToRoom   = new Map(); // gameId → roomName (socket room string)
export const userSockets  = new Map(); // String(userId) → socket
