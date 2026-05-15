# Team Responsibilities — Great Battle

Three roles, clean boundaries, no overlap.
Each dev owns their files end-to-end.

---

## Dev 1 — Frontend & UI

**Files owned:** `client/` (everything inside)

### What you build

| Area | Details |
|---|---|
| Project setup | Vite + React 18, React Router, Axios, socket.io-client, framer-motion, CSS modules |
| Auth pages | `/login` and `/register` forms — call REST API, store tokens in localStorage |
| Lobby page | Room list, "Create room" button, "Join by code" input, matchmaking queue button |
| Game page | Battlefield layout — opponent area (top), active card zones (middle), player hand (bottom) |
| Card component | Render card image, name, attack/defense/cost, rarity glow, play/attack click handlers |
| Player HUD | Avatar, nickname, health bar, mana crystals, turn indicator, 30s countdown timer |
| Coin flip screen | Animated coin toss before match starts, shows who goes first |
| Victory/Defeat screen | End-of-game overlay with winner info and "Play again" button |
| Socket integration | Connect to server with JWT token, listen for all game events, update UI state |
| Leaderboard page | Fetch and display top 50 players from REST API |
| Responsive design | Works on 1024px+ screens, cross-browser (Chrome, Firefox, Safari, Edge) |

### Key files to create

```
client/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── LobbyPage.jsx
│   │   ├── GamePage.jsx
│   │   └── LeaderboardPage.jsx
│   ├── components/
│   │   ├── auth/        LoginForm, RegisterForm
│   │   ├── lobby/       RoomList, RoomCard, CreateRoomModal
│   │   ├── game/        Battlefield, PlayerHand, CardOnBoard,
│   │   │                PlayerHUD, TurnTimer, CoinFlip,
│   │   │                GameEndOverlay, ChatPanel
│   │   └── ui/          Button, Modal, HealthBar, ManaBar,
│   │                    Avatar, LoadingSpinner
│   ├── context/
│   │   ├── AuthContext.jsx    (stores user + tokens)
│   │   └── SocketContext.jsx  (single shared socket instance)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   └── useGame.js         (game state from socket events)
│   ├── services/
│   │   └── api.js             (Axios instance, all REST calls)
│   └── utils/
│       └── formatters.js
```

### Dependencies to install

```bash
npm create vite@latest . -- --template react
npm install react-router-dom axios socket.io-client framer-motion
```

### Contract with other devs

- You consume the REST API (`/api/auth`, `/api/cards`, `/api/leaderboard`) — documented in [api.md](api.md)
- You consume Socket.IO events — documented in [socket-events.md](socket-events.md)
- You import event names from `../../shared/events.js`
- You import game constants from `../../shared/constants.js`
- **You never write game logic** — send events, trust the server

---

## Dev 2 — Backend & Database

**Files owned:** `server/src/` (controllers, routes, models, db, middleware, config)

### What you build

| Area | Details |
|---|---|
| Database | Run `001_init.sql`, verify schema, write `migrate.js` runner script |
| Card seed | Verify `seedCards.js` runs clean, add/fix card image URLs or data |
| Auth API | `POST /api/auth/register`, `/api/auth/login`, `/api/auth/refresh` — all working |
| Users API | `GET /api/users/me`, `PATCH /api/users/me/avatar` |
| Cards API | `GET /api/cards` (full list), `GET /api/cards/:id` |
| Rooms API | `GET /api/rooms` (open room list) |
| Leaderboard API | `GET /api/leaderboard` — top 50 by wins |
| Stats update | `PATCH` wins/losses on a user after a game ends (called by Dev 3's socket handler) |
| Security | Helmet, CORS, rate limiter, input validation (express-validator), bcrypt |
| Error handling | Consistent JSON error responses, HTTP status codes |

### Key files to create / complete

```
server/src/
├── db/
│   ├── migrate.js             (runs SQL files in order)
│   └── seeds/seedCards.js     (already written, verify it runs)
├── models/
│   ├── User.js                (DB query helpers for users table)
│   ├── Card.js                (DB query helpers for cards table)
│   ├── Room.js                (DB query helpers for rooms table)
│   └── Game.js                (DB query helpers for games table)
├── controllers/
│   ├── authController.js      (already written, test it)
│   └── leaderboardController.js
└── config/
    └── db.js                  (already written)
```

### Create `server/src/db/migrate.js`

```js
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dir, 'migrations/001_init.sql'), 'utf8');
const statements = sql.split(';').filter(s => s.trim());
for (const stmt of statements) await pool.execute(stmt);
console.log('Migration complete');
process.exit(0);
```

### Contract with other devs

- Dev 1 depends on your REST API being up — run `npm run dev` in `server/`
- Dev 3 imports your DB query helpers (`models/Card.js`) to load the deck at game start
- Dev 3 calls a `updateStats(winnerId, loserId)` function you export from `models/User.js`
- Document every endpoint in [api.md](api.md) as you finish it

---

## Dev 3 — Realtime & Game Logic

**Files owned:** `server/src/socket/`, integration of `GameEngine.js`

### What you build

| Area | Details |
|---|---|
| Room handlers | Create room, join by code, leave room, broadcast room state to both players |
| Matchmaking | Auto-queue (first two players in queue get paired), emit `match:found` to both |
| Game start | Load deck from DB (use Dev 2's model), construct `GameEngine`, start first turn |
| Game state broadcast | After every action emit `game:state` to the room, `player:hand` privately to each player |
| Turn timer | `setInterval` 1s tick → `turn:tick` to room. On 0 → force `turn:end` |
| Card play | Receive `card:play`, call `engine.playCard()`, broadcast result |
| Card attack | Receive `card:attack`, call `engine.attackWith()`, broadcast result |
| End turn | Receive `turn:end`, call `engine.endTurn()`, broadcast new state |
| Game over | When `engine.status === 'finished'`, emit `game:end`, call Dev 2's `updateStats()`, save to DB |
| Reconnect | On disconnect save game state; on reconnect within 60s restore and resync |
| Chat | Forward `chat:message` events within a room |

### Key files to create

```
server/src/socket/
├── index.js            (already written — auth middleware, io setup)
├── roomHandlers.js     (room CRUD over socket)
├── matchmaking.js      (queue management)
├── gameHandlers.js     (card:play, card:attack, turn:end, game:end)
└── turnTimer.js        (timer class — setInterval wrapper per game)
```

### `turnTimer.js` sketch

```js
export class TurnTimer {
  constructor(durationSec, onTick, onExpire) {
    this.remaining = durationSec;
    this.interval  = setInterval(() => {
      this.remaining -= 1;
      onTick(this.remaining);
      if (this.remaining <= 0) { this.clear(); onExpire(); }
    }, 1000);
  }
  clear() { clearInterval(this.interval); }
  reset(durationSec) { this.clear(); this.remaining = durationSec; }
}
```

### Contract with other devs

- `GameEngine.js` is already written — read it before starting
- Import all event names from `shared/events.js` — never hardcode strings
- Import game constants from `shared/constants.js`
- Call Dev 2's `updateStats(winnerId, loserId)` on game end
- Load the card deck using Dev 2's `Card.getAll()` model method
- Tell Dev 1 which events you emit and what shape the payload is (update [socket-events.md](socket-events.md))

---

## Shared contract — do not break

| Thing | Owner | Consumers |
|---|---|---|
| `shared/events.js` | Dev 3 | Dev 1, Dev 3 |
| `shared/constants.js` | Dev 3 | Dev 1, Dev 3 |
| REST API | Dev 2 | Dev 1 |
| Socket event payloads | Dev 3 | Dev 1 |
| `models/Card.js` | Dev 2 | Dev 3 |
| `models/User.js` updateStats | Dev 2 | Dev 3 |

## Branch strategy

```
main             ← always working, protected
dev              ← integration branch, PRs merge here
feature/dev1-*   ← Dev 1 branches
feature/dev2-*   ← Dev 2 branches
feature/dev3-*   ← Dev 3 branches
```

Each PR needs at least 1 review before merge to `dev`.
Merge `dev` → `main` only when a full feature is tested end-to-end.

## Suggested build order

1. **Day 1** — Dev 2 sets up DB + seeds. Dev 3 sets up socket auth. Dev 1 sets up Vite + routing.
2. **Day 2** — Dev 2 finishes auth API. Dev 1 builds login/register pages and connects them.
3. **Day 3** — Dev 3 builds room system. Dev 1 builds lobby page.
4. **Day 4** — Dev 3 integrates GameEngine + game events. Dev 1 builds battlefield UI.
5. **Day 5** — All three polish, fix bugs, test cross-browser, prepare demo.
