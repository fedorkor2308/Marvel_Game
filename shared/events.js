/**
 * All Socket.IO event names shared between client and server.
 * Single source of truth — never hardcode strings elsewhere.
 */

// ─── Matchmaking ────────────────────────────────────────────────────────────
export const MATCH_JOIN_QUEUE    = 'match:joinQueue';
export const MATCH_LEAVE_QUEUE   = 'match:leaveQueue';
export const MATCH_FOUND         = 'match:found';
export const MATCH_REJECTED      = 'match:rejected';

// ─── Room / Lobby ────────────────────────────────────────────────────────────
export const ROOM_CREATE         = 'room:create';
export const ROOM_JOIN           = 'room:join';
export const ROOM_LEAVE          = 'room:leave';
export const ROOM_READY          = 'room:ready';
export const ROOM_STATE          = 'room:state';
export const ROOM_LIST           = 'room:list';

// ─── Game lifecycle ──────────────────────────────────────────────────────────
export const GAME_START          = 'game:start';
export const GAME_STATE          = 'game:state';
export const GAME_END            = 'game:end';
export const GAME_RECONNECT      = 'game:reconnect';

// ─── Turn ────────────────────────────────────────────────────────────────────
export const TURN_START          = 'turn:start';
export const TURN_END            = 'turn:end';
export const TURN_TIMEOUT        = 'turn:timeout';
export const TURN_TICK           = 'turn:tick';       // server → client every second

// ─── Card actions ────────────────────────────────────────────────────────────
export const CARD_PLAY           = 'card:play';       // client → server
export const CARD_ATTACK         = 'card:attack';     // client → server
export const CARD_PLAYED         = 'card:played';     // server → both clients
export const CARD_ATTACKED       = 'card:attacked';   // server → both clients
export const CARD_DESTROYED      = 'card:destroyed';

// ─── Player state ────────────────────────────────────────────────────────────
export const PLAYER_HEALTH       = 'player:health';
export const PLAYER_MANA         = 'player:mana';
export const PLAYER_HAND         = 'player:hand';     // private — only to owner
export const PLAYER_DISCONNECT   = 'player:disconnect';
export const PLAYER_RECONNECT    = 'player:reconnect';

// ─── Chat ────────────────────────────────────────────────────────────────────
export const CHAT_MESSAGE        = 'chat:message';
export const CHAT_EMOTE          = 'chat:emote';

// ─── Errors ──────────────────────────────────────────────────────────────────
export const ERROR               = 'error';
