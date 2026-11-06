// ========================================
// Modal Component
// ========================================

/**
 * Show a modal dialog
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.bodyHtml — inner HTML for the modal body
 * @param {string} options.submitLabel — text for submit button
 * @param {function} options.onSubmit — callback when submitted (receives form element)
 * @param {function} [options.onOpen] — callback after modal is rendered (receives modal element)
 * @returns {function} close function
 */
export function showModal({ title, bodyHtml, submitLabel = 'Сохранить', onSubmit, onOpen }) {
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal-overlay';

  overlay.innerHTML = `
    <div class="modal" id="active-modal">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <form id="modal-form">
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Отмена</button>
          <button type="submit" class="btn btn-primary">${submitLabel}</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  let onKey;
  const closeModal = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };

  // Close on overlay click (outside modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close buttons
  overlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  overlay.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

  // Escape key
  onKey = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', onKey);

  // Form submit
  const form = overlay.querySelector('#modal-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(form, closeModal);
    }
  });

  // onOpen callback
  if (onOpen) {
    const modal = overlay.querySelector('#active-modal');
    onOpen(modal);
  }

  // Focus first input
  const firstInput = form.querySelector('input, select');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }

  return closeModal;
}
