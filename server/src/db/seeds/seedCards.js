/**
 * Seeds 22 Marvel cards into the `cards` table.
 * Run: node src/db/seeds/seedCards.js
 */
import { query } from '../../config/db.js';

const CARDS = [
  // ── Legendary (cost 7) ─────────────────────────────────────────
  { name: 'Thanos',        alias: 'Thanos',          attack: 8, defense: 8, cost: 7, rarity: 'legendary', faction: 'villain', ability: 'battlecry',   image_url: '/assets/images/cards/thanos.webp',          description: 'When played, destroy all minions with 4 or less attack.' },
  { name: 'Iron Man',      alias: 'Iron Man',        attack: 7, defense: 7, cost: 7, rarity: 'legendary', faction: 'hero',    ability: 'divine_shield', image_url: '/assets/images/cards/iron_man.jpg',        description: 'Immune to the first attack each turn.' },
  { name: 'Thor',          alias: 'Thor',            attack: 6, defense: 5, cost: 6, rarity: 'legendary', faction: 'hero',    ability: 'charge',       image_url: '/assets/images/cards/thor.jpg',            description: 'Can attack the turn it is played.' },
  { name: 'Doctor Doom',   alias: 'Doctor Doom',     attack: 5, defense: 8, cost: 7, rarity: 'legendary', faction: 'villain', ability: 'taunt',        image_url: '/assets/images/cards/doctor_doom.jpg',     description: 'Enemies must attack this card first.' },

  // ── Epic (cost 5–6) ───────────────────────────────────────────
  { name: 'Captain America', alias: 'Cap',           attack: 4, defense: 6, cost: 5, rarity: 'epic',      faction: 'hero',    ability: 'taunt',        image_url: '/assets/images/cards/captain_america.webp', description: 'Protects your other heroes.' },
  { name: 'Black Panther',  alias: 'Black Panther',  attack: 4, defense: 5, cost: 5, rarity: 'epic',      faction: 'hero',    ability: 'lifesteal',    image_url: '/assets/images/cards/black_panther.webp',   description: 'Heals your hero for damage dealt.' },
  { name: 'Loki',           alias: 'Loki',           attack: 3, defense: 4, cost: 4, rarity: 'epic',      faction: 'villain', ability: 'battlecry',    image_url: '/assets/images/cards/loki.webp',            description: 'Discover a copy of a random opponent card.' },
  { name: 'Ultron',         alias: 'Ultron',         attack: 5, defense: 4, cost: 6, rarity: 'epic',      faction: 'villain', ability: 'deathrattle',  image_url: '/assets/images/cards/ultron.webp',          description: 'On death, summon two 1/1 drones.' },

  // ── Rare (cost 3–4) ───────────────────────────────────────────
  { name: 'Spider-Man',    alias: 'Spider-Man',      attack: 3, defense: 3, cost: 3, rarity: 'rare',      faction: 'hero',    ability: 'charge',       image_url: '/assets/images/cards/spider_man.webp',      description: 'Swings into action immediately.' },
  { name: 'Black Widow',   alias: 'Black Widow',     attack: 3, defense: 3, cost: 3, rarity: 'rare',      faction: 'hero',    ability: null,            image_url: '/assets/images/cards/black_widow.webp',     description: 'Deadly precision.' },
  { name: 'Hulk',          alias: 'Hulk',            attack: 5, defense: 5, cost: 6, rarity: 'rare',      faction: 'hero',    ability: 'enrage',       image_url: '/assets/images/cards/hulk.jpg',            description: 'Gains +2 attack when damaged.' },
  { name: 'Gamora',        alias: 'Gamora',          attack: 4, defense: 4, cost: 4, rarity: 'rare',      faction: 'hero',    ability: null,            image_url: '/assets/images/cards/gamora.jpg',          description: null },
  { name: 'Red Skull',     alias: 'Red Skull',       attack: 4, defense: 4, cost: 4, rarity: 'rare',      faction: 'villain', ability: 'battlecry',    image_url: '/assets/images/cards/red_skull.webp',       description: 'Give all enemy minions +1 attack.' },
  { name: 'Nebula',        alias: 'Nebula',          attack: 4, defense: 3, cost: 4, rarity: 'rare',      faction: 'villain', ability: 'lifesteal',    image_url: '/assets/images/cards/nebula.webp',          description: null },

  // ── Common (cost 1–3) ─────────────────────────────────────────
  { name: 'Hawkeye',       alias: 'Hawkeye',         attack: 3, defense: 2, cost: 2, rarity: 'common',    faction: 'hero',    ability: null,            image_url: '/assets/images/cards/hawkeye.webp',         description: null },
  { name: 'Falcon',        alias: 'Falcon',          attack: 2, defense: 2, cost: 2, rarity: 'common',    faction: 'hero',    ability: 'charge',       image_url: '/assets/images/cards/falcon.webp',          description: null },
  { name: 'War Machine',   alias: 'War Machine',     attack: 3, defense: 3, cost: 3, rarity: 'common',    faction: 'hero',    ability: null,            image_url: '/assets/images/cards/war_machine.webp',     description: null },
  { name: 'Vision',        alias: 'Vision',          attack: 2, defense: 3, cost: 3, rarity: 'common',    faction: 'hero',    ability: 'divine_shield', image_url: '/assets/images/cards/vision.webp',          description: null },
  { name: 'Crossbones',    alias: 'Crossbones',      attack: 3, defense: 2, cost: 2, rarity: 'common',    faction: 'villain', ability: null,            image_url: '/assets/images/cards/crossbones.webp',      description: null },
  { name: 'Taskmaster',    alias: 'Taskmaster',      attack: 3, defense: 3, cost: 3, rarity: 'common',    faction: 'villain', ability: null,            image_url: '/assets/images/cards/taskmaster.jpg',      description: null },
  { name: 'Hydra Soldier', alias: 'Hydra Soldier',   attack: 2, defense: 2, cost: 1, rarity: 'common',    faction: 'villain', ability: null,            image_url: '/assets/images/cards/hydra_soldier.webp',   description: null },
  { name: 'S.H.I.E.L.D. Agent', alias: 'Agent',     attack: 1, defense: 3, cost: 1, rarity: 'common',    faction: 'hero',    ability: 'taunt',        image_url: '/assets/images/cards/shield_agent.jpg',    description: 'Protects the more vulnerable allies.' },
];

async function seed() {
  console.log(`Seeding ${CARDS.length} cards…`);
  for (const card of CARDS) {
    await query(
      `INSERT INTO cards (name, alias, description, image_url, attack, defense, cost, rarity, faction, ability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE attack = VALUES(attack), defense = VALUES(defense), cost = VALUES(cost)`,
      [card.name, card.alias, card.description ?? null, card.image_url,
       card.attack, card.defense, card.cost, card.rarity, card.faction, card.ability ?? null]
    );
  }
  console.log('Done.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
