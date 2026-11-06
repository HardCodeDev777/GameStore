// ========================================
// Game Card Component
// ========================================

// Game-genre icon mapping for visual variety
const genreIcons = {
  'fighting': '⚔️',
  'roleplaying': '🧙',
  'sports': '⚽',
  'racing': '🏎️',
  'kids and family': '👨‍👩‍👧‍👦',
  'action': '💥',
  'adventure': '🗺️',
  'strategy': '♟️',
  'simulation': '🎮',
  'puzzle': '🧩',
  'horror': '👻',
  'shooter': '🔫',
  'rpg': '🧙',
};

function getGenreIcon(genre) {
  if (!genre) return '🎮';
  const key = genre.toLowerCase();
  for (const [k, v] of Object.entries(genreIcons)) {
    if (key.includes(k)) return v;
  }
  return '🎮';
}

/**
 * Create a game card DOM element
 * @param {object} game — { id, name, genre, price, releaseDate }
 * @param {number} index — for staggered animation
 * @returns {HTMLElement}
 */
export function createGameCard(game, index = 0) {
  const card = document.createElement('div');
  card.className = 'game-card card-animate';
  card.style.animationDelay = `${index * 80}ms`;

  const icon = getGenreIcon(game.genre);
  const price = typeof game.price === 'number'
    ? `$${game.price.toFixed(2)}`
    : game.price;

  const date = game.releaseDate || '—';

  card.innerHTML = `
    <div class="game-card-icon">${icon}</div>
    <div class="game-card-name">${escapeHtml(game.name)}</div>
    <div class="game-card-genre">${escapeHtml(game.genre || 'Unknown')}</div>
    <div class="game-card-meta">
      <span class="game-card-price">${price}</span>
      <span class="game-card-date">📅 ${date}</span>
    </div>
  `;

  return card;
}

/**
 * Create shimmer loading cards
 * @param {number} count
 * @returns {HTMLElement[]}
 */
export function createShimmerCards(count = 6) {
  const cards = [];
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'shimmer-card';
    card.innerHTML = `
      <div class="shimmer-line h-lg w-40"></div>
      <div class="shimmer-line w-80"></div>
      <div class="shimmer-line w-60"></div>
      <div class="shimmer-line w-40" style="margin-top: 1rem;"></div>
    `;
    cards.push(card);
  }
  return cards;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
