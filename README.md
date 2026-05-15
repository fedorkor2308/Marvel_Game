# Great Battle

Browser-based multiplayer Marvel card game.
Built for the Half Marathon Full Stack — Race 01 challenge.

A turn-based PvP card game where players summon Marvel heroes and villains, manage mana, and battle until one player's health drops to zero.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, socket.io-client, framer-motion |
| Backend | Node.js 20+, Express 4, Socket.IO 4 |
| Database | MySQL 8 |
| Auth | JWT (access + refresh), bcrypt |
| Realtime | WebSocket via Socket.IO |

---

## Project structure

```
great-battle/
├── client/                 # React SPA (Vite)
├── server/                 # Node + Express + Socket.IO
├── shared/                 # Shared constants (event names, types)
├── docs/                   # Architecture docs, ERD, API spec
├── .github/                # CI workflows, PR/issue templates
└── README.md
```

---

## Quick start

### Prerequisites

- Node.js 20+
- MySQL 8 (or Docker)
- npm 10+

### 1. Clone and install

```bash
git clone https://github.com/<your-org>/great-battle.git
cd great-battle

# Install client deps
cd client && npm install && cd ..

# Install server deps
cd server && npm install && cd ..
```

### 2. Database setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE great_battle CHARACTER SET utf8mb4;"

# Run migrations
cd server
npm run db:migrate
npm run db:seed   # seeds 20+ Marvel cards
```

### 3. Environment variables

Copy `.env.example` to `.env` in both `client/` and `server/` and fill in values.

**server/.env**
```
PORT=4000
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/great_battle
JWT_ACCESS_SECRET=change-me-in-prod
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### 4. Run dev servers

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Open http://localhost:5173

---

## Team

| Role | Responsibility |
|---|---|
| Dev 1 — Frontend & UI/UX | React app, auth pages, lobby, battlefield UI, animations, responsive design |
| Dev 2 — Backend, Auth & DB | Express REST API, JWT auth, MySQL schema, cards catalog, leaderboard |
| Dev 3 — Realtime & Game Logic | Socket.IO, matchmaking, game state, turn system, rules, reconnect |

See [docs/team-responsibilities.md](docs/team-responsibilities.md) for the full breakdown.

---

## Documentation

- [Architecture](docs/architecture.md) — system layers, data flow
- [API spec](docs/api.md) — REST endpoints
- [Socket events](docs/socket-events.md) — realtime contract
- [Database schema](docs/database.md) — ERD and migrations
- [Game rules](docs/game-rules.md) — turn flow, card mechanics
- [Contributing](CONTRIBUTING.md) — git workflow, conventions

---

## Git-гілки та workflow

У проєкті використовується спрощений git-flow. Це потрібно, щоб 3 розробники могли працювати паралельно й не ламати код один одному.

### Основні гілки

**`main`**
- Стабільна гілка. Тут знаходяться тільки версії, які можна показувати.
- Ніхто не комітить напряму в `main`.
- Зміни потрапляють сюди через merge з `develop` (або через `hotfix`, якщо критичний баг).

**`develop`**
- Основна гілка розробки.
- Усі нові фічі спочатку потрапляють у `develop`.
- Перед початком роботи кожен розробник створює гілку `feature/...` від `develop`.

### Робочі гілки (feature)

Для кожної задачі (Issue) створюється окрема гілка.

Формат імені: `feature/issue-<номер>-<коротка-назва>`

Приклади для цього проєкту:

```
# Dev 2 — Backend & DB
feature/issue-1-db-migrations
feature/issue-2-auth-api
feature/issue-3-cards-api
feature/issue-4-leaderboard-api

# Dev 3 — Realtime & Game Logic
feature/issue-5-room-handlers
feature/issue-6-matchmaking
feature/issue-7-game-handlers
feature/issue-8-turn-timer
feature/issue-9-reconnect

# Dev 1 — Frontend & UI
feature/issue-10-vite-setup
feature/issue-11-auth-pages
feature/issue-12-lobby-ui
feature/issue-13-battlefield-ui
feature/issue-14-card-component
feature/issue-15-player-hud
feature/issue-16-leaderboard-page
```

⚠️ **Важливо:** НЕ створювати гілки з назвами просто `feature` або `dev1`.
Завжди вказуй номер Issue та конкретну назву задачі.

### Як працювати з feature-гілкою

```bash
# 1. Оновити develop перед початком
git checkout develop
git pull

# 2. Створити гілку для своєї задачі
git checkout -b feature/issue-7-game-handlers

# 3. Писати код, робити коміти
git add <конкретні файли>
git commit -m "feat: implement card:play and card:attack socket handlers"

# 4. Запушити гілку
git push -u origin feature/issue-7-game-handlers

# 5. На GitHub відкрити Pull Request: feature/... → develop
#    В описі PR написати: Closes #7
#    Це автоматично закриє Issue після merge.
```

### Правила комітів

Використовуй префікси:

| Префікс | Коли |
|---|---|
| `feat:` | нова функціональність |
| `fix:` | виправлення бага |
| `chore:` | конфіги, залежності, без впливу на логіку |
| `style:` | CSS, форматування |
| `refactor:` | рефакторинг без зміни поведінки |
| `docs:` | зміни в документації |

Приклади:
```
feat: add turn timer with 30s countdown
fix: prevent card attack when exhausted
chore: install framer-motion
style: add health bar animation
docs: update socket events reference
```

### Hotfix-гілки

Потрібні рідко. Якщо в стабільній версії знайшли критичний баг:

```bash
git checkout main
git checkout -b hotfix/fix-auth-token-expiry
# ... виправити ...
# merge → main і merge → develop
```

### ❗ Коротко

- Не пушити напряму в `main` або `develop`.
- Для кожної задачі — окрема гілка `feature/issue-<N>-<назва>` від `develop`.
- Закінчив задачу → Pull Request `feature/...` → `develop`, пишеш `Closes #N`.
- Коли кілька фіч готові й стабільні → `develop` → `main`.

---

## License

MIT — built for educational purposes as part of the Innovation Campus NTU "KhPI" Half Marathon Full Stack program.
