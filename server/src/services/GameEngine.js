/**
 * GameEngine — pure game logic, no I/O.
 * The socket layer feeds events in, reads back a new state, then broadcasts.
 */
import { GAME, TURN_PHASE } from '../../../shared/constants.js';
import { shuffle } from '../utils/random.js';

export class GameEngine {
  /**
   * @param {object} player1 - { id, username, avatarUrl }
   * @param {object} player2
   * @param {object[]} deck   - full card pool (from DB)
   */
  constructor(player1, player2, deck) {
    this.id = null; // set after DB insert

    const sharedDeck = shuffle([...deck]);

    // Coin flip — random who goes first
    const [first, second] = Math.random() < 0.5
      ? [player1, player2]
      : [player2, player1];

    this.currentPlayerId = first.id;
    this.turn            = 1;
    this.phase           = TURN_PHASE.DRAW;
    this.status          = 'in_progress';
    this.winnerId        = null;

    this.players = {
      [first.id]:  this._initPlayer(first,  sharedDeck.slice(0, 20),  GAME.INITIAL_HAND_SIZE),
      [second.id]: this._initPlayer(second, sharedDeck.slice(20, 40), GAME.INITIAL_HAND_SIZE + 1),
    };
  }

  _initPlayer(info, deck, handSize) {
    const shuffled = shuffle([...deck]);
    return {
      id:        info.id,
      username:  info.username,
      avatarUrl: info.avatarUrl,
      health:    GAME.INITIAL_HEALTH,
      mana:      GAME.INITIAL_MANA,
      maxMana:   GAME.INITIAL_MANA,
      hand:      shuffled.splice(0, handSize).map(c => this._instanceCard(c)),
      deck:      shuffled.map(c => this._instanceCard(c)),
      board:     [],   // active cards on battlefield
      hasAttacked: false,
    };
  }

  _instanceCard(card) {
    return {
      ...card,
      instanceId:   crypto.randomUUID(),
      currentAtk:   card.attack,
      currentDef:   card.defense,
      exhausted:    true,  // can't attack until next turn
      hasAbility:   !!card.ability,
    };
  }

  // ─── Turn management ────────────────────────────────────────────────────────

  startTurn() {
    const player = this._currentPlayer();
    // Increase mana
    player.maxMana  = Math.min(player.maxMana + 1, GAME.MAX_MANA);
    player.mana     = player.maxMana;
    // Draw a card
    this._drawCard(player.id);
    // Refresh board cards
    player.board.forEach(c => { c.exhausted = false; });
    this.phase = TURN_PHASE.MAIN;
    return this.publicState();
  }

  endTurn() {
    const player = this._currentPlayer();
    // Enforce hand limit
    while (player.hand.length > GAME.MAX_HAND_SIZE) player.hand.shift();
    // Switch current player
    const ids = Object.keys(this.players);
    this.currentPlayerId = ids.find(id => id !== String(this.currentPlayerId));
    this.turn += 1;
    return this.startTurn();
  }

  // ─── Card actions ────────────────────────────────────────────────────────────

  /**
   * Play a card from hand onto the board.
   * @returns {{ ok: boolean, error?: string, state?: object }}
   */
  playCard(playerId, instanceId) {
    if (String(playerId) !== String(this.currentPlayerId)) return { ok: false, error: 'Not your turn' };
    const player = this.players[playerId];
    const cardIdx = player.hand.findIndex(c => c.instanceId === instanceId);
    if (cardIdx === -1) return { ok: false, error: 'Card not in hand' };
    const card = player.hand[cardIdx];
    if (card.cost > player.mana) return { ok: false, error: 'Not enough mana' };
    if (player.board.length >= GAME.MAX_BOARD_CARDS) return { ok: false, error: 'Board is full' };

    player.mana -= card.cost;
    player.hand.splice(cardIdx, 1);
    // 'charge' ability: not exhausted
    card.exhausted = card.ability !== 'charge';
    player.board.push(card);
    return { ok: true, state: this.publicState() };
  }

  /**
   * Attack with a board card.
   * Target can be opponent's board card or the opponent hero ('hero').
   */
  attackWith(playerId, attackerInstanceId, targetId) {
    if (String(playerId) !== String(this.currentPlayerId)) return { ok: false, error: 'Not your turn' };
    const player   = this._currentPlayer();
    const opponent = this._opponentPlayer();

    const attacker = player.board.find(c => c.instanceId === attackerInstanceId);
    if (!attacker)           return { ok: false, error: 'Attacker not on board' };
    if (attacker.exhausted)  return { ok: false, error: 'Card already attacked this turn' };

    // Check taunt: opponent must have taunt minions if so
    const tauntMinions = opponent.board.filter(c => c.ability === 'taunt');
    if (tauntMinions.length && targetId !== 'hero' && !tauntMinions.find(c => c.instanceId === targetId)) {
      return { ok: false, error: 'Must attack taunt minion first' };
    }

    attacker.exhausted = true;

    if (targetId === 'hero') {
      let dmg = attacker.currentAtk;
      // divine_shield blocks first hit
      opponent.health -= dmg;
      if (attacker.ability === 'lifesteal') player.health = Math.min(GAME.INITIAL_HEALTH, player.health + dmg);
    } else {
      const target = opponent.board.find(c => c.instanceId === targetId);
      if (!target) return { ok: false, error: 'Target not found' };

      target.currentDef  -= attacker.currentAtk;
      attacker.currentDef -= target.currentAtk;

      if (target.currentDef <= 0)    opponent.board = opponent.board.filter(c => c.instanceId !== targetId);
      if (attacker.currentDef <= 0)  player.board   = player.board.filter(c => c.instanceId !== attackerInstanceId);
    }

    this._checkWin();
    return { ok: true, state: this.publicState() };
  }

  // ─── Internal helpers ────────────────────────────────────────────────────────

  _drawCard(playerId) {
    const player = this.players[playerId];
    if (player.deck.length === 0) { player.health -= 1; return; }
    const [drawn] = player.deck.splice(0, 1);
    player.hand.push(drawn);
  }

  _currentPlayer()  { return this.players[this.currentPlayerId]; }
  _opponentPlayer() {
    const ids = Object.keys(this.players);
    const oppId = ids.find(id => id !== String(this.currentPlayerId));
    return this.players[oppId];
  }

  _checkWin() {
    const [p1, p2] = Object.values(this.players);
    if (p1.health <= 0) { this.winnerId = p2.id; this.status = 'finished'; }
    if (p2.health <= 0) { this.winnerId = p1.id; this.status = 'finished'; }
  }

  // ─── State serialisation ─────────────────────────────────────────────────────

  /**
   * Returns state safe to broadcast to BOTH clients.
   * Each player's hand is NOT included here — send privately via PLAYER_HAND.
   */
  publicState() {
    const players = {};
    for (const [id, p] of Object.entries(this.players)) {
      players[id] = {
        id:        p.id,
        username:  p.username,
        avatarUrl: p.avatarUrl,
        health:    p.health,
        mana:      p.mana,
        maxMana:   p.maxMana,
        board:     p.board,
        handSize:  p.hand.length,
        deckSize:  p.deck.length,
      };
    }
    return {
      gameId:          this.id,
      turn:            this.turn,
      phase:           this.phase,
      currentPlayerId: this.currentPlayerId,
      status:          this.status,
      winnerId:        this.winnerId,
      players,
    };
  }

  /** Returns each player's private hand — call for each player separately. */
  privateHand(playerId) {
    return this.players[playerId]?.hand ?? [];
  }
}
