function initGame() {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) { location.replace('/login'); return; }

  const firstPlayerId = sessionStorage.getItem('firstPlayerId');
  const myPlayerId    = sessionStorage.getItem('myPlayerId');
  const gameToken     = sessionStorage.getItem('gameToken');
  sessionStorage.removeItem('firstPlayerId');
  sessionStorage.removeItem('myPlayerId');
  sessionStorage.removeItem('gameToken');

  // myId is a let so player:identity from server can correct it
  let myId = myPlayerId || String(user.id);

  // ── State ──
  let gameState   = null;
  let hand        = [];
  let selectedAtk = null;
  let isMyTurn    = false;

  // ── DOM refs ──
  const coinOverlay  = document.getElementById('coin-overlay');
  const coinCircle   = document.getElementById('coin-circle');
  const coinResult   = document.getElementById('coin-result');
  const coinProceed  = document.getElementById('coin-proceed');
  const endOverlay   = document.getElementById('game-end-overlay');
  const endResult    = document.getElementById('end-result');
  const endWinner    = document.getElementById('end-winner');
  const toast        = document.getElementById('toast');
  const watermark    = document.getElementById('your-turn-watermark');
  const timerVal     = document.getElementById('timer-val');
  const endTurnBtn   = document.getElementById('end-turn-btn');
  const atkHeroBtn   = document.getElementById('attack-hero-btn');
  const myBoardEl    = document.getElementById('my-board');
  const oppBoardEl   = document.getElementById('opp-board');
  const myHandEl     = document.getElementById('my-hand');
  const sbTurn       = document.getElementById('sb-turn');
  const disconnectEl = document.getElementById('disconnect-notice');

  // ── Coin flip ──
  if (firstPlayerId) {
    const iGoFirst = String(firstPlayerId) === String(myId);
    setTimeout(() => {
      coinCircle.classList.remove('spinning');
      coinCircle.classList.add(iGoFirst ? 'done-you' : 'done-opp');
      coinCircle.innerHTML = iGoFirst ? 'HEADS' : 'TAILS';
      coinResult.textContent = iGoFirst ? 'YOU GO FIRST' : 'OPPONENT GOES FIRST';
      coinResult.className = 'coin-result ' + (iGoFirst ? 'you' : 'opp');
      coinResult.style.display = 'block';
      coinProceed.style.display = 'block';
    }, 2000);
    coinProceed.addEventListener('click', () => {
      coinOverlay.style.display = 'none';
    });
  } else {
    coinOverlay.style.display = 'none';
  }

  // ── Socket ──
  const socket = io({ auth: { token: gameToken || token } });

  socket.on('connect_error', (err) => {
    if (err.message === 'Invalid token' || err.message === 'Missing token') {
      localStorage.clear();
      sessionStorage.clear();
      location.replace('/login');
    }
  });

  socket.on('connect', () => {
    socket.emit('game:reconnect');
  });

  // Server confirms who this player is — fixes any myId mismatch
  socket.on('player:identity', ({ myPlayerId: confirmedId }) => {
    myId = String(confirmedId);
  });

  socket.on('game:state', (state) => {
    const prev = gameState;
    gameState = state;

    // Log all player health values every time state arrives
    const healthSummary = Object.values(state.players).map(p => `${p.username}:${p.health}hp`).join(' | ');
    console.log(`[state] turn=${state.turn} currentPlayer=${state.currentPlayerId} myId=${myId} | ${healthSummary}`);

    // Flash HP when it changes
    if (prev) {
      const prevMe  = prev.players[myId];
      const prevOpp = prev.players[_oppId()];
      const newMe   = state.players[myId];
      const newOpp  = state.players[_oppId()];

      if (prevMe && newMe && prevMe.health !== newMe.health)   _flashHp('my-hp',  prevMe.health > newMe.health);
      if (prevOpp && newOpp && prevOpp.health !== newOpp.health) _flashHp('opp-hp', prevOpp.health > newOpp.health);
    }

    renderState();
  });

  socket.on('player:hand', (h) => {
    hand = h;
    renderHand();
  });

  socket.on('turn:tick', (sec) => {
    timerVal.textContent = sec;
    timerVal.className = 't-val' + (sec <= 10 ? ' urgent' : '');
  });

  socket.on('game:end', (data) => {
    if (data.winnerId === null || data.winnerId === undefined) {
      endResult.textContent = 'DRAW';
      endResult.className = 'end-result draw';
      endWinner.textContent = 'MATCH ENDED — TURN LIMIT REACHED';
    } else {
      const isWin = String(data.winnerId) === String(myId);
      endResult.textContent = isWin ? 'VICTORY' : 'DEFEAT';
      endResult.className = 'end-result ' + (isWin ? 'win' : 'loss');
      endWinner.textContent = 'WINNER: ' + (data.winnerUsername || '---').toUpperCase();
    }
    endOverlay.style.display = 'flex';
  });

  socket.on('player:disconnect', () => { disconnectEl.style.display = 'block'; });
  socket.on('player:reconnect',  () => { disconnectEl.style.display = 'none';  });

  socket.on('error', ({ message }) => {
    console.warn('[game] server rejected:', message);
    showToast(message);
  });

  // ── Actions ──
  endTurnBtn.addEventListener('click', () => {
    socket.emit('turn:end');
    selectedAtk = null;
    atkHeroBtn.style.display = 'none';
  });

  atkHeroBtn.addEventListener('click', () => {
    if (!selectedAtk) return;
    socket.emit('card:attack', { attackerInstanceId: selectedAtk, targetId: 'hero' });
    selectedAtk = null;
    atkHeroBtn.style.display = 'none';
  });

  // ── Helpers ──
  function _oppId() {
    if (!gameState) return null;
    return Object.keys(gameState.players).find(id => String(id) !== String(myId));
  }

  function _flashHp(elemId, isDamage) {
    const el = document.getElementById(elemId);
    if (!el) return;
    el.classList.remove('hp-damage', 'hp-heal');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add(isDamage ? 'hp-damage' : 'hp-heal');
    setTimeout(() => el.classList.remove('hp-damage', 'hp-heal'), 700);
  }

  // ── Render ──
  function renderState() {
    if (!gameState) return;
    isMyTurn = String(gameState.currentPlayerId) === String(myId);

    const oppId = _oppId();
    const me    = gameState.players[myId]  || {};
    const opp   = gameState.players[oppId] || {};

    document.getElementById('my-name').textContent      = (me.username  || user.username || '').toUpperCase();
    document.getElementById('opp-name').textContent     = (opp.username || '---').toUpperCase();
    const myHp  = me.health  ?? 20;
    const oppHp = opp.health ?? 20;
    console.log(`[render] me=${me.username}(${myHp}hp) opp=${opp.username}(${oppHp}hp) myTurn=${isMyTurn}`);
    document.getElementById('my-hp').textContent        = myHp;
    document.getElementById('opp-hp').textContent       = oppHp;
    document.getElementById('my-mana').textContent      = me.mana    ?? 0;
    document.getElementById('my-max-mana').textContent  = me.maxMana ?? 0;
    document.getElementById('opp-mana').textContent     = opp.mana   ?? 0;
    document.getElementById('opp-max-mana').textContent = opp.maxMana ?? 0;

    const cardsLeft = me.cardsLeft ?? (6 - (me.cardsPlayed ?? 0));
    document.getElementById('my-cards-left').textContent = cardsLeft + ' cards left';

    const turnEl = document.getElementById('sb-turn-num');
    if (turnEl) turnEl.textContent = `Turn ${gameState.turn ?? 1} / ${gameState.maxTurns ?? 30}`;

    sbTurn.textContent = isMyTurn ? 'YOUR TURN' : 'WAITING...';
    sbTurn.className   = 'turn-status' + (isMyTurn ? ' active' : '');
    watermark.style.display = isMyTurn ? 'flex' : 'none';
    endTurnBtn.style.display = isMyTurn ? 'block' : 'none';

    renderBoard(myBoardEl,  me.board  || [], true);
    renderBoard(oppBoardEl, opp.board || [], false);

    // Make opponent HUD glow and clickable when an attacker is selected
    const oppHud = document.getElementById('opp-hud');
    if (selectedAtk) {
      oppHud.classList.add('hero-targetable');
      oppHud.onclick = () => {
        socket.emit('card:attack', { attackerInstanceId: selectedAtk, targetId: 'hero' });
        selectedAtk = null;
        atkHeroBtn.style.display = 'none';
        oppHud.classList.remove('hero-targetable');
        oppHud.onclick = null;
      };
    } else {
      oppHud.classList.remove('hero-targetable');
      oppHud.onclick = null;
    }
  }

  function renderBoard(el, cards, isMe) {
    el.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const card = cards[i];
      if (!card) {
        const slot = document.createElement('div');
        slot.className = 'board-slot';
        slot.innerHTML = '<span class="empty-icon">+</span>';
        el.appendChild(slot);
      } else {
        el.appendChild(buildBoardCard(card, isMe));
      }
    }
  }

  function buildBoardCard(card, isMe) {
    const div = document.createElement('div');
    div.className = 'card-board';

    const isSelected   = isMe && card.instanceId === selectedAtk;
    const canAttack    = isMe && isMyTurn && !card.exhausted && !selectedAtk;
    const isTargetable = !isMe && !!selectedAtk;

    if (card.exhausted && isMe) div.classList.add('exhausted');
    if (canAttack)    div.classList.add('can-attack');
    if (isSelected)   div.classList.add('selected');
    if (isTargetable) div.classList.add('targetable');

    div.innerHTML = `
      <div class="card-art">
        ${card.image_url ? `<img src="${card.image_url}" alt="${card.alias || card.name}">` : ''}
        <div class="card-cost-badge">${card.cost}</div>
        ${card.exhausted && isMe ? '<div class="tired-overlay">TIRED</div>' : ''}
      </div>
      <div class="card-name">${card.alias || card.name}</div>
      <div class="card-stats">
        <span>⚔ ${card.currentAtk ?? card.attack}</span>
        <span>🛡 ${card.currentDef ?? card.defense}</span>
      </div>
    `;

    div.addEventListener('click', () => {
      if (isMe && isMyTurn && !card.exhausted) {
        if (selectedAtk === card.instanceId) {
          selectedAtk = null;
          atkHeroBtn.style.display = 'none';
        } else {
          selectedAtk = card.instanceId;
          atkHeroBtn.style.display = 'block';
        }
        renderState();
      } else if (!isMe && selectedAtk) {
        socket.emit('card:attack', { attackerInstanceId: selectedAtk, targetId: card.instanceId });
        selectedAtk = null;
        atkHeroBtn.style.display = 'none';
      }
    });

    return div;
  }

  function renderHand() {
    myHandEl.innerHTML = '';
    const me = gameState?.players?.[myId] || {};
    const currentMana  = me.mana      ?? 0;
    const cardsLeft    = me.cardsLeft ?? 6;

    hand.forEach((card) => {
      const affordable = card.cost <= currentMana;
      const hasSlots   = (me.board?.length ?? 0) < 6;
      const canPlay    = isMyTurn && affordable && hasSlots && cardsLeft > 0;
      const div = document.createElement('div');
      div.className = 'card-hand' + (canPlay ? ' playable' : (isMyTurn && !affordable ? ' unaffordable' : ''));

      div.innerHTML = `
        <div class="card-art">
          ${card.image_url ? `<img src="${card.image_url}" alt="${card.alias || card.name}">` : ''}
          <div class="card-cost-badge">${card.cost}</div>
        </div>
        <div class="card-name">${card.alias || card.name}</div>
        <div class="card-stats">
          <span>⚔ ${card.attack}</span>
          <span>🛡 ${card.defense}</span>
        </div>
      `;

      if (canPlay) {
        div.addEventListener('click', () => {
          socket.emit('card:play', { instanceId: card.instanceId });
        });
      }

      myHandEl.appendChild(div);
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.style.display = 'none'; }, 6000);
  }
}
