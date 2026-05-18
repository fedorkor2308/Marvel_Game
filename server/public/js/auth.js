// Per-tab identity: sessionStorage takes priority over shared localStorage
function getToken() {
  return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
}
function getUser() {
  return JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null');
}

function requireGuest() {
  if (getToken()) location.replace('/lobby');
}

function requireAuth() {
  if (!getToken()) location.replace('/login');
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function saveSession(data) {
  localStorage.setItem('accessToken',  data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user',         JSON.stringify(data.user));
  // Per-tab copy so each browser tab keeps its own identity
  sessionStorage.setItem('accessToken', data.accessToken);
  sessionStorage.setItem('user',        JSON.stringify(data.user));
}

function initLogin() {
  requireGuest();
  const btn = document.getElementById('login-btn');
  const err = document.getElementById('err');

  btn.addEventListener('click', async () => {
    err.style.display = 'none';
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) { showErr('Fill in all fields'); return; }
    btn.disabled = true;
    btn.textContent = 'LOADING...';
    try {
      const data = await apiPost('/api/auth/login', { email, password });
      saveSession(data);
      location.replace('/lobby');
    } catch (e) {
      showErr(e.message);
      btn.disabled = false;
      btn.textContent = 'LOGIN';
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  function showErr(msg) { err.textContent = msg; err.style.display = 'block'; }
}

function initRegister() {
  requireGuest();
  const btn = document.getElementById('reg-btn');
  const err = document.getElementById('err');

  btn.addEventListener('click', async () => {
    err.style.display = 'none';
    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !email || !password) { showErr('Fill in all fields'); return; }
    btn.disabled = true;
    btn.textContent = 'LOADING...';
    try {
      const data = await apiPost('/api/auth/register', { username, email, password });
      saveSession(data);
      location.replace('/lobby');
    } catch (e) {
      showErr(e.message);
      btn.disabled = false;
      btn.textContent = 'CREATE ACCOUNT';
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

  function showErr(msg) { err.textContent = msg; err.style.display = 'block'; }
}
