export const GAME = {
  INITIAL_HEALTH:        20,
  INITIAL_MANA:          1,
  MAX_MANA:              7,
  INITIAL_HAND_SIZE:     3,
  MAX_HAND_SIZE:         10,
  TURN_DURATION_SEC:     30,
  MAX_BOARD_CARDS:       6,
  MAX_CARDS_PER_MATCH:   6,
  MAX_TURNS:             30,
  RECONNECT_TIMEOUT_SEC: 60,
};

export const CARD_RARITY = {
  COMMON:    'common',
  RARE:      'rare',
  EPIC:      'epic',
  LEGENDARY: 'legendary',
};

export const GAME_STATUS = {
  WAITING:     'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED:    'finished',
  ABANDONED:   'abandoned',
};

export const TURN_PHASE = {
  DRAW:   'draw',
  MAIN:   'main',
  COMBAT: 'combat',
  END:    'end',
};
