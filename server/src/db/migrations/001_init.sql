-- ============================================================
-- Great Battle — initial schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS great_battle
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE great_battle;

-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  username      VARCHAR(20)     NOT NULL UNIQUE,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  avatar_url    TEXT,
  wins          INT UNSIGNED    NOT NULL DEFAULT 0,
  losses        INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email    (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Cards ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cards (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  alias       VARCHAR(100)    NOT NULL,  -- "Iron Man", "Thanos"
  description TEXT,
  image_url   TEXT            NOT NULL,
  attack      TINYINT UNSIGNED NOT NULL DEFAULT 1,
  defense     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  cost        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  rarity      ENUM('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
  faction     ENUM('hero','villain','neutral')         NOT NULL DEFAULT 'neutral',
  ability     VARCHAR(100)    NULL,      -- e.g. 'taunt', 'lifesteal', 'charge'
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Rooms ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  code        CHAR(6)         NOT NULL UNIQUE,       -- human-readable join code
  host_id     INT UNSIGNED    NOT NULL,
  guest_id    INT UNSIGNED    NULL,
  status      ENUM('waiting','in_progress','finished','abandoned') NOT NULL DEFAULT 'waiting',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (host_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Games ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  room_id       INT UNSIGNED    NOT NULL,
  player1_id    INT UNSIGNED    NOT NULL,
  player2_id    INT UNSIGNED    NOT NULL,
  winner_id     INT UNSIGNED    NULL,
  turns_played  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  started_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at      DATETIME        NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id)  ON DELETE CASCADE,
  FOREIGN KEY (player1_id) REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (player2_id) REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (winner_id)  REFERENCES users(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Game events log (optional, for replay) ─────────────────
CREATE TABLE IF NOT EXISTS game_events (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  game_id     INT UNSIGNED    NOT NULL,
  turn        SMALLINT UNSIGNED NOT NULL,
  player_id   INT UNSIGNED    NOT NULL,
  event_type  VARCHAR(50)     NOT NULL,
  payload     JSON            NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_game_turn (game_id, turn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
