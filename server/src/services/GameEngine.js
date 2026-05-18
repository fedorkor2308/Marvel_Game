import { GAME, TURN_PHASE } from '../../../shared/constants.js';
import { shuffle } from '../utils/random.js';

export class GameEngine {
  constructor(player1, player2, deck) {
    this.id     = null;
    this.status = 'in_progress';
    this.winnerId = null;

    const [first, second] = Math.random() < 0.5
      ? [player1, player2]
      : [player2, player1];

    this.currentPlayerId = first.id;
    this.turn            = 1;
    this.phase           = TURN_PHASE.DRAW;

    this.players = {
      [first.id]:  this._initPlayer(first,  [...deck]),
      [second.id]: this._initPlayer(second, [...deck]),
    };
  }

  _initPlayer(info, deck) {
    const shuffled = shuffle([...deck]);
    const hand = shuffled.splice(0, GAME.INITIAL_HAND_SIZE);

    // Guarantee at least one card is playable on turn 1 (mana = INITIAL_MANA + 1)
    const startMana = GAME.INITIAL_MANA + 1;
    if (!hand.some(c => c.cost <= startMana)) {
      const cheapIdx = shuffled.findIndex(c => c.cost <= startMana);
      if (cheapIdx !== -1) {
        const mostExpIdx = hand.reduce((max, c, i, arr) => c.cost > arr[max].cost ? i : max, 0);
        [hand[mostExpIdx], shuffled[cheapIdx]] = [shuffled[cheapIdx], hand[mostExpIdx]];
      }
    }

    return {
      id:          info.id,
      username:    info.username,
      avatarUrl:   info.avatarUrl,
      health:      GAME.INITIAL_HEALTH,
      mana:        GAME.INITIAL_MANA,
      maxMana:     GAME.INITIAL_MANA,
      hand:        hand.map(c => this._instanceCard(c)),
      deck:        shuffled.map(c => this._instanceCard(c)),
      board:       [],
      cardsPlayed: 0,
    };
  }

  _instanceCard(card) {
    return {
      ...card,
      instanceId:  crypto.randomUUID(),
      currentAtk:  card.attack,
      currentDef:  card.defense,
      exhausted:   true,
      hasAbility:  !!card.ability,
    };
  }

  // ── Turn management ──────────────────────────────────────────────────────────

  startTurn() {
    const player = this._currentPlayer();
    player.maxMana = Math.min(player.maxMana + 1, GAME.MAX_MANA);
    player.mana    = player.maxMana;
    // Skip the draw on turn 1 so both players start with the same hand size
    if (this.turn > 1) this._drawCard(player.id);
    player.board.forEach(c => { c.exhausted = false; });
    this.phase = TURN_PHASE.MAIN;
    return this.publicState();
  }

  endTurn() {
    const player = this._currentPlayer();
    while (player.hand.length > GAME.MAX_HAND_SIZE) player.hand.shift();

    // Hard turn cap — decide winner by HP
    if (this.turn >= GAME.MAX_TURNS) {
      this._finishByHP();
      return this.publicState();
    }

    const ids = Object.keys(this.players);
    this.currentPlayerId = ids.find(id => id !== String(this.currentPlayerId));
    this.turn += 1;
    return this.startTurn();
  }

  // ── Card actions ─────────────────────────────────────────────────────────────

  playCard(playerId, instanceId) {
    if (String(playerId) !== String(this.currentPlayerId))
      return { ok: false, error: 'Not your turn' };

    const player = this.players[playerId];

    if (player.cardsPlayed >= GAME.MAX_CARDS_PER_MATCH)
      return { ok: false, error: 'Card limit reached (6 per match)' };

    const cardIdx = player.hand.findIndex(c => c.instanceId === instanceId);
    if (cardIdx === -1) return { ok: false, error: 'Card not in hand' };

    const card = player.hand[cardIdx];
    if (card.cost > player.mana) return { ok: false, error: 'Not enough mana' };
    if (player.board.length >= GAME.MAX_BOARD_CARDS)
      return { ok: false, error: 'Board is full (6 cards max)' };

    player.mana -= card.cost;
    player.hand.splice(cardIdx, 1);
    card.exhausted = card.ability !== 'charge';
    player.board.push(card);
    player.cardsPlayed++;

    return { ok: true, state: this.publicState() };
  }

  attackWith(playerId, attackerInstanceId, targetId) {
    if (String(playerId) !== String(this.currentPlayerId))
      return { ok: false, error: 'Not your turn' };

    const player   = this._currentPlayer();
    const opponent = this._opponentPlayer();

    const attacker = player.board.find(c => c.instanceId === attackerInstanceId);
    if (!attacker)          return { ok: false, error: 'Attacker not on board' };
    if (attacker.exhausted) return { ok: false, error: 'Card is exhausted — wait next turn' };

    const tauntMinions = opponent.board.filter(c => c.ability === 'taunt');
    if (tauntMinions.length) {
      const hittingTaunt = tauntMinions.find(c => c.instanceId === targetId);
      if (!hittingTaunt)
        return { ok: false, error: 'Must attack a taunt minion first' };
    }

    // Validate target exists BEFORE exhausting the attacker
    if (targetId !== 'hero') {
      const targetExists = opponent.board.find(c => c.instanceId === targetId);
      if (!targetExists) return { ok: false, error: 'Target not found' };
    }

    attacker.exhausted = true;

    if (targetId === 'hero') {
      const dmg = attacker.currentAtk;
      console.log(`[attack-hero] ${player.username} hits ${opponent.username} for ${dmg}. HP: ${opponent.health} → ${opponent.health - dmg}`);
      opponent.health -= dmg;
      if (attacker.ability === 'lifesteal')
        player.health = Math.min(GAME.INITIAL_HEALTH, player.health + dmg);
    } else {
      const target = opponent.board.find(c => c.instanceId === targetId);

      target.currentDef   -= attacker.currentAtk;
      attacker.currentDef -= target.currentAtk;

      if (attacker.ability === 'lifesteal')
        player.health = Math.min(GAME.INITIAL_HEALTH, player.health + attacker.currentAtk);

      if (target.currentDef <= 0)
        opponent.board = opponent.board.filter(c => c.instanceId !== targetId);
      if (attacker.currentDef <= 0)
        player.board = player.board.filter(c => c.instanceId !== attackerInstanceId);
    }

    this._checkWin();
    return { ok: true, state: this.publicState() };
  }

  // ── Internal helpers ──────────────────────────────────────────────────────────

  _drawCard(playerId) {
    const player = this.players[playerId];
    if (player.deck.length === 0) { player.health -= 1; return; }
    const [drawn] = player.deck.splice(0, 1);
    player.hand.push(drawn);
  }

  _currentPlayer()  { return this.players[this.currentPlayerId]; }

  _opponentPlayer() {
    const oppId = Object.keys(this.players).find(id => id !== String(this.currentPlayerId));
    return this.players[oppId];
  }

  _checkWin() {
    const [p1, p2] = Object.values(this.players);
    if (p1.health <= 0 && p2.health <= 0) {
      this.status   = 'finished';
      this.winnerId = null; // simultaneous KO → draw
    } else if (p1.health <= 0) {
      this.winnerId = p2.id;
      this.status   = 'finished';
    } else if (p2.health <= 0) {
      this.winnerId = p1.id;
      this.status   = 'finished';
    }
  }

  _finishByHP() {
    const [p1, p2] = Object.values(this.players);
    this.status = 'finished';
    if (p1.health === p2.health) {
      this.winnerId = null; // draw
    } else {
      this.winnerId = p1.health > p2.health ? p1.id : p2.id;
    }
  }

  // ── State serialisation ───────────────────────────────────────────────────────

  publicState() {
    const players = {};
    for (const [id, p] of Object.entries(this.players)) {
      players[id] = {
        id:           p.id,
        username:     p.username,
        avatarUrl:    p.avatarUrl,
        health:       p.health,
        mana:         p.mana,
        maxMana:      p.maxMana,
        board:        p.board,
        handSize:     p.hand.length,
        deckSize:     p.deck.length,
        cardsPlayed:  p.cardsPlayed,
        cardsLeft:    GAME.MAX_CARDS_PER_MATCH - p.cardsPlayed,
      };
    }
    return {
      gameId:          this.id,
      turn:            this.turn,
      maxTurns:        GAME.MAX_TURNS,
      phase:           this.phase,
      currentPlayerId: this.currentPlayerId,
      status:          this.status,
      winnerId:        this.winnerId,
      players,
    };
  }

  privateHand(playerId) {
    return this.players[playerId]?.hand ?? [];
  }
}
