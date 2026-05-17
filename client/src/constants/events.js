// Mirror of shared/events.js — keep in sync with the server
export const MATCH_JOIN_QUEUE  = 'match:joinQueue';
export const MATCH_LEAVE_QUEUE = 'match:leaveQueue';
export const MATCH_FOUND       = 'match:found';

export const ROOM_CREATE = 'room:create';
export const ROOM_JOIN   = 'room:join';
export const ROOM_LEAVE  = 'room:leave';
export const ROOM_READY  = 'room:ready';
export const ROOM_STATE  = 'room:state';

export const GAME_START     = 'game:start';
export const GAME_STATE     = 'game:state';
export const GAME_END       = 'game:end';
export const GAME_RECONNECT = 'game:reconnect';

export const TURN_END     = 'turn:end';
export const TURN_TICK    = 'turn:tick';

export const CARD_PLAY   = 'card:play';
export const CARD_ATTACK = 'card:attack';

export const PLAYER_HAND       = 'player:hand';
export const PLAYER_DISCONNECT = 'player:disconnect';
export const PLAYER_RECONNECT  = 'player:reconnect';

export const CHAT_MESSAGE = 'chat:message';
export const ERROR        = 'error';
