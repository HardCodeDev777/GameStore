// ========================================
// Minimal Hash-based SPA Router
// ========================================

const routes = {};
let currentCleanup = null;

/**
 * Register a route handler
 * @param {string} path — hash path (e.g. '/', '/login', '/admin')
 * @param {function} handler — async (container) => cleanupFn?
 */
export function route(path, handler) {
  routes[path] = handler;
}

/** Navigate to a hash route */
export function navigate(path) {
  window.location.hash = path;
}

/** Get current route path */
export function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

/** Resolve and render the current route */
async function resolve() {
  const path = getCurrentRoute();
  const handler = routes[path] || routes['/'];

  if (!handler) return;

  // Cleanup previous page
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const container = document.getElementById('page-content');
  if (!container) return;

  // Fade transition
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';

  await new Promise((r) => setTimeout(r, 100));

  container.innerHTML = '';
  const cleanup = await handler(container);
  if (typeof cleanup === 'function') {
    currentCleanup = cleanup;
  }

  // Animate in
  requestAnimationFrame(() => {
    container.style.transition = 'opacity 300ms ease, transform 300ms ease';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  });
}

/** Start listening to hash changes */
export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
