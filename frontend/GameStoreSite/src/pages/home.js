// ========================================
// Home Page — Hero + Game Catalog
// ========================================

import { getGames } from '../api.js';
import { createGameCard, createShimmerCards } from '../components/gameCard.js';
import { showToast } from '../components/toast.js';

export async function renderHome(container) {
  container.innerHTML = `
    <div class="page">
      <div class="container">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-tag">🚀 PREMIUM GAME LIBRARY</div>
          <h1>Откройте мир<br/>невероятных игр</h1>
          <p class="hero-subtitle">
            Просматривайте коллекцию лучших игр. Управляйте каталогом,
            добавляйте новые тайтлы и следите за релизами.
          </p>
          <div class="hero-stats" id="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value" id="stat-games">—</div>
              <div class="hero-stat-label">Игр в каталоге</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" id="stat-genres">—</div>
              <div class="hero-stat-label">Жанров</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" id="stat-latest">—</div>
              <div class="hero-stat-label">Последний релиз</div>
            </div>
          </div>
        </section>

        <!-- Catalog Section -->
        <section>
          <div class="section-header">
            <div>
              <h2 class="section-title">Каталог игр</h2>
              <div class="section-divider"></div>
            </div>
          </div>
          <div class="games-grid" id="games-grid"></div>
        </section>
      </div>
    </div>
  `;

  const grid = container.querySelector('#games-grid');

  // Show shimmer loading
  const shimmers = createShimmerCards(6);
  shimmers.forEach((s) => grid.appendChild(s));

  try {
    const games = await getGames();

    // Update stats
    const gamesCount = games.length;
    const genres = new Set(games.map((g) => g.genre).filter(Boolean));
    const dates = games.map((g) => g.releaseDate).filter(Boolean).sort();
    const latestDate = dates.length > 0 ? dates[dates.length - 1] : '—';

    animateCounter('stat-games', gamesCount);
    animateCounter('stat-genres', genres.size);
    const latestEl = container.querySelector('#stat-latest');
    if (latestEl) latestEl.textContent = latestDate;

    // Clear shimmer
    grid.innerHTML = '';

    if (games.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🎮</div>
          <div class="empty-state-text">Каталог пока пуст</div>
          <div class="empty-state-sub">Войдите как администратор, чтобы добавить игры</div>
        </div>
      `;
      return;
    }

    // Render game cards
    games.forEach((game, i) => {
      const card = createGameCard(game, i);
      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-text">Не удалось загрузить игры</div>
        <div class="empty-state-sub">${escapeHtml(err.message)}</div>
      </div>
    `;
    showToast(err.message, 'error');
  }
}

/** Animate a number counting up */
function animateCounter(elId, target) {
  const el = document.getElementById(elId);
  if (!el || target === 0) {
    if (el) el.textContent = target;
    return;
  }

  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 30);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
