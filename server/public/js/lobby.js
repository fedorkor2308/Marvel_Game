function initLobby() {
  const token = getToken();
  const user  = getUser();
  if (!token || !user) { location.replace('/login'); return; }

  document.getElementById('opr-name').textContent = 'OPR: ' + user.username;
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    location.replace('/login');
  });

  const socket = io({ auth: { token } });
  const status = document.getElementById('status-bar');

  socket.on('connect_error', (err) => {
    if (err.message === 'Invalid token' || err.message === 'Missing token') {
      localStorage.clear();
      sessionStorage.clear();
      location.replace('/login');
    } else {
      showStatus('Connection failed — check server');
    }
  });
  socket.on('error', ({ message }) => showStatus(message));

  // ── Create room ──
  document.getElementById('create-btn').addEventListener('click', () => {
    socket.emit('room:create');
  });

  socket.on('room:state', (data) => {
    if (data.code && data.status === 'waiting') {
      document.getElementById('create-idle').style.display    = 'none';
      document.getElementById('create-waiting').style.display = 'block';
      document.getElementById('room-code-display').textContent = data.code;
    }
    if (data.status === 'starting') {
      showStatus('Opponent joined! Starting game...');
    }
  });

  // ── Join room ──
  document.getElementById('join-btn').addEventListener('click', () => {
    const code = document.getElementById('join-code').value.trim().toUpperCase();
    if (!code || code.length !== 6) { showStatus('Enter a valid 6-letter code'); return; }
    socket.emit('room:join', { code });
    showStatus('Joining room...');
  });

  document.getElementById('join-code').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('join-btn').click();
  });

  // ── Game start → navigate ──
  socket.on('game:start', (data) => {
    sessionStorage.setItem('firstPlayerId', data.firstPlayerId);
    sessionStorage.setItem('myPlayerId',    data.myPlayerId);
    sessionStorage.setItem('gameToken',     data.gameToken);
    location.href = '/game';
  });

  function showStatus(msg) {
    status.textContent = msg;
    status.style.display = 'block';
  }
}
