const MAX_WEAPONS = 6;
const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 600;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const randRange = (min, max) => min + Math.random() * (max - min);
const distanceBetween = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const normalizeVector = (x, y) => {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
};

const WEAPON_GLYPHS = {
  pistol: "🔫",
  revolver: "🔫",
  flamethrower: "🔥",
  suitcase: "🧳",
  sword: "⚔️",
  crowbar: "🔧",
  minigun: "🔫",
  shotgun: "💥",
  spear: "🗡️",
  torch: "🔥",
  ak47: "🔫",
  wrench: "🔧",
  rock: "🪨",
  stick: "🥢",
  drill: "🛠️",
  pillow: "🛏️",
  speaker: "🔊",
  dumbbell: "🏋️",
  rocket_launcher: "🚀",
  belt: "🪢",
  hockey_stick: "🏒",
  lacrosse_ball: "🏐",
  wand: "🪄"
};

const CHARACTER_GLYPHS = {
  normal: "🥒",
  ranger: "🏹",
  brawler: "🥊",
  well_rounded: "⚖️",
  crazy: "🤪",
  old: "🧓",
  young: "🧑",
  baby: "👶",
  robot: "🤖",
  soldier: "🪖",
  jockey: "🏇",
  king: "👑",
  graduate_student: "🎓",
  mom: "👩",
  god: "✨",
  bounty_hunter: "💰",
  dog: "🐕",
  cat: "🐈",
  inventor: "🧪",
  shapeshifter: "🦊",
  athlete: "🏃",
  prince: "🤴",
  princess: "👸",
  guardian: "🛡️",
  teen: "🧢"
};

function getWeaponGlyph(weaponId) {
  const weapon = getWeaponById(weaponId);
  return WEAPON_GLYPHS[weaponId] || (weapon && weapon.type === "melee" ? "⚔️" : weapon && weapon.type === "ranged" ? "🔫" : "✨");
}

function getCharacterGlyph(characterId) {
  return CHARACTER_GLYPHS[characterId] || "🥒";
}

const WEAPONS = [
  { id: "pistol", name: "Pistol", category: "Gun", type: "ranged", damage: 10, reload: 0.95, price: 12, color: "#d7f0ff", description: "Reliable sidearm with steady shots.", attack: "projectile", range: 25 },
  { id: "revolver", name: "Revolver", category: "Gun", type: "ranged", damage: 7, reload: 0.84, price: 10, color: "#dfd5ff", description: "Fast, compact revolver.", attack: "projectile", range: 25 },
  { id: "flamethrower", name: "Flamethrower", category: "Gun", type: "ranged", damage: 14, reload: 1.06, price: 20, color: "#ff9a5a", description: "Scorches enemies in a close-range stream.", attack: "flame", range: 25 },
  { id: "suitcase", name: "Suitcase", category: "Other", type: "melee", damage: 4, reload: 0.57, price: 8, color: "#d2c7a6", description: "A surprising melee finisher.", attack: "melee", range: 25 },
  { id: "sword", name: "Sword", category: "Medieval", type: "melee", damage: 14, reload: 0.76, price: 16, color: "#dfe6ff", description: "Classic steel swing.", attack: "melee", range: 25 },
  { id: "crowbar", name: "Crowbar", category: "Other", type: "melee", damage: 12, reload: 0.85, price: 15, color: "#dcd7b3", description: "Cracks through armor.", attack: "melee", range: 25 },
  { id: "minigun", name: "Minigun", category: "Gun", type: "ranged", damage: 4, reload: 0.12, price: 22, color: "#cfe6ff", description: "Very fast spray of bullets.", attack: "projectile", range: 25 },
  { id: "shotgun", name: "Shotgun", category: "Gun", type: "ranged", damage: 15, reload: 1.12, price: 18, color: "#f2d0aa", description: "Fires a spread of pellets.", attack: "shotgun", range: 25 },
  { id: "spear", name: "Spear", category: "Medieval", type: "melee", damage: 6, reload: 1.01, price: 13, color: "#d2e7d8", description: "Long reach with strong thrusts.", attack: "melee", range: 25 },
  { id: "torch", name: "Torch", category: "Medieval", type: "melee", damage: 8, reload: 0.75, price: 12, color: "#ffb76b", description: "Burning melee weapon.", attack: "melee", range: 25 },
  { id: "ak47", name: "AK-47", category: "Gun", type: "ranged", damage: 14, reload: 0.76, price: 18, color: "#d9e9ff", description: "High damage automatic rifle.", attack: "projectile", range: 25 },
  { id: "wrench", name: "Wrench", category: "Other", type: "melee", damage: 10, reload: 0.67, price: 12, color: "#d5d6d0", description: "Heavy blunt strike.", attack: "melee", range: 25 },
  { id: "rock", name: "Rock", category: "Medieval", type: "ranged", damage: 5, reload: 0.45, price: 9, color: "#b2a68c", description: "A crude but effective projectile.", attack: "projectile", range: 25 },
  { id: "stick", name: "Stick", category: "Other", type: "melee", damage: 7, reload: 0.67, price: 8, color: "#c9b28f", description: "Simple, dependable melee.", attack: "melee", range: 25 },
  { id: "drill", name: "Drill", category: "Other", type: "melee", damage: 20, reload: 1.43, price: 24, color: "#d7ecff", description: "Powerful close-range burst damage.", attack: "drill", range: 25 },
  { id: "pillow", name: "Pillow", category: "Other", type: "melee", damage: 6, reload: 0.65, price: 7, color: "#f0eec9", description: "Soft but surprisingly persistent.", attack: "melee", range: 25 },
  { id: "speaker", name: "Speaker", category: "Other", type: "ranged", damage: 13, reload: 0.87, price: 18, color: "#d2dcff", description: "Sends out a resonant sound-wave blast.", attack: "speaker", range: 25 },
  { id: "dumbbell", name: "Dumbbell", category: "Other", type: "melee", damage: 8, reload: 0.89, price: 11, color: "#d0d7e6", description: "A heavy weight with brutal swings.", attack: "melee", range: 25 },
  { id: "rocket_launcher", name: "Rocket Launcher", category: "Gun", type: "ranged", damage: 18, reload: 1.34, price: 28, color: "#ffbf7a", description: "Explodes on impact for splash damage.", attack: "rocket", range: 25 },
  { id: "belt", name: "Belt", category: "Other", type: "melee", damage: 7, reload: 0.43, price: 9, color: "#c3d6b5", description: "Quick whip-like attack.", attack: "melee", range: 25 },
  { id: "hockey_stick", name: "Hockey Stick", category: "Sports", type: "melee", damage: 8, reload: 0.97, price: 14, color: "#dfeff7", description: "Solid sports melee weapon.", attack: "melee", range: 25 },
  { id: "lacrosse_ball", name: "Lacrosse Ball", category: "Sports", type: "ranged", damage: 2, reload: 0.5, price: 8, color: "#d9ffe0", description: "Fast, simple projectile.", attack: "projectile", range: 25 },
  { id: "wand", name: "Wand", category: "Medieval", type: "ranged", damage: 4, reload: 0.89, price: 11, color: "#d6d0ff", description: "Magic projectile attack.", attack: "wand", range: 25 }
];

WEAPONS.forEach((weapon) => {
  weapon.range = weapon.range ?? 25;
});

const UPGRADE_DEFS = [
  { id: "max_health", name: "Max Health", price: 16, description: "+10 maximum health" },
  { id: "melee_damage", name: "Melee Damage", price: 14, description: "+3 melee damage" },
  { id: "ranged_damage", name: "Ranged Damage", price: 14, description: "+3 ranged damage" },
  { id: "attack_speed", name: "Attack Speed", price: 15, description: "+8% attack speed" },
  { id: "armor", name: "Armor", price: 16, description: "+4 armor" },
  { id: "speed", name: "Movement Speed", price: 14, description: "+8 speed" },
  { id: "luck", name: "Luck", price: 18, description: "+3 luck" },
  { id: "coin_bonus", name: "Coin Bonus", price: 18, description: "+0.2 coin gain" }
];

const CHARACTERS = [
  { id: "normal", name: "Normal", description: "Balanced starting cucumber.", restrictions: "None", badge: "Balanced", perk: "None", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "base" },
  { id: "ranger", name: "Ranger", description: "A distant-fighting specialist.", restrictions: "Ranged weapons only", badge: "Range", perk: "Ranged only", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "ranged_only" },
  { id: "brawler", name: "Brawler", description: "A bruiser built for melee pressure.", restrictions: "Melee weapons only", badge: "Close", perk: "Melee only", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "melee_only" },
  { id: "well_rounded", name: "Well-Rounded", description: "Versatile and reliable in any setup.", restrictions: "None", badge: "Balanced", perk: "+3 melee / +3 ranged", stats: { maxHealth: 0, meleeDamage: 3, rangedDamage: 3, armor: 0, speed: 0, luck: 0 }, ability: "well_rounded" },
  { id: "crazy", name: "Crazy", description: "Aggressive but fragile and unlucky.", restrictions: "None", badge: "High risk", perk: "+50 damage, +50 HP, -200 luck, -20 armor", stats: { maxHealth: 50, meleeDamage: 50, rangedDamage: 50, armor: -20, speed: 0, luck: -200 }, ability: "crazy" },
  { id: "old", name: "Old", description: "Slow, grim, and resilient to attrition.", restrictions: "None", badge: "Veteran", perk: "-63% enemies, -50 damage, +21 HP, stronger enemy hits", stats: { maxHealth: 21, meleeDamage: -50, rangedDamage: -50, armor: 0, speed: 0, luck: 0 }, ability: "old" },
  { id: "young", name: "Young", description: "Fast, strong, and more dangerous than it looks.", restrictions: "None", badge: "Youthful", perk: "+31% enemies, +50 damage, +21 HP, +21 armor, -20 speed, -10 damage each ranged weapon", stats: { maxHealth: 21, meleeDamage: 50, rangedDamage: 50, armor: 21, speed: -20, luck: 0 }, ability: "young" },
  { id: "baby", name: "Baby", description: "Tiny but surprisingly efficient.", restrictions: "None", badge: "Tiny", perk: "-50% enemies", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "baby" },
  { id: "robot", name: "Robot", description: "A drill-only machine with armor plating.", restrictions: "Drill only", badge: "Machine", perk: "+20 armor, +15 damage, no healing", stats: { maxHealth: 0, meleeDamage: 15, rangedDamage: 15, armor: 20, speed: 0, luck: 0 }, ability: "robot" },
  { id: "soldier", name: "Soldier", description: "Disciplined gun specialist.", restrictions: "Gun weapons only", badge: "Officer", perk: "-15 damage, loses 10 HP per pair of identical weapons", stats: { maxHealth: 0, meleeDamage: -15, rangedDamage: -15, armor: 0, speed: 0, luck: 0 }, ability: "soldier" },
  { id: "jockey", name: "Jockey", description: "A quick and nimble rider.", restrictions: "None", badge: "Agile", perk: "+23 armor, +23 speed", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 23, speed: 23, luck: 0 }, ability: "jockey" },
  { id: "king", name: "King", description: "A royal weapon wielder with medieval tastes.", restrictions: "Medieval weapons only", badge: "Royal", perk: "Medieval only", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "king" },
  { id: "graduate_student", name: "Graduate Student", description: "A thinker with a bit more health.", restrictions: "None", badge: "Scholar", perk: "+30 health", stats: { maxHealth: 30, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "graduate_student" },
  { id: "mom", name: "Mom", description: "Protective, caring, and accompanied by tiny allies.", restrictions: "None", badge: "Support", perk: "Summons up to 8 babies and -30 damage", stats: { maxHealth: 0, meleeDamage: -30, rangedDamage: -30, armor: 0, speed: 0, luck: 0 }, ability: "mom" },
  { id: "god", name: "God", description: "Immense health at the cost of gun use.", restrictions: "None", badge: "Divine", perk: "+100 health, loses 20 max health per gun", stats: { maxHealth: 100, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "god" },
  { id: "bounty_hunter", name: "Bounty Hunter", description: "Earns extra currency for each kill.", restrictions: "None", badge: "Killer", perk: "+0.1 coin bonus per enemy", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "bounty_hunter" },
  { id: "dog", name: "Dog", description: "A bite-focused beast with no gear slots.", restrictions: "No weapons", badge: "Beast", perk: "+10 HP, +10 damage, bite attacks", stats: { maxHealth: 10, meleeDamage: 10, rangedDamage: 10, armor: 0, speed: 0, luck: 0 }, ability: "dog" },
  { id: "cat", name: "Cat", description: "Feral and quick, with a bite attack.", restrictions: "No weapons", badge: "Feline", perk: "+10 HP, +10 damage, bite attacks", stats: { maxHealth: 10, meleeDamage: 10, rangedDamage: 10, armor: 0, speed: 0, luck: 0 }, ability: "cat" },
  { id: "inventor", name: "Inventor", description: "Builds a small robot ally.", restrictions: "None", badge: "Engineer", perk: "Summons mini-robot companion", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "inventor" },
  { id: "shapeshifter", name: "Shapeshifter", description: "Switch between cat and dog forms.", restrictions: "None", badge: "Morph", perk: "Cat / dog form bonuses", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "shapeshifter" },
  { id: "athlete", name: "Athlete", description: "Sporty and quick on the move.", restrictions: "Sports weapons only", badge: "Athletic", perk: "Sports only", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "athlete" },
  { id: "prince", name: "Prince", description: "A magical ruler with wand-only gear.", restrictions: "Wand only", badge: "Royal", perk: "Wand only", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "prince" },
  { id: "princess", name: "Princess", description: "A magical heir with extra sparkle.", restrictions: "Wand only", badge: "Royal", perk: "+10 armor and wand-only use", stats: { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 10, speed: 0, luck: 0 }, ability: "princess" },
  { id: "guardian", name: "Guardian", description: "Defensive protector with extra lives.", restrictions: "None", badge: "Guardian", perk: "4 extra lives, no max health upgrades", stats: { maxHealth: 10, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 }, ability: "guardian" },
  { id: "teen", name: "Teen", description: "Lightning-fast and a little fragile.", restrictions: "None", badge: "Speed", perk: "+100 speed, +15 HP, -30 damage", stats: { maxHealth: 15, meleeDamage: -30, rangedDamage: -30, armor: 0, speed: 100, luck: 0 }, ability: "teen" }
];

const ENEMY_TYPES = {
  basic: { label: "Basic", size: 16, hp: 26, speed: 41, damage: 9, color: "#b6ff8a", coins: 6 },
  fast: { label: "Fast", size: 14, hp: 16, speed: 68, damage: 8, color: "#f0ff95", coins: 5 },
  tank: { label: "Tank", size: 22, hp: 70, speed: 28, damage: 16, color: "#7bd39d", coins: 10 },
  ranged: { label: "Ranged", size: 18, hp: 28, speed: 34, damage: 12, color: "#8ad4ff", coins: 8 },
  elite: { label: "Elite", size: 20, hp: 52, speed: 52, damage: 18, color: "#ffbf7a", coins: 14 },
  boss: { label: "Boss", size: 34, hp: 260, speed: 22, damage: 26, color: "#ff6b6b", coins: 25 }
};

const SETTINGS = {
  soundVolume: 0.5,
  damageNumbers: true,
};

const screenIds = {
  menu: document.getElementById("menuScreen"),
  characters: document.getElementById("characterScreen"),
  settings: document.getElementById("settingsScreen"),
  game: document.getElementById("gameScreen")
};

const ui = {
  healthText: document.getElementById("healthText"),
  coinsText: document.getElementById("coinsText"),
  waveText: document.getElementById("waveText"),
  killsText: document.getElementById("killsText"),
  livesText: document.getElementById("livesText"),
  pauseButton: document.getElementById("pauseButton"),
  statusText: document.getElementById("statusText"),
  shopCoinsText: document.getElementById("shopCoinsText"),
  shopItems: document.getElementById("shopItems"),
  savedItems: document.getElementById("savedItems"),
  inventoryList: document.getElementById("inventoryList"),
  shopOverlay: document.getElementById("shopOverlay"),
  gameOverOverlay: document.getElementById("gameOverOverlay"),
  finalWaveText: document.getElementById("finalWaveText"),
  finalKillsText: document.getElementById("finalKillsText"),
  finalCoinsText: document.getElementById("finalCoinsText"),
  soundVolumeInput: document.getElementById("soundVolumeInput"),
  damageNumbersToggle: document.getElementById("damageNumbersToggle"),
  characterGrid: document.getElementById("characterGrid"),
  selectedCharacterInfo: document.getElementById("selectedCharacterInfo"),
  weaponChoiceList: document.getElementById("weaponChoiceList"),
  weaponSelectionHint: document.getElementById("weaponSelectionHint"),
  weaponSelectionPanel: document.getElementById("weaponSelectionPanel"),
  playButton: document.getElementById("playButton"),
  charactersButton: document.getElementById("charactersButton"),
  settingsButton: document.getElementById("settingsButton"),
  startGameButton: document.getElementById("startGameButton"),
  backToMenuFromCharacters: document.getElementById("backToMenuFromCharacters"),
  backToMenuFromSettings: document.getElementById("backToMenuFromSettings"),
  rerollButton: document.getElementById("rerollButton"),
  continueButton: document.getElementById("continueButton"),
  restartButton: document.getElementById("restartButton"),
  returnMenuButton: document.getElementById("returnMenuButton")
};

let selectedCharacterId = "normal";
let selectedWeaponId = "pistol";
let game;

function setScreen(screenName) {
  Object.entries(screenIds).forEach(([key, element]) => {
    element.classList.toggle("active", key === screenName);
  });
}

function getCharacterById(id) {
  return CHARACTERS.find((character) => character.id === id) || CHARACTERS[0];
}

function getWeaponById(id) {
  return WEAPONS.find((weapon) => weapon.id === id) || WEAPONS[0];
}

function getWeaponRange(weaponId) {
  const weapon = getWeaponById(weaponId);
  return Number.isFinite(weapon.range) ? weapon.range : 25;
}

function weaponRestrictionFilter(characterId, weaponId) {
  const weapon = getWeaponById(weaponId);
  const character = getCharacterById(characterId);

  if (!character || character.id === "normal") {
    return true;
  }

  if (character.id === "ranger") return weapon.type === "ranged";
  if (character.id === "brawler") return weapon.type === "melee";
  if (character.id === "soldier") return weapon.category === "Gun";
  if (character.id === "robot") return weapon.id === "drill";
  if (character.id === "king") return weapon.category === "Medieval";
  if (character.id === "athlete") return weapon.category === "Sports";
  if (character.id === "prince" || character.id === "princess") return weapon.id === "wand";
  if (character.id === "dog" || character.id === "cat") return false;
  return true;
}

function characterStatModifiers(characterId) {
  const character = getCharacterById(characterId);
  const mods = { maxHealth: 0, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0 };

  if (!character) {
    return mods;
  }

  Object.assign(mods, character.stats);
  return mods;
}

function formatCharacterBonusText(characterId) {
  const character = getCharacterById(characterId);
  const { stats } = character;
  const effects = [];

  if (stats.maxHealth) effects.push(`${stats.maxHealth > 0 ? "+" : ""}${stats.maxHealth} HP`);
  if (stats.meleeDamage) effects.push(`${stats.meleeDamage > 0 ? "+" : ""}${stats.meleeDamage} melee`);
  if (stats.rangedDamage) effects.push(`${stats.rangedDamage > 0 ? "+" : ""}${stats.rangedDamage} ranged`);
  if (stats.armor) effects.push(`${stats.armor > 0 ? "+" : ""}${stats.armor} armor`);
  if (stats.speed) effects.push(`${stats.speed > 0 ? "+" : ""}${stats.speed} speed`);
  if (stats.luck) effects.push(`${stats.luck > 0 ? "+" : ""}${stats.luck} luck`);

  return effects.length ? effects.join(" • ") : "No bonus";
}

function createCharacterCard(character) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "character-card" + (character.id === selectedCharacterId ? " selected" : "");
  card.innerHTML = `
    <div class="character-card-head">
      <span class="character-name">${character.name}</span>
      <span class="character-badge">${character.badge}</span>
    </div>
    <div class="character-art">${getCharacterGlyph(character.id)}</div>
    <small>${character.description}</small>
    <span class="restrictions">${character.restrictions}</span>
    <small>${formatCharacterBonusText(character.id)}</small>
  `;
  card.addEventListener("click", () => {
    selectedCharacterId = character.id;
    renderCharacterSelection();
  });
  return card;
}

function getAllowedWeaponsForCharacter(characterId) {
  return WEAPONS.filter((weapon) => weaponRestrictionFilter(characterId, weapon.id));
}

function renderWeaponChoices() {
  const character = getCharacterById(selectedCharacterId);
  const allowedWeapons = getAllowedWeaponsForCharacter(character.id);

  if (!allowedWeapons.length) {
    ui.weaponSelectionPanel.style.display = "none";
    ui.weaponSelectionHint.textContent = "This class fights without a weapon.";
    selectedWeaponId = "";
    return;
  }

  ui.weaponSelectionPanel.style.display = "block";
  ui.weaponSelectionHint.textContent = character.restrictions === "None" ? "Choose your starter weapon" : character.restrictions;

  const fallbackWeapon = allowedWeapons.find((weapon) => weapon.id === selectedWeaponId) || allowedWeapons[0];
  selectedWeaponId = fallbackWeapon.id;

  ui.weaponChoiceList.innerHTML = allowedWeapons
    .map((weapon) => `
      <button type="button" class="weapon-choice ${weapon.id === selectedWeaponId ? "selected" : ""}" data-weapon-id="${weapon.id}">
        <div class="weapon-choice-top">
          <strong>${getWeaponGlyph(weapon.id)} ${weapon.name}</strong>
          <span class="weapon-type">${weapon.type}</span>
        </div>
        <small>${weapon.description}</small>
      </button>
    `)
    .join("");

  ui.weaponChoiceList.querySelectorAll(".weapon-choice").forEach((button) => {
    button.addEventListener("click", () => {
      selectedWeaponId = button.dataset.weaponId;
      renderWeaponChoices();
    });
  });
}

function renderCharacterSelectionUI() {
  ui.characterGrid.innerHTML = "";
  const cards = CHARACTERS.map(createCharacterCard);
  cards.forEach((card) => ui.characterGrid.appendChild(card));

  const character = getCharacterById(selectedCharacterId);
  ui.selectedCharacterInfo.innerHTML = `
    <div class="selected-character-identity">
      <div class="selected-character-icon">${getCharacterGlyph(character.id)}</div>
      <div class="selected-character-copy">
        <h4>${character.name}</h4>
        <strong>${character.badge}</strong>
        <p>${character.description}</p>
        <p><span>Perk:</span> ${character.perk}</p>
        <p><span>Restriction:</span> ${character.restrictions}</p>
      </div>
    </div>
  `;

  renderWeaponChoices();
}

function renderCharacterSelection() {
  renderCharacterSelectionUI();
}

function setStatus(message, duration = 1.25) {
  ui.statusText.textContent = message;
  ui.statusText.classList.add("visible");
  clearTimeout(setStatus._timeoutId);
  setStatus._timeoutId = setTimeout(() => {
    ui.statusText.classList.remove("visible");
  }, duration * 1000);
}

function playAudioTick(type = "hit") {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx || SETTINGS.soundVolume <= 0) return;

  const audio = new AudioCtx();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.connect(gain);
  gain.connect(audio.destination);

  const presets = {
    hit: { freq: 140, end: 70, duration: 0.05 },
    coin: { freq: 560, end: 800, duration: 0.06 },
    weapon: { freq: 300, end: 180, duration: 0.04 },
    shop: { freq: 420, end: 330, duration: 0.08 }
  };
  const preset = presets[type] || presets.hit;

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(preset.freq, audio.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(preset.end, audio.currentTime + preset.duration);
  gain.gain.setValueAtTime(SETTINGS.soundVolume * 0.06, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + preset.duration);

  oscillator.start();
  oscillator.stop(audio.currentTime + preset.duration);
  setTimeout(() => audio.close(), preset.duration * 1200);
}

class Player {
  constructor(characterId) {
    const character = getCharacterById(characterId);
    this.characterId = characterId;
    this.character = character;
    this.x = ARENA_WIDTH / 2;
    this.y = ARENA_HEIGHT / 2;
    this.radius = 15;
    this.speed = 120;

    this.modifiers = characterStatModifiers(characterId);
    this.baseMaxHealth = 15 + this.modifiers.maxHealth;
    this.maxHealth = this.baseMaxHealth;
    this.health = this.maxHealth;
    this.meleeDamage = this.modifiers.meleeDamage;
    this.rangedDamage = this.modifiers.rangedDamage;
    this.armor = this.modifiers.armor;
    this.speedBonus = this.modifiers.speed;
    this.luck = this.modifiers.luck;
    this.coinBonus = 0;
    this.attackSpeed = 0;
    this.invulnerability = 0;

    this.weapons = [];
    this.inventory = [];
    this.coins = 0;
    this.savedItems = [];
    this.kills = 0;
    this.lives = character.id === "guardian" ? 4 : 0;
    this.form = "default";
    this.companions = [];
    this.facingX = 1;
    this.facingY = 0;
    this.meleeSwing = 0;
    this.meleeSwingWeapon = null;

    if (character.id === "dog" || character.id === "cat") {
      this.weapons = [];
      this.biteCooldown = 0.7;
      this.biteDamage = 10 + this.modifiers.meleeDamage;
    } else {
      this.addWeapon(character.id === "princess" || character.id === "prince" ? "wand" : "pistol");
    }

    this.updateStatsFromEquipped();
    this.renderedAccessory = '';
  }

  addWeapon(weaponId, skipIntegrityCheck = false) {
    const weapon = getWeaponById(weaponId);
    if (!skipIntegrityCheck && !weaponRestrictionFilter(this.characterId, weapon.id)) {
      return false;
    }

    const existing = this.weapons.find((entry) => entry.id === weaponId);
    if (existing) {
      existing.level += 1;
      this.inventory = this.weapons.map((entry) => ({ id: entry.id, level: entry.level }));
      this.updateStatsFromEquipped();
      return true;
    }

    this.weapons.push({ id: weaponId, level: 1, cooldown: 0 });
    this.inventory = this.weapons.map((entry) => ({ id: entry.id, level: entry.level }));
    this.updateStatsFromEquipped();
    return true;
  }

  removeWeapon(weaponId) {
    const index = this.weapons.findIndex((entry) => entry.id === weaponId);
    if (index >= 0) {
      this.weapons.splice(index, 1);
      this.inventory = this.weapons.map((entry) => ({ id: entry.id, level: entry.level }));
      this.updateStatsFromEquipped();
    }
  }

  updateStatsFromEquipped() {
    const effective = { maxHealth: 15, meleeDamage: 0, rangedDamage: 0, armor: 0, speed: 0, luck: 0, coinBonus: 0, attackSpeed: 0 };
    const total = { ...this.modifiers };

    if (this.characterId === "guardian") {
      effective.maxHealth = 10;
    }

    effective.maxHealth += total.maxHealth;
    effective.meleeDamage += total.meleeDamage;
    effective.rangedDamage += total.rangedDamage;
    effective.armor += total.armor;
    effective.speed += total.speed;
    effective.luck += total.luck;

    if (this.characterId === "god") {
      const gunCount = this.weapons.filter((piece) => getWeaponById(piece.id).category === "Gun").length;
      effective.maxHealth -= gunCount * 20;
    }

    if (this.characterId === "soldier") {
      const counts = {};
      this.weapons.forEach((piece) => {
        counts[piece.id] = (counts[piece.id] || 0) + 1;
      });
      const duplicatePairs = Object.values(counts).reduce((sum, count) => sum + Math.floor(count / 2), 0);
      effective.maxHealth -= duplicatePairs * 10;
    }

    if (this.characterId === "young") {
      const rangedCount = this.weapons.filter((piece) => getWeaponById(piece.id).type === "ranged").length;
      effective.rangedDamage -= rangedCount * 20;
      effective.meleeDamage += total.meleeDamage;
      effective.rangedDamage += total.rangedDamage;
    }

    if (this.characterId === "robot") {
      effective.maxHealth += 0;
    }

    const bonusMultiplier = 1 + (this.attackSpeed || 0) / 100;
    this.baseMaxHealth = clamp(15 + effective.maxHealth, 6, 300);
    this.maxHealth = clamp(this.maxHealth + (this.baseMaxHealth - this.maxHealth) * 0.5 + (this.baseMaxHealth - this.maxHealth) * 0.05, 6, 300);

    this.meleeDamage = effective.meleeDamage;
    this.rangedDamage = effective.rangedDamage;
    this.armor = effective.armor;
    this.speedBonus = effective.speed;
    this.luck = effective.luck;
    this.coinBonus = effective.coinBonus;
    this.attackSpeed = effective.attackSpeed;

    const maxHealthFromBase = clamp(this.baseMaxHealth, 6, 300);
    if (this.health > maxHealthFromBase) {
      this.health = maxHealthFromBase;
    }
    if (this.health <= 0) {
      this.health = 1;
    }

    this.speed = 120 + this.speedBonus + (this.characterId === "teen" ? 100 : 0);
    this.damageMult = 1 + (this.characterId === "crazy" ? 0.3 : 0);

    this.weaponDamageBonus = {
      melee: this.meleeDamage,
      ranged: this.rangedDamage
    };

    const weaponTypeBreakdown = this.weapons.reduce((totals, weaponEntry) => {
      const weapon = getWeaponById(weaponEntry.id);
      if (weapon.type === "melee") totals.melee += 1;
      if (weapon.type === "ranged") totals.ranged += 1;
      return totals;
    }, { melee: 0, ranged: 0 });

    if (this.characterId === "guardian") {
      this.maxHealth = clamp(this.baseMaxHealth + 10, 6, 350);
      this.health = Math.min(this.health, this.maxHealth);
    }

    if (this.characterId === "god") {
      const gunPenalty = this.weapons.filter((piece) => getWeaponById(piece.id).category === "Gun").length * 20;
      this.maxHealth = clamp(this.baseMaxHealth - gunPenalty, 3, 350);
      this.health = clamp(this.health, 1, this.maxHealth);
    }

    if (this.characterId === "young") {
      const rangedPenalty = weaponTypeBreakdown.ranged * 10;
      this.rangedDamage = effective.rangedDamage - rangedPenalty;
    }

    if (this.characterId === "boy") {
      this.rangedDamage = effective.rangedDamage;
    }

    this.maxHealth = clamp(this.maxHealth, 6, 350);
    this.health = clamp(this.health, 0, this.maxHealth);
  }

  getEffectiveWeaponDamage(weapon) {
    const weaponDef = getWeaponById(weapon.id);
    const bonus = weaponDef.type === "melee" ? this.meleeDamage : this.rangedDamage;
    return weaponDef.damage + bonus;
  }

  getCooldown(weapon) {
    const base = getWeaponById(weapon.id).reload;
    const attackSpeedFactor = 1 - (this.attackSpeed * 0.008);
    return Math.max(0.08, base * attackSpeedFactor);
  }

  takeDamage(amount) {
    if (this.invulnerability > 0) return;
    const armorMitigation = Math.max(0, this.armor * 0.6);
    const finalDamage = Math.max(1, amount - armorMitigation);
    this.health -= finalDamage;
    this.invulnerability = 0.7;

    if (this.health <= 0) {
      if (this.characterId === "guardian" && this.lives > 0) {
        this.lives -= 1;
        this.health = this.maxHealth;
        this.invulnerability = 1.4;
        setStatus("Guardian revived!", 1.4);
        return;
      }
      game.handleGameOver();
    }
  }

  heal(amount) {
    if (this.characterId === "robot") return;
    this.health = clamp(this.health + amount, 0, this.maxHealth);
  }

  toggleForm() {
    if (this.characterId !== "shapeshifter") return;
    this.form = this.form === "cat" ? "dog" : "cat";
    const isCat = this.form === "cat";
    this.modifiers = isCat ? { ...this.modifiers, maxHealth: 10, meleeDamage: 10, rangedDamage: 10, armor: 0, speed: 0 } : { ...this.modifiers, maxHealth: 10, meleeDamage: 10, rangedDamage: 10, armor: 0, speed: 0 };
    this.updateStatsFromEquipped();
  }
}

class Enemy {
  constructor(type, x, y, wave) {
    const template = ENEMY_TYPES[type];
    const waveTier = wave <= 5 ? 1 : wave <= 10 ? 2 : 3;
    const hpByTier = { 1: 10, 2: 15, 3: 20 };
    const damageByTier = { 1: 3, 2: 6, 3: 9 };

    this.type = type;
    this.name = template.label;
    this.baseHp = hpByTier[waveTier];
    this.maxHp = this.baseHp;
    this.hp = this.maxHp;
    this.size = template.size;
    this.speed = template.speed * (1 + (wave - 1) * 0.08);
    this.damage = damageByTier[waveTier];
    this.coins = template.coins;
    this.color = template.color;
    this.x = x;
    this.y = y;
    this.radius = this.size;
    this.contactCooldown = 0;
    this.attackRange = this.type === "ranged" ? 180 : 26;
    this.projectileCooldown = 1.4;
    this.hitFlash = 0;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (this.type === "ranged") {
      if (distance > 160) {
        const move = normalizeVector(dx, dy);
        this.x += move.x * this.speed * dt;
        this.y += move.y * this.speed * dt;
      }

      this.projectileCooldown -= dt;
      if (distance < 220 && this.projectileCooldown <= 0) {
        const dir = normalizeVector(dx, dy);
        game.spawnEnemyProjectile(this.x, this.y, dir.x, dir.y, this.damage * 0.75);
        this.projectileCooldown = 1.5 + Math.random() * 0.7;
      }
    } else {
      const move = normalizeVector(dx, dy);
      this.x += move.x * this.speed * dt;
      this.y += move.y * this.speed * dt;
    }

    this.x = clamp(this.x, this.radius, ARENA_WIDTH - this.radius);
    this.y = clamp(this.y, this.radius, ARENA_HEIGHT - this.radius);

    const contact = distanceBetween(this, player) < this.radius + player.radius + 2;
    if (contact && this.contactCooldown <= 0) {
      player.takeDamage(this.damage);
      this.contactCooldown = 0.75;
    }

    this.contactCooldown = Math.max(0, this.contactCooldown - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt * 2.5);
  }
}

class Projectile {
  constructor({ x, y, vx, vy, radius, damage, color, life, owner, type, explosionRadius = 0, pierce = false }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.damage = damage;
    this.color = color;
    this.life = life;
    this.owner = owner;
    this.type = type;
    this.explosionRadius = explosionRadius;
    this.pierce = pierce;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;

    if (this.type === "speaker") {
      this.radius += dt * 30;
    }

    if (this.type === "rocket") {
      this.radius += dt * 3;
    }

    if (this.x < -20 || this.x > ARENA_WIDTH + 20 || this.y < -20 || this.y > ARENA_HEIGHT + 20 || this.life <= 0) {
      if (this.type === "rocket") {
        game.explodeRocket(this.x, this.y, this.damage, this.explosionRadius);
      }
      return false;
    }

    return true;
  }
}

class Particle {
  constructor({ x, y, vx, vy, radius, color, life, text = "", type = "spark" }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.text = text;
    this.type = type;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 15 * dt;
    this.life -= dt;
  }

  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);

    if (this.type === "text") {
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.font = "bold 14px Segoe UI";
      ctx.fillText(this.text, this.x, this.y);
      return;
    }

    ctx.fillStyle = this.color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Shop {
  constructor(gameRef) {
    this.game = gameRef;
    this.rerollCost = 12;
    this.items = [];
    this.generate();
  }

  generate() {
    const weaponPool = WEAPONS.filter((weapon) => weaponRestrictionFilter(this.game.player.characterId, weapon.id));
    const upgradePool = UPGRADE_DEFS;
    const totalItems = 4;
    const selection = [];

    for (let index = 0; index < totalItems; index += 1) {
      const roll = Math.random();
      if (roll < 0.68) {
        const weapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
        const item = { id: weapon.id, type: "weapon", data: weapon, price: Math.round(weapon.price * (1 + this.game.wave * 0.08)) };
        selection.push(item);
      } else {
        const upgrade = upgradePool[Math.floor(Math.random() * upgradePool.length)];
        const item = { id: upgrade.id, type: "upgrade", data: upgrade, price: Math.round(upgrade.price + this.game.wave * 2) };
        selection.push(item);
      }
    }

    this.items = selection;
    this.render();
  }

  reroll() {
    if (this.game.player.coins < this.rerollCost) {
      setStatus("Not enough coins for reroll");
      return;
    }

    this.game.player.coins -= this.rerollCost;
    this.rerollCost = Math.min(64, this.rerollCost + 8);
    this.generate();
    this.render();
    setStatus("Shop rerolled.");
    playAudioTick("shop");
  }

  itemKey(item) {
    return `${item.type}:${item.id}`;
  }

  isSaved(item) {
    return this.game.player.savedItems.some((saved) => this.itemKey(saved) === this.itemKey(item));
  }

  saveItem(item) {
    if (this.isSaved(item)) return;

    const record = {
      id: item.id,
      type: item.type,
      data: item.data,
      price: item.price
    };

    this.game.player.savedItems.push(record);
    setStatus(`${item.type === "weapon" ? getWeaponById(item.id).name : item.data.name} saved for later.`);
    this.render();
  }

  removeSavedItem(item) {
    this.game.player.savedItems = this.game.player.savedItems.filter((saved) => this.itemKey(saved) !== this.itemKey(item));
  }

  render() {
    ui.shopCoinsText.textContent = String(this.game.player.coins);
    const itemTint = (item) => {
      if (item.type === "upgrade") return "linear-gradient(180deg, rgba(255,214,92,0.35), rgba(255,255,255,0.06))";
      const weapon = getWeaponById(item.id);
      return weapon.type === "melee"
        ? "linear-gradient(180deg, rgba(189,232,255,0.35), rgba(255,255,255,0.06))"
        : "linear-gradient(180deg, rgba(109,224,171,0.35), rgba(255,255,255,0.06))";
    };

    const inventory = this.game.player.weapons.length ? this.game.player.weapons : [{ id: "none", level: 0 }];
    ui.inventoryList.innerHTML = inventory
      .filter((entry) => entry.id !== "none")
      .map((entry) => `<span class="inventory-chip"><span class="inventory-icon" style="background:${itemTint({type: "weapon", id: entry.id})}">${getWeaponGlyph(entry.id)}</span><strong>${getWeaponById(entry.id).name}</strong><span class="level">Lv.${entry.level}</span></span>`)
      .join("") || '<span class="inventory-chip"><span class="inventory-icon">—</span>No weapons</span>';

    const savedList = this.game.player.savedItems.filter((saved) => !this.items.some((item) => this.itemKey(item) === this.itemKey(saved)));

    ui.shopItems.innerHTML = this.items
      .map((item) => {
        const label = item.type === "weapon" ? getWeaponById(item.id).name : item.data.name;
        const detail = item.type === "weapon" ? getWeaponById(item.id).description : item.data.description;
        const tag = item.type === "weapon" ? getWeaponById(item.id).type : "Upgrade";
        const icon = item.type === "weapon" ? getWeaponGlyph(item.id) : "⬆️";
        const canBuy = item.type === "weapon" ? this.game.player.coins >= item.price && this.game.canBuyWeapon(item.id) : this.game.player.coins >= item.price && this.game.canBuyUpgrade(item.data.id);
        const isSaved = this.isSaved(item);
        const buttonLabel = canBuy ? "Buy" : (isSaved ? "Saved" : "Save");

        return `
          <div class="shop-item">
            <div class="shop-item-title">
              <div class="shop-item-name-wrap">
                <span class="shop-item-icon" style="background:${itemTint(item)}">${icon}</span>
                <h5>${label}</h5>
              </div>
              <span class="tag">${tag}</span>
            </div>
            <small>${detail}</small>
            <div class="meta">
              <span>Price: ${item.price}</span>
              <span>${item.type === "weapon" ? getWeaponById(item.id).category : "Stat"}</span>
            </div>
            <button data-item-id="${item.id}" data-item-type="${item.type}" class="${canBuy ? "" : (isSaved ? "saved" : "disabled")}" ${!canBuy && isSaved ? "disabled" : ""}>${buttonLabel}</button>
          </div>
        `;
      })
      .join("");

    ui.shopItems.querySelectorAll("button[data-item-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        const item = this.items.find((entry) => entry.id === itemId && entry.type === itemType);
        if (!item) return;

        const canBuy = item.type === "weapon" ? this.game.player.coins >= item.price && this.game.canBuyWeapon(item.id) : this.game.player.coins >= item.price && this.game.canBuyUpgrade(item.data.id);
        if (canBuy) {
          this.purchase(item);
          return;
        }

        if (this.isSaved(item)) return;
        this.saveItem(item);
      });
    });

    ui.savedItems.innerHTML = savedList.length ? savedList
      .map((item) => {
        const label = item.type === "weapon" ? getWeaponById(item.id).name : item.data.name;
        const detail = item.type === "weapon" ? getWeaponById(item.id).description : item.data.description;
        const tag = item.type === "weapon" ? getWeaponById(item.id).type : "Upgrade";
        const icon = item.type === "weapon" ? getWeaponGlyph(item.id) : "⬆️";
        const canBuy = item.type === "weapon" ? this.game.player.coins >= item.price && this.game.canBuyWeapon(item.id) : this.game.player.coins >= item.price && this.game.canBuyUpgrade(item.data.id);
        return `
          <div class="shop-item saved-item">
            <div class="shop-item-title">
              <div class="shop-item-name-wrap">
                <span class="shop-item-icon" style="background:${itemTint(item)}">${icon}</span>
                <h5>${label}</h5>
              </div>
              <span class="tag">${tag}</span>
            </div>
            <small>${detail}</small>
            <div class="meta">
              <span>Price: ${item.price}</span>
              <span>${item.type === "weapon" ? getWeaponById(item.id).category : "Stat"}</span>
            </div>
            <button data-item-id="${item.id}" data-item-type="${item.type}" class="${canBuy ? "" : "saved"}" ${canBuy ? "" : "disabled"}>${canBuy ? "Buy" : "Saved"}</button>
          </div>
        `;
      })
      .join("") : '<span class="inventory-chip"><span class="inventory-icon">⭐</span>No saved items</span>';

    ui.savedItems.querySelectorAll("button[data-item-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        const item = this.game.player.savedItems.find((entry) => entry.id === itemId && entry.type === itemType);
        if (!item) return;
        this.purchase(item);
      });
    });

    const rerollActive = this.game.player.coins >= this.rerollCost;
    ui.rerollButton.textContent = `Reroll (${this.rerollCost})`;
    ui.rerollButton.disabled = !rerollActive;
    ui.rerollButton.style.opacity = rerollActive ? "1" : "0.7";
  }

  purchase(item) {
    const price = item.price;
    if (this.game.player.coins < price) {
      setStatus("Not enough coins");
      return;
    }

    if (item.type === "weapon") {
      if (!this.game.canBuyWeapon(item.id)) {
        setStatus("Character cannot equip this weapon");
        playAudioTick("hit");
        return;
      }
      if (this.game.player.weapons.length >= MAX_WEAPONS && !this.game.player.weapons.some((entry) => entry.id === item.id)) {
        setStatus("Weapon slots full.");
        return;
      }
      this.removeSavedItem(item);
      this.game.player.coins -= price;
      this.game.player.addWeapon(item.id, true);
      setStatus(`${getWeaponById(item.id).name} acquired. Shop rerolled.`);
      playAudioTick("coin");
      this.game.updateHud();
      this.generate();
      this.render();
      return;
    }

    if (item.type === "upgrade") {
      if (!this.game.canBuyUpgrade(item.id)) {
        setStatus("This upgrade is unavailable.");
        return;
      }
      this.removeSavedItem(item);
      this.game.player.coins -= price;
      this.game.applyUpgrade(item.id);
      this.game.updateHud();
      setStatus(`${item.data.name} purchased. Shop rerolled.`);
      playAudioTick("shop");
      this.generate();
      this.render();
    }
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.style.imageRendering = "pixelated";
    this.state = "menu";
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.coins = [];
    this.wave = 1;
    this.waveActive = false;
    this.enemiesSpawned = 0;
    this.waveGoal = 5;
    this.lastFrame = performance.now();
    this.animationId = null;
    this.shop = null;
    this.paused = false;
    this.keyState = {};
    this.waveStartedAt = 0;
    this.resumeWaveAfterShop = false;
    this.inGame = false;
    this.rerollCost = 12;
    this.gameOver = false;

    this.bindUI();
    this.bindKeyboard();
    this.renderCharacterSelection();
    this.updateHud();
    this.startMenuLoop();
  }

  renderCharacterSelection() {
    renderCharacterSelectionUI();
  }

  canBuyWeapon(weaponId) {
    return weaponRestrictionFilter(this.player.characterId, weaponId);
  }

  canBuyUpgrade(upgradeId) {
    if (upgradeId === "max_health" && this.player.characterId === "guardian") return false;
    return true;
  }

  applyUpgrade(upgradeId) {
    const upgrade = UPGRADE_DEFS.find((entry) => entry.id === upgradeId);
    if (!upgrade) return;

    if (upgradeId === "max_health") {
      if (this.player.characterId === "guardian") return;
      this.player.maxHealth += 10;
      this.player.health = Math.min(this.player.health + 10, this.player.maxHealth);
    }
    if (upgradeId === "melee_damage") this.player.meleeDamage += 3;
    if (upgradeId === "ranged_damage") this.player.rangedDamage += 3;
    if (upgradeId === "attack_speed") this.player.attackSpeed += 8;
    if (upgradeId === "armor") this.player.armor += 4;
    if (upgradeId === "speed") this.player.speed += 8;
    if (upgradeId === "luck") this.player.luck += 3;
    if (upgradeId === "coin_bonus") this.player.coinBonus += 0.2;

    this.player.maxHealth = clamp(this.player.maxHealth, 6, 500);
    this.player.health = clamp(this.player.health, 0, this.player.maxHealth);
  }

  bindUI() {
    ui.playButton.addEventListener("click", () => {
      setScreen("characters");
    });

    ui.charactersButton.addEventListener("click", () => {
      setScreen("characters");
    });

    ui.settingsButton.addEventListener("click", () => {
      setScreen("settings");
    });

    ui.startGameButton.addEventListener("click", () => {
      const character = getCharacterById(selectedCharacterId);
      const allowedWeapons = getAllowedWeaponsForCharacter(character.id);
      const starterWeapon = allowedWeapons.length ? (allowedWeapons.some((weapon) => weapon.id === selectedWeaponId) ? selectedWeaponId : allowedWeapons[0].id) : "";
      this.startGame(selectedCharacterId, starterWeapon);
    });

    ui.backToMenuFromCharacters.addEventListener("click", () => setScreen("menu"));
    ui.backToMenuFromSettings.addEventListener("click", () => setScreen("menu"));

    ui.pauseButton.addEventListener("click", () => {
      if (this.state === "playing") this.togglePause();
    });

    ui.rerollButton.addEventListener("click", () => {
      if (this.shop) this.shop.reroll();
    });

    ui.continueButton.addEventListener("click", () => {
      this.resumeFromShop();
    });

    ui.restartButton.addEventListener("click", () => {
      this.startGame(selectedCharacterId);
    });

    ui.returnMenuButton.addEventListener("click", () => {
      this.stopLoop();
      this.state = "menu";
      ui.gameOverOverlay.classList.add("hidden");
      ui.shopOverlay.classList.add("hidden");
      setScreen("menu");
      this.clearArena();
      this.startMenuLoop();
      this.updateHud();
    });

    ui.soundVolumeInput.addEventListener("input", (event) => {
      SETTINGS.soundVolume = Number(event.target.value);
      playAudioTick("shop");
    });

    ui.damageNumbersToggle.addEventListener("change", (event) => {
      SETTINGS.damageNumbers = event.target.checked;
    });
  }

  bindKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (this.state === "playing") this.togglePause();
        return;
      }

      const key = event.key.toLowerCase();
      this.keyState[key] = true;

      if (key === "shift" && this.player && this.player.characterId === "shapeshifter") {
        this.player.toggleForm();
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      this.keyState[key] = false;
    });
  }

  startMenuLoop() {
    const renderMenu = () => {
      this.renderMenuBackground();
      this.animationId = requestAnimationFrame(renderMenu);
    };
    this.animationId = requestAnimationFrame(renderMenu);
  }

  stopLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  startGame(characterId, weaponId = "") {
    this.stopLoop();
    this.state = "playing";
    this.gameOver = false;
    this.player = new Player(characterId);

    if (weaponId && getAllowedWeaponsForCharacter(characterId).some((weapon) => weapon.id === weaponId)) {
      this.player.weapons = [];
      this.player.inventory = [];
      this.player.addWeapon(weaponId, true);
    }

    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.coins = [];
    this.wave = 1;
    this.waveActive = true;
    this.waveGoal = this.calculateWaveGoal(this.wave);
    this.enemiesSpawned = 0;
    this.shop = null;
    this.paused = false;
    this.lastFrame = performance.now();
    this.inGame = true;
    this.updateHud();
    ui.gameOverOverlay.classList.add("hidden");
    ui.shopOverlay.classList.add("hidden");
    setScreen("game");
    this.startLoop();
    setStatus(`Wave ${this.wave} started!`);
  }

  clearArena() {
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.coins = [];
  }

  startLoop() {
    const tick = (timestamp) => {
      const dt = clamp((timestamp - this.lastFrame) / 1000, 0, 0.033);
      this.lastFrame = timestamp;
      if (!this.paused && this.state === "playing" && !this.gameOver) {
        this.update(dt);
      }
      this.render();
      this.animationId = requestAnimationFrame(tick);
    };
    this.animationId = requestAnimationFrame(tick);
  }

  togglePause() {
    if (this.state !== "playing") return;
    this.paused = !this.paused;
    ui.pauseButton.textContent = this.paused ? "Resume" : "Pause";
    setStatus(this.paused ? "Paused" : "Resumed");
  }

  handleGameOver() {
    this.gameOver = true;
    this.state = "gameover";
    this.paused = true;
    ui.finalWaveText.textContent = String(this.wave);
    ui.finalKillsText.textContent = String(this.player.kills);
    ui.finalCoinsText.textContent = String(this.player.coins);
    ui.gameOverOverlay.classList.remove("hidden");
    setStatus("You were defeated.");
  }

  calculateWaveGoal(waveNumber) {
    return Math.min(48, 5 + waveNumber * 2 + Math.floor(waveNumber / 2));
  }

  startWave() {
    this.waveActive = true;
    this.enemiesSpawned = 0;
    this.waveGoal = this.calculateWaveGoal(this.wave);
    this.player.health = Math.min(this.player.health + 10, this.player.maxHealth);
    setStatus(`Wave ${this.wave} started!`);
  }

  enterShop() {
    this.state = "shop";
    this.paused = true;
    this.waveActive = false;
    this.shop = new Shop(this);
    ui.shopOverlay.classList.remove("hidden");
    this.updateHud();
    setStatus("Shop phase");
  }

  resumeFromShop() {
    if (this.state !== "shop") return;

    ui.shopOverlay.classList.add("hidden");
    this.state = "playing";
    this.paused = false;
    this.wave += 1;
    this.startWave();
    this.updateHud();
    ui.pauseButton.textContent = "Pause";
  }

  update(dt) {
    if (!this.player) return;

    if (this.player.characterId === "mom" && this.player.companions.length < 8) {
      if (Math.random() < 0.04) {
        this.spawnCompanion();
      }
    }

    this.updatePlayerMovement(dt);
    this.updateProjectiles(dt);
    this.updateEnemies(dt);
    this.updateParticles(dt);
    this.updateWeapons(dt);
    this.checkCollisions();

    if (this.waveActive) {
      this.spawnEnemyWave(dt);
      if (this.enemies.length === 0 && this.enemiesSpawned >= this.waveGoal) {
        this.enterShop();
      }
    }

    this.updateHud();
  }

  updateParticles(dt) {
    this.particles = this.particles.filter((particle) => particle.life > 0);
    this.particles.forEach((particle) => particle.update(dt));
  }

  updatePlayerMovement(dt) {
    if (!this.player) return;

    let moveX = 0;
    let moveY = 0;

    if (this.keyState.w || this.keyState.arrowup) moveY -= 1;
    if (this.keyState.s || this.keyState.arrowdown) moveY += 1;
    if (this.keyState.a || this.keyState.arrowleft) moveX -= 1;
    if (this.keyState.d || this.keyState.arrowright) moveX += 1;

    if (moveX !== 0 || moveY !== 0) {
      const dir = normalizeVector(moveX, moveY);
      this.player.facingX = dir.x;
      this.player.facingY = dir.y;
      const speed = this.player.speed * dt;
      this.player.x += dir.x * speed;
      this.player.y += dir.y * speed;
      this.player.x = clamp(this.player.x, this.player.radius, ARENA_WIDTH - this.player.radius);
      this.player.y = clamp(this.player.y, this.player.radius, ARENA_HEIGHT - this.player.radius);
    }

    this.player.meleeSwing = Math.max(0, this.player.meleeSwing - dt);
    this.player.invulnerability = Math.max(0, this.player.invulnerability - dt);
  }

  updateWeapons(dt) {
    if (!this.player || this.state !== "playing") return;

    for (const weaponEntry of this.player.weapons) {
      weaponEntry.cooldown = Math.max(0, (weaponEntry.cooldown || 0) - dt);
      if (weaponEntry.cooldown <= 0) {
        this.performWeaponAttack(weaponEntry);
        weaponEntry.cooldown = this.player.getCooldown(weaponEntry);
      }
    }

    if (this.player.characterId === "dog" || this.player.characterId === "cat") {
      this.player.biteCooldown = Math.max(0, (this.player.biteCooldown || 0) - dt);
      if (this.player.biteCooldown <= 0) {
        this.performBiteAttack();
        this.player.biteCooldown = 0.7;
      }
    }
  }

  performBiteAttack() {
    const player = this.player;
    if (!player) return;
    const attackRange = 25;
    let target = null;
    let best = Infinity;

    this.enemies.forEach((enemy) => {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= attackRange + enemy.radius) return;

      if (dist < best) {
        best = dist;
        target = enemy;
      }
    });

    if (!target) return;

    const damage = player.getEffectiveWeaponDamage({ id: "suitcase", type: "melee", damage: 10 });
    this.applyEnemyDamage(target, damage, player.x, player.y, "bite");
  }

  performWeaponAttack(weaponEntry) {
    const player = this.player;
    const weapon = getWeaponById(weaponEntry.id);
    const target = this.findNearestEnemy();

    if (!target && weapon.type === "ranged") {
      return;
    }

    const damage = player.getEffectiveWeaponDamage(weapon);

    if (weapon.type === "melee") {
      this.performMeleeSwing(weapon, damage);
      return;
    }

    if (weapon.attack === "projectile") {
      const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      const velocity = 300;
      this.projectiles.push(new Projectile({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: weapon.id === "rocket_launcher" ? 5 : 4,
        damage,
        color: weapon.color,
        life: weapon.id === "rocket_launcher" ? 1.5 : 1.8,
        owner: "player",
        type: weapon.id === "rocket_launcher" ? "rocket" : "projectile",
        explosionRadius: weapon.id === "rocket_launcher" ? 70 : 0
      }));
      return;
    }

    if (weapon.attack === "shotgun") {
      for (let pellet = 0; pellet < 5; pellet += 1) {
        const spread = -0.32 + pellet * 0.16;
        const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) + spread : 0;
        this.projectiles.push(new Projectile({
          x: player.x,
          y: player.y,
          vx: Math.cos(angle) * 280,
          vy: Math.sin(angle) * 280,
          radius: 4,
          damage: damage * 0.9,
          color: weapon.color,
          life: 0.8,
          owner: "player",
          type: "projectile"
        }));
      }
      return;
    }

    if (weapon.attack === "flame") {
      const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      for (let i = -2; i <= 2; i += 1) {
        const spread = angle + i * 0.18;
        this.projectiles.push(new Projectile({
          x: player.x,
          y: player.y,
          vx: Math.cos(spread) * 180,
          vy: Math.sin(spread) * 180,
          radius: 6,
          damage: damage * 0.55,
          color: "#ff8a3d",
          life: 0.4,
          owner: "player",
          type: "flame"
        }));
      }
      return;
    }

    if (weapon.attack === "speaker") {
      this.projectiles.push(new Projectile({
        x: player.x,
        y: player.y,
        vx: 0,
        vy: 0,
        radius: 8,
        damage: damage,
        color: "#a2e7ff",
        life: 0.6,
        owner: "player",
        type: "speaker"
      }));
      return;
    }

    if (weapon.attack === "wand") {
      const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      this.projectiles.push(new Projectile({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 240,
        vy: Math.sin(angle) * 240,
        radius: 5,
        damage,
        color: "#d08cff",
        life: 1.4,
        owner: "player",
        type: "magic"
      }));
      return;
    }

    if (weapon.attack === "rocket") {
      const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      this.projectiles.push(new Projectile({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 250,
        vy: Math.sin(angle) * 250,
        radius: 7,
        damage,
        color: "#ffb45e",
        life: 1.4,
        owner: "player",
        type: "rocket",
        explosionRadius: 80
      }));
    }
  }

  performMeleeSwing(weapon, damage) {
    const player = this.player;
    const range = getWeaponRange(weapon.id);
    let bestTarget = null;
    let bestDistance = Infinity;

    player.meleeSwing = 0.2;
    player.meleeSwingWeapon = weapon.id;

    this.enemies.forEach((enemy) => {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > range + enemy.radius) return;

      if (dist < bestDistance) {
        bestDistance = dist;
        bestTarget = enemy;
      }
    });

    if (!bestTarget) return;

    this.applyEnemyDamage(bestTarget, damage + (weapon.id === "drill" ? 10 : 0), player.x, player.y, weapon.id);

    const particles = Array.from({ length: 10 }, () => new Particle({
      x: bestTarget.x,
      y: bestTarget.y,
      vx: randRange(-80, 80),
      vy: randRange(-50, 20),
      radius: 2.5,
      color: weapon.color,
      life: 0.45,
      type: "spark"
    }));
    this.particles.push(...particles);
  }

  findNearestEnemy() {
    let best = null;
    let bestDistance = Infinity;

    this.enemies.forEach((enemy) => {
      const dist = distanceBetween(this.player, enemy);
      if (dist < bestDistance) {
        bestDistance = dist;
        best = enemy;
      }
    });

    return best;
  }

  spawnEnemyWave(dt) {
    if (!this.waveActive || this.enemiesSpawned >= this.waveGoal) return;
    this.spawnTimer = (this.spawnTimer || 0) - dt;
    if (this.spawnTimer > 0) return;

    const enemyType = this.getEnemyTypeForWave();
    const position = this.getSpawnLocation();
    this.enemies.push(new Enemy(enemyType, position.x, position.y, this.wave));
    this.enemiesSpawned += 1;
    this.spawnTimer = Math.max(0.25, 0.9 - this.wave * 0.03 + Math.random() * 0.3);
  }

  getEnemyTypeForWave() {
    if (this.wave > 1 && this.wave % 5 === 0 && Math.random() < 0.18) return "boss";
    if (this.wave > 2 && Math.random() < 0.22) return "ranged";
    const roll = Math.random();
    if (roll < 0.18) return "fast";
    if (roll < 0.28) return "tank";
    if (roll < 0.5) return "elite";
    return "basic";
  }

  getSpawnLocation() {
    let x = 0;
    let y = 0;
    const side = Math.floor(Math.random() * 4);

    if (side === 0) {
      x = randRange(-30, ARENA_WIDTH + 30);
      y = -25;
    } else if (side === 1) {
      x = ARENA_WIDTH + 25;
      y = randRange(-30, ARENA_HEIGHT + 30);
    } else if (side === 2) {
      x = randRange(-30, ARENA_WIDTH + 30);
      y = ARENA_HEIGHT + 25;
    } else {
      x = -25;
      y = randRange(-30, ARENA_HEIGHT + 30);
    }

    return { x, y };
  }

  spawnCompanion() {
    const companion = {
      x: this.player.x + randRange(-30, 30),
      y: this.player.y + randRange(-30, 30),
      radius: 12,
      hp: 26,
      damage: 9,
      cooldown: 0,
      color: "#d7ffd0"
    };
    this.player.companions.push(companion);
  }

  updateEnemies(dt) {
    const livingEnemies = [];

    for (const enemy of this.enemies) {
      enemy.update(dt, this.player);

      const tooClose = distanceBetween(enemy, this.player) < enemy.radius + this.player.radius + 5;
      if (enemy.hp <= 0) {
        this.handleEnemyDefeat(enemy);
        continue;
      }

      if (this.player.characterId === "mom") {
        this.player.companions.forEach((companion) => {
          if (distanceBetween(companion, enemy) < 70) {
            this.applyEnemyDamage(enemy, 8, companion.x, companion.y, "companion");
          }
        });
      }

      if (this.player.characterId === "inventor") {
        if (this.player.companions.length === 0) this.spawnCompanion();
      }

      if (tooClose && enemy.type === "ranged") {
        enemy.projectileCooldown = 0.5;
      }

      livingEnemies.push(enemy);
    }

    this.enemies = livingEnemies;
  }

  updateProjectiles(dt) {
    const remaining = [];

    for (const projectile of this.projectiles) {
      const alive = projectile.update(dt);
      if (!alive) {
        continue;
      }

      let collided = false;

      if (projectile.owner === "player") {
        for (const enemy of this.enemies) {
          if (distanceBetween(projectile, enemy) <= projectile.radius + enemy.radius) {
            this.applyEnemyDamage(enemy, projectile.damage, projectile.x, projectile.y, projectile.type);
            collided = true;
            if (projectile.type === "rocket") {
              this.explodeRocket(projectile.x, projectile.y, projectile.damage, projectile.explosionRadius);
            }
            if (projectile.type === "speaker") {
              this.createSoundWave(projectile.x, projectile.y, projectile.damage);
            }
            if (!projectile.pierce) break;
          }
        }
      } else if (this.player && distanceBetween(projectile, this.player) <= projectile.radius + this.player.radius) {
        this.player.takeDamage(projectile.damage);
        collided = true;
      }

      if (!collided) {
        remaining.push(projectile);
      }
    }

    this.projectiles = remaining;
  }

  spawnEnemyProjectile(x, y, vx, vy, damage) {
    this.projectiles.push(new Projectile({
      x,
      y,
      vx: vx * 220,
      vy: vy * 220,
      radius: 6,
      damage,
      color: "#8ad4ff",
      life: 1.5,
      owner: "enemy",
      type: "enemy_projectile"
    }));
  }

  checkCollisions() {
    if (!this.player) return;

    for (const coin of this.coins) {
      if (distanceBetween(coin, this.player) < coin.radius + this.player.radius + 4) {
        this.player.coins += coin.value;
        coin.collected = true;
        this.createBurst(coin.x, coin.y, "#ffd95e", 12, 0.5);
        playAudioTick("coin");
      }
    }

    this.coins = this.coins.filter((coin) => !coin.collected);
  }

  applyEnemyDamage(enemy, amount, hitX, hitY, source) {
    if (!enemy || enemy.hp <= 0) return;
    enemy.hp -= amount;
    enemy.hitFlash = 1;

    if (SETTINGS.damageNumbers) {
      this.particles.push(new Particle({ x: enemy.x, y: enemy.y - 10, vx: 0, vy: -30, radius: 2, color: "#ffffff", life: 0.7, text: `-${Math.round(amount)}`, type: "text" }));
    }

    this.createBurst(hitX, hitY, source === "rocket" ? "#ffb870" : "#ffe7a7", 8, 0.35);

    if (enemy.hp <= 0) {
      this.handleEnemyDefeat(enemy);
    }
  }

  explodeRocket(x, y, damage, radius) {
    const blast = radius || 70;
    this.enemies.forEach((enemy) => {
      if (distanceBetween({ x, y }, enemy) <= blast + enemy.radius) {
        this.applyEnemyDamage(enemy, damage * 0.7, x, y, "rocket");
      }
    });
    this.createBurst(x, y, "#ff9a5a", 16, 0.6);
  }

  createSoundWave(x, y, damage) {
    const radius = 20;
    this.enemies.forEach((enemy) => {
      if (distanceBetween({ x, y }, enemy) <= radius + enemy.radius) {
        this.applyEnemyDamage(enemy, damage * 0.7, x, y, "speaker");
      }
    });
    this.createBurst(x, y, "#9be7ff", 12, 0.5);
  }

  createBurst(x, y, color, amount, life) {
    for (let i = 0; i < amount; i += 1) {
      this.particles.push(new Particle({
        x,
        y,
        vx: randRange(-120, 120),
        vy: randRange(-120, 120),
        radius: randRange(2, 5),
        color,
        life,
        type: "spark"
      }));
    }
  }

  handleEnemyDefeat(enemy) {
    if (!enemy) return;
    this.player.kills += 1;
    const coinGain = enemy.coins + (this.player.characterId === "bounty_hunter" ? 0.1 : 0) + this.player.coinBonus;
    this.coins.push({ x: enemy.x, y: enemy.y, radius: 8, value: coinGain, collected: false });
    this.createBurst(enemy.x, enemy.y, "#ffd75e", 12, 0.5);
    const index = this.enemies.indexOf(enemy);
    if (index >= 0) this.enemies.splice(index, 1);
  }

  updateHud() {
    if (!this.player) return;
    ui.healthText.textContent = `${Math.ceil(this.player.health)} / ${Math.ceil(this.player.maxHealth)}`;
    ui.coinsText.textContent = String(Math.floor(this.player.coins));
    ui.waveText.textContent = String(this.wave);
    ui.killsText.textContent = String(this.player.kills);
    ui.livesText.textContent = String(this.player.lives);
    ui.shopCoinsText.textContent = String(Math.floor(this.player.coins));
  }

  renderMenuBackground() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    const sky = ctx.createLinearGradient(0, 0, 0, ARENA_HEIGHT);
    sky.addColorStop(0, "#071116");
    sky.addColorStop(0.35, "#0d1b26");
    sky.addColorStop(0.7, "#0d141c");
    sky.addColorStop(1, "#03080d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    const moonGlow = ctx.createRadialGradient(ARENA_WIDTH * 0.52, 110, 20, ARENA_WIDTH * 0.52, 110, 420);
    moonGlow.addColorStop(0, "rgba(184, 223, 255, 0.24)");
    moonGlow.addColorStop(0.23, "rgba(134, 170, 214, 0.12)");
    moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    ctx.fillStyle = "rgba(170, 210, 255, 0.05)";
    for (let i = 0; i < 7; i += 1) {
      const y = 90 + i * 30;
      ctx.fillRect(0, y, ARENA_WIDTH, 1);
    }

    ctx.fillStyle = "#0d1a24";
    for (let x = -80; x < ARENA_WIDTH + 80; x += 90) {
      for (let y = 0; y < ARENA_HEIGHT; y += 70) {
        const buildingWidth = 52;
        const buildingHeight = 42 + ((x + y) % 4) * 22;
        const xPos = x + 14;
        const yPos = y + 24;

        ctx.fillRect(xPos, yPos, buildingWidth, buildingHeight);

        ctx.fillStyle = "rgba(211, 223, 255, 0.16)";
        for (let wx = 0; wx < 3; wx += 1) {
          for (let wy = 0; wy < 3; wy += 1) {
            const winX = xPos + 10 + wx * 12;
            const winY = yPos + 10 + wy * 12;
            const lit = (wx + wy + (x / 30)) % 2 === 0;
            ctx.fillStyle = lit ? "rgba(238, 245, 255, 0.26)" : "rgba(140, 166, 197, 0.12)";
            ctx.fillRect(winX, winY, 6, 9);
          }
        }

        ctx.fillStyle = "#0d1a24";
      }
    }

    ctx.fillStyle = "rgba(11, 19, 23, 0.86)";
    ctx.fillRect(0, 260, ARENA_WIDTH, 120);

    ctx.strokeStyle = "rgba(214, 223, 240, 0.08)";
    ctx.lineWidth = 1;
    for (let y = 30; y <= ARENA_HEIGHT; y += 90) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ARENA_WIDTH, y);
      ctx.stroke();
    }

    for (let x = 30; x <= ARENA_WIDTH; x += 110) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ARENA_HEIGHT);
      ctx.stroke();
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    if (this.state === "menu") {
      this.renderMenuBackground();
      return;
    }

    const sky = ctx.createLinearGradient(0, 0, 0, ARENA_HEIGHT);
    sky.addColorStop(0, "#050a10");
    sky.addColorStop(0.25, "#0d1720");
    sky.addColorStop(0.52, "#121d2a");
    sky.addColorStop(1, "#04070b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    const cityGlow = ctx.createRadialGradient(ARENA_WIDTH * 0.52, 120, 16, ARENA_WIDTH * 0.52, 120, 360);
    cityGlow.addColorStop(0, "rgba(138, 188, 255, 0.2)");
    cityGlow.addColorStop(0.35, "rgba(95, 144, 198, 0.12)");
    cityGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = cityGlow;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    ctx.fillStyle = "#101a22";
    for (let x = -80; x < ARENA_WIDTH + 80; x += 110) {
      for (let y = 0; y < ARENA_HEIGHT; y += 90) {
        const bw = 76;
        const bh = 52 + ((x + y) % 4) * 18;
        const xPos = x + 18;
        const yPos = y + 12;
        ctx.fillRect(xPos, yPos, bw, bh);

        ctx.fillStyle = "rgba(221, 232, 255, 0.12)";
        for (let wx = 0; wx < 4; wx += 1) {
          for (let wy = 0; wy < 3; wy += 1) {
            const lit = (wx + wy + (x / 22)) % 2 === 0;
            ctx.fillStyle = lit ? "rgba(223, 232, 255, 0.22)" : "rgba(120, 155, 198, 0.08)";
            ctx.fillRect(xPos + 10 + wx * 14, yPos + 10 + wy * 12, 7, 9);
          }
        }
        ctx.fillStyle = "#101a22";
      }
    }

    ctx.fillStyle = "#0a0f14";
    ctx.fillRect(0, 242, ARENA_WIDTH, 120);

    ctx.fillStyle = "rgba(214, 223, 240, 0.10)";
    for (let x = 0; x <= ARENA_WIDTH; x += 34) {
      ctx.fillRect(x, 240, 1.5, 120);
    }

    ctx.strokeStyle = "rgba(206, 216, 234, 0.07)";
    ctx.lineWidth = 1;
    for (let grid = 0; grid < ARENA_WIDTH; grid += 28) {
      ctx.beginPath();
      ctx.moveTo(grid, 0);
      ctx.lineTo(grid, ARENA_HEIGHT);
      ctx.stroke();
    }

    for (let grid = 0; grid < ARENA_HEIGHT; grid += 28) {
      ctx.beginPath();
      ctx.moveTo(0, grid);
      ctx.lineTo(ARENA_WIDTH, grid);
      ctx.stroke();
    }

    if (this.player) {
      this.drawPlayer(this.player);
    }

    for (const projectile of this.projectiles) {
      ctx.beginPath();
      ctx.fillStyle = projectile.color;
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const enemy of this.enemies) {
      this.drawEnemy(enemy);
    }

    for (const coin of this.coins) {
      ctx.fillStyle = "#ffd95e";
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8a6a00";
      ctx.fillRect(coin.x - 2, coin.y - 2, 4, 4);
    }

    for (const particle of this.particles) {
      if (particle.type === "text") {
        ctx.fillStyle = `rgba(255,255,255,${clamp(particle.life / particle.maxLife, 0, 1)})`;
        ctx.font = "bold 14px Segoe UI";
        ctx.fillText(particle.text, particle.x, particle.y);
      } else {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.particles = this.particles.filter((particle) => particle.life > 0);
    this.coins = this.coins.filter((coin) => !coin.collected);
    this.renderPlayerHealthBar();
  }

  renderPlayerHealthBar() {
    if (!this.player) return;
    const healthRatio = clamp(this.player.health / this.player.maxHealth, 0, 1);
    const x = 30;
    const y = ARENA_HEIGHT - 28;
    const barWidth = 180;
    const height = 12;

    const ctx = this.ctx;
    ctx.fillStyle = "rgba(15, 23, 18, 0.8)";
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#82ff92";
    ctx.fillRect(x, y, barWidth * healthRatio, height);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(x, y, barWidth, height);
  }

  drawPlayer(player) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(player.x, player.y);

    const facingAngle = Math.atan2(player.facingY || 0, player.facingX || 1);
    if (player.meleeSwing > 0) {
      const weaponId = player.meleeSwingWeapon || "sword";
      const weaponColor = getWeaponById(weaponId).color || "#dfe6ff";
      const swingProgress = 1 - player.meleeSwing / 0.2;

      ctx.save();
      ctx.rotate(facingAngle);
      ctx.strokeStyle = weaponColor;
      ctx.lineWidth = 5;
      ctx.shadowColor = weaponColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#f4f7ff";
      ctx.font = "bold 14px Segoe UI";
      const glyph = getWeaponGlyph(weaponId);
      const tipX = 26 * Math.cos(0.2 * (1 - swingProgress));
      const tipY = 26 * Math.sin(0.2 * (1 - swingProgress));
      ctx.fillText(glyph, tipX, tipY);
      ctx.restore();
    }

    const costumeMap = {
      normal: { body: "#79db75", accent: "#5ec765", extra: "#1b3a1f" },
      ranger: { body: "#7bb0ff", accent: "#c3d8ff", extra: "#2d4577" },
      brawler: { body: "#d8844d", accent: "#f4bb7d", extra: "#4d2411" },
      robot: { body: "#c4d0db", accent: "#7f8ea3", extra: "#2a3540" },
      soldier: { body: "#7aa37a", accent: "#b7d39f", extra: "#1e3823" },
      king: { body: "#d9b75e", accent: "#fbe39a", extra: "#6e4a00" },
      prince: { body: "#d99df8", accent: "#f8dcff", extra: "#5e2f66" },
      princess: { body: "#f9b4d9", accent: "#ffdff0", extra: "#6a3d52" },
      athlete: { body: "#57d0a7", accent: "#beeedd", extra: "#1e6e52" },
      guardian: { body: "#84b7ff", accent: "#dfeeff", extra: "#2b4c7b" },
      inventor: { body: "#8fd4c5", accent: "#d8f7f1", extra: "#255b50" },
      dog: { body: "#8ea38d", accent: "#cddbc5", extra: "#203924" },
      cat: { body: "#a9d06c", accent: "#dff7b0", extra: "#3d5f25" },
      god: { body: "#f0d77a", accent: "#fff3b0", extra: "#7b6217" },
      mom: { body: "#dbb3a8", accent: "#f3d9d4", extra: "#764d41" },
      teen: { body: "#7fe0d3", accent: "#d9f8f4", extra: "#1d5d5a" },
      baby: { body: "#7ecb88", accent: "#d0f3bb", extra: "#2b5f33" },
      bounty_hunter: { body: "#d0a25e", accent: "#f5d7a3", extra: "#60421a" },
      shapeshifter: { body: "#88c77d", accent: "#d3f0ad", extra: "#2a4d29" },
      graduate_student: { body: "#88a5ff", accent: "#dfe7ff", extra: "#294178" },
      jockey: { body: "#7db5d0", accent: "#d8f5ff", extra: "#184b5d" },
      old: { body: "#9ca9b8", accent: "#dfe8f4", extra: "#4c5867" },
      well_rounded: { body: "#b6d77b", accent: "#e9f8d8", extra: "#486c31" },
      crazy: { body: "#ff8c5a", accent: "#ffd5a7", extra: "#6e2b1a" }
    };

    const colors = costumeMap[player.characterId] || costumeMap.normal;
    ctx.fillStyle = colors.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.accent;
    ctx.fillRect(-9, -12, 18, 4);

    ctx.fillStyle = colors.extra;
    ctx.fillRect(-5, -5, 3, 3);
    ctx.fillRect(2, -5, 3, 3);
    ctx.beginPath();
    ctx.arc(0, 2, 7, 0, Math.PI);
    ctx.strokeStyle = colors.extra;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (player.characterId === "ranger") {
      ctx.fillStyle = "#d9c66d";
      ctx.fillRect(-9, -18, 18, 4);
      ctx.fillRect(-11, -15, 22, 2);
      ctx.fillRect(-13, 12, 5, 10);
      ctx.fillRect(8, 12, 5, 10);
    }

    if (player.characterId === "brawler") {
      ctx.fillStyle = "#a66d39";
      ctx.fillRect(-16, 2, 4, 10);
      ctx.fillRect(12, 2, 4, 10);
      ctx.fillRect(-18, -8, 4, 15);
      ctx.fillRect(14, -8, 4, 15);
    }

    if (player.characterId === "robot") {
      ctx.strokeStyle = "#7f8ea3";
      ctx.lineWidth = 2;
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.fillStyle = "#f7ff96";
      ctx.fillRect(-5, -2, 10, 4);
    }

    if (player.characterId === "soldier") {
      ctx.fillStyle = "#335a3d";
      ctx.fillRect(-12, -18, 24, 6);
      ctx.fillStyle = "#c7f2ac";
      ctx.fillRect(-3, -4, 6, 6);
    }

    if (player.characterId === "well_rounded") {
      ctx.fillStyle = "#d6f7a3";
      ctx.fillRect(-15, -18, 30, 4);
      ctx.fillStyle = "#1d3d38";
      ctx.fillRect(-6, -6, 12, 3);
    }

    if (player.characterId === "old") {
      ctx.fillStyle = "#c9d8ea";
      ctx.fillRect(-13, -19, 26, 4);
      ctx.fillRect(-14, -2, 28, 3);
      ctx.strokeStyle = "#7b8ca0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-17, 12);
      ctx.lineTo(-9, 22);
      ctx.moveTo(17, 12);
      ctx.lineTo(9, 22);
      ctx.stroke();
    }

    if (player.characterId === "king" || player.characterId === "prince") {
      ctx.fillStyle = "#ffd95e";
      ctx.beginPath();
      ctx.moveTo(-10, -18);
      ctx.lineTo(-6, -25);
      ctx.lineTo(-2, -18);
      ctx.lineTo(2, -25);
      ctx.lineTo(6, -18);
      ctx.lineTo(10, -18);
      ctx.closePath();
      ctx.fill();
    }

    if (player.characterId === "princess") {
      ctx.fillStyle = "#ffd6fa";
      ctx.beginPath();
      ctx.arc(0, -19, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-8, -17, 16, 3);
    }

    if (player.characterId === "athlete") {
      ctx.fillStyle = "#ebeef5";
      ctx.fillRect(-12, -15, 24, 8);
      ctx.fillStyle = "#2b7d5c";
      ctx.fillRect(-8, -14, 16, 3);
    }

    if (player.characterId === "guardian") {
      ctx.strokeStyle = "#96d7ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(150, 215, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    if (player.characterId === "inventor") {
      ctx.strokeStyle = "#b6e7ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(-6, -7, 12, 6);
      ctx.fillStyle = "#dff7ff";
      ctx.fillRect(-2, -8, 4, 4);
    }

    if (player.characterId === "god") {
      ctx.strokeStyle = "rgba(255, 240, 160, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (player.characterId === "mom") {
      ctx.fillStyle = "#f5d5ce";
      ctx.fillRect(-10, -18, 20, 7);
      ctx.fillRect(-14, 10, 28, 5);
    }

    if (player.characterId === "baby") {
      ctx.fillStyle = "#f4f6d0";
      ctx.fillRect(-8, -20, 16, 5);
      ctx.fillStyle = "#daca9c";
      ctx.fillRect(-12, 12, 7, 11);
      ctx.fillRect(5, 12, 7, 11);
    }

    if (player.characterId === "bounty_hunter") {
      ctx.fillStyle = "#f1d5a8";
      ctx.fillRect(-10, -21, 20, 4);
      ctx.fillStyle = "#7a4b1f";
      ctx.fillRect(-14, 14, 6, 10);
      ctx.fillRect(8, 14, 6, 10);
    }

    if (player.characterId === "cat" || (player.characterId === "shapeshifter" && player.form === "cat")) {
      ctx.fillStyle = "#7aca79";
      ctx.beginPath();
      ctx.moveTo(-8, -20);
      ctx.lineTo(-12, -12);
      ctx.lineTo(-4, -15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -20);
      ctx.lineTo(12, -12);
      ctx.lineTo(4, -15);
      ctx.closePath();
      ctx.fill();
    }

    if (player.characterId === "dog" || (player.characterId === "shapeshifter" && player.form === "dog")) {
      ctx.fillStyle = "#6c8d76";
      ctx.beginPath();
      ctx.moveTo(-8, -20);
      ctx.lineTo(-4, -12);
      ctx.lineTo(-12, -15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -20);
      ctx.lineTo(4, -12);
      ctx.lineTo(12, -15);
      ctx.closePath();
      ctx.fill();
    }

    if (player.characterId === "graduate_student") {
      ctx.fillStyle = "#dce4ff";
      ctx.fillRect(-10, -18, 20, 4);
    }

    if (player.characterId === "young") {
      ctx.fillStyle = "#f1f7ff";
      ctx.fillRect(-13, -16, 26, 4);
    }

    if (player.characterId === "crazy") {
      ctx.fillStyle = "#ffb75d";
      ctx.fillRect(-8, -22, 16, 5);
      ctx.fillRect(-4, -26, 8, 4);
    }

    if (player.characterId === "teen") {
      ctx.fillStyle = "#f7fcff";
      ctx.fillRect(-13, -18, 26, 5);
      ctx.fillStyle = "#2d6d8d";
      ctx.fillRect(-5, 12, 10, 9);
    }

    ctx.restore();
  }

  drawEnemy(enemy) {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    const bodyColor = enemy.type === "boss" ? "#9dbf8f" : enemy.type === "ranged" ? "#a0c8a2" : enemy.type === "fast" ? "#aadb8d" : enemy.type === "tank" ? "#7ebf8b" : "#7fae79";
    const darkColor = enemy.type === "boss" ? "#5c6f52" : enemy.type === "ranged" ? "#2a4a3a" : "#3c523f";

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 2, enemy.size * 0.9, enemy.size * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(0, -enemy.size * 0.8, enemy.size * 0.72, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(-enemy.size, -enemy.size - 10, enemy.size * 2, 4);
    ctx.fillStyle = "#8dff8b";
    ctx.fillRect(-enemy.size, -enemy.size - 10, (enemy.hp / enemy.maxHp) * (enemy.size * 2), 4);

    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-enemy.size * 0.8, 8);
    ctx.lineTo(-enemy.size * 1.3, 18);
    ctx.moveTo(enemy.size * 0.8, 8);
    ctx.lineTo(enemy.size * 1.3, 18);
    ctx.moveTo(-enemy.size * 0.4, 18);
    ctx.lineTo(-enemy.size * 0.6, 28);
    ctx.moveTo(enemy.size * 0.4, 18);
    ctx.lineTo(enemy.size * 0.6, 28);
    ctx.stroke();

    if (enemy.type === "fast") {
      ctx.strokeStyle = "#cfeeff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-enemy.size * 0.7, -enemy.size * 0.9);
      ctx.lineTo(-enemy.size * 1.1, -enemy.size * 1.3);
      ctx.moveTo(enemy.size * 0.7, -enemy.size * 0.9);
      ctx.lineTo(enemy.size * 1.1, -enemy.size * 1.3);
      ctx.stroke();
    }

    if (enemy.type === "tank") {
      ctx.fillStyle = "#17351b";
      ctx.fillRect(-enemy.size * 0.5, -enemy.size * 1.4, enemy.size, 5);
      ctx.fillStyle = "#d2f4c7";
      ctx.fillRect(-enemy.size * 0.2, -enemy.size * 1.1, enemy.size * 0.4, 4);
    }

    ctx.fillStyle = "#1d2a1f";
    ctx.fillRect(-8, -enemy.size * 0.8 - 3, 4, 4);
    ctx.fillRect(4, -enemy.size * 0.8 - 3, 4, 4);
    ctx.fillStyle = "#dfdabf";
    ctx.fillRect(-enemy.size * 0.7, enemy.size * 0.2, 10, 3);
    ctx.fillRect(enemy.size * 0.3, enemy.size * 0.2, 10, 3);

    if (enemy.type === "ranged") {
      ctx.fillStyle = "#dfefff";
      ctx.fillRect(0, -6, 12, 6);
    }

    if (enemy.type === "boss") {
      ctx.strokeStyle = "#ffd5d5";
      ctx.lineWidth = 2;
      ctx.strokeRect(-enemy.size * 0.8, -enemy.size * 0.8, enemy.size * 1.6, enemy.size * 1.6);
      ctx.fillStyle = "#fbe0b4";
      ctx.fillRect(-enemy.size * 0.4, -enemy.size * 1.2, enemy.size * 0.8, 6);
    }

    ctx.restore();
  }
}

function initGame() {
  ui.soundVolumeInput.value = String(SETTINGS.soundVolume);
  ui.damageNumbersToggle.checked = SETTINGS.damageNumbers;
  renderCharacterSelectionUI();
  setScreen("menu");
}

window.addEventListener("DOMContentLoaded", () => {
  game = new Game();
  initGame();
  setScreen("menu");
});
