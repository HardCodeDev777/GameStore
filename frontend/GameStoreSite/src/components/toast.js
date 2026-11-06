// ========================================
// Toast Notification Component
// ========================================

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'} type
 * @param {number} duration — ms
 */
export function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : '✕';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    const removeFallback = setTimeout(() => toast.remove(), 1000);
    toast.addEventListener('animationend', (event) => {
      if (event.target !== toast) return;
      clearTimeout(removeFallback);
      toast.remove();
    }, { once: true });
  }, duration);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
