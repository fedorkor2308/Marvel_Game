async function initLeaderboard() {
  const token = getToken();
  if (!token) { location.replace('/login'); return; }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    location.replace('/login');
  });

  try {
    const res  = await fetch('/api/leaderboard', { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    const tbody = document.getElementById('lb-body');
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="color:var(--text-dim);font-size:.65rem;padding:1rem .75rem;">NO DATA YET</td></tr>';
      return;
    }

    data.forEach((row, i) => {
      const total  = row.wins + row.losses;
      const pct    = total ? Math.round((row.wins / total) * 100) : 0;
      const tr     = document.createElement('tr');
      tr.innerHTML = `
        <td class="lb-rank">${i + 1}</td>
        <td class="lb-user">${row.username.toUpperCase()}</td>
        <td class="lb-win">${row.wins}</td>
        <td class="lb-loss">${row.losses}</td>
        <td>${pct}%</td>
      `;
      tbody.appendChild(tr);
    });
  } catch {
    document.getElementById('lb-body').innerHTML =
      '<tr><td colspan="5" style="color:var(--text-dim);font-size:.65rem;padding:1rem .75rem;">FAILED TO LOAD</td></tr>';
  }
}
