// ========================================
// Navbar Component
// ========================================

import { isAuthenticated, isAdmin, getUsername, removeToken } from '../api.js';
import { navigate, getCurrentRoute } from '../router.js';

/**
 * Render the navbar into the app container.
 * Returns an update function to refresh active state.
 */
export function renderNavbar(appEl) {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  function update() {
    const currentPath = getCurrentRoute();
    const loggedIn = isAuthenticated();
    const username = getUsername();

    nav.innerHTML = `
      <div class="navbar-inner">
        <div class="navbar-logo" id="nav-logo">GAMESTORE</div>
        <div class="navbar-links">
          <span class="navbar-link ${currentPath === '/' ? 'active' : ''}" data-route="/">
            🏠 Каталог
          </span>
          ${isAdmin() ? `
            <span class="navbar-link ${currentPath === '/admin' ? 'active' : ''}" data-route="/admin">
              ⚙️ Админ
            </span>
          ` : ''}
        </div>
        <div class="navbar-user">
          ${loggedIn ? `
            <span class="navbar-username">👤 <span>${escapeHtml(username || 'User')}</span></span>
            <button class="btn btn-ghost btn-sm" id="nav-logout">Выход</button>
          ` : `
            <button class="btn btn-primary btn-sm" id="nav-login">Войти</button>
          `}
        </div>
      </div>
    `;

    // Event listeners
    nav.querySelector('#nav-logo')?.addEventListener('click', () => navigate('/'));

    nav.querySelectorAll('[data-route]').forEach((link) => {
      link.addEventListener('click', () => navigate(link.dataset.route));
    });

    nav.querySelector('#nav-login')?.addEventListener('click', () => navigate('/login'));

    nav.querySelector('#nav-logout')?.addEventListener('click', () => {
      removeToken();
      navigate('/');
      update();
    });
  }

  appEl.prepend(nav);
  update();

  // Listen for hash changes to update active link
  window.addEventListener('hashchange', update);

  return update;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
