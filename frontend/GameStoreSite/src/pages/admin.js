// ========================================
// Admin Page — CRUD Management
// ========================================

import { getGames, createGame, updateGame, deleteGame, isAuthenticated, isAdmin } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

// Genre options (matches backend seed data by convention)
const GENRES = [
  { id: 1, name: 'Fighting' },
  { id: 2, name: 'RolePlaying' },
  { id: 3, name: 'Sports' },
  { id: 4, name: 'Racing' },
  { id: 5, name: 'Kids and Family' },
];

export async function renderAdmin(container) {
  // Guard: must be authenticated
  if (!isAuthenticated()) {
    navigate('/login');
    showToast('Войдите, чтобы получить доступ к админ-панели', 'error');
    return;
  }

  // Guard: must have Admin role
  if (!isAdmin()) {
    navigate('/');
    showToast('Доступ запрещён. Требуется роль администратора.', 'error');
    return;
  }

  container.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Управление играми</h1>
            <div class="section-divider"></div>
          </div>
          <button class="btn btn-primary" id="btn-add-game">
            ➕ Добавить игру
          </button>
        </div>
        <div class="table-wrapper">
          <table class="table" id="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Жанр</th>
                <th>Цена</th>
                <th>Дата релиза</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody id="admin-tbody">
              <tr>
                <td colspan="6" style="text-align:center; padding: 2rem;">
                  ⏳ Загрузка...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const tbody = container.querySelector('#admin-tbody');
  const addBtn = container.querySelector('#btn-add-game');

  let games = [];

  // Load and render games
  async function loadGames() {
    try {
      games = await getGames();
      renderTable();
    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--error);">
            ⚠️ ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
      showToast(err.message, 'error');
    }
  }

  function renderTable() {
    if (games.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">
            Игр пока нет. Нажмите «Добавить игру».
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = games.map((game) => `
      <tr>
        <td><span style="color: var(--text-muted); font-size: 0.8rem;">#${game.id}</span></td>
        <td style="color: var(--text-primary); font-weight: 500;">${escapeHtml(game.name)}</td>
        <td><span class="table-badge">${escapeHtml(game.genre || '—')}</span></td>
        <td><span class="table-price">$${Number(game.price).toFixed(2)}</span></td>
        <td>${game.releaseDate || '—'}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" data-edit="${game.id}" title="Редактировать">✏️</button>
            <button class="btn btn-danger btn-sm" data-delete="${game.id}" title="Удалить">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Edit buttons
    tbody.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.edit);
        const game = games.find((g) => g.id === id);
        if (game) openEditModal(game);
      });
    });

    // Delete buttons
    tbody.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.delete);
        const game = games.find((g) => g.id === id);
        if (!game) return;

        if (!confirm(`Удалить "${game.name}"?`)) return;

        try {
          await deleteGame(id);
          showToast(`"${game.name}" удалена`, 'success');
          await loadGames();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });
  }

  // Genre options HTML
  function genreOptionsHtml(selectedId = '') {
    return GENRES.map((g) =>
      `<option value="${g.id}" ${g.id == selectedId ? 'selected' : ''}>${g.name}</option>`
    ).join('');
  }

  // Game form HTML
  function gameFormHtml(game = null) {
    return `
      <div class="form-group">
        <label class="form-label" for="game-name">Название</label>
        <input class="form-input" type="text" id="game-name" placeholder="Название игры" 
               value="${game ? escapeAttr(game.name) : ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="game-genre">Жанр</label>
        <select class="form-input" id="game-genre" required>
          <option value="" disabled ${!game ? 'selected' : ''}>Выберите жанр</option>
          ${genreOptionsHtml(game?.genreId)}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="game-price">Цена ($)</label>
        <input class="form-input" type="number" id="game-price" step="0.01" min="0" 
               placeholder="29.99" value="${game ? game.price : ''}" required />
      </div>
      <div class="form-group">
        <label class="form-label" for="game-date">Дата релиза</label>
        <input class="form-input" type="date" id="game-date" 
               value="${game ? game.releaseDate : ''}" required />
      </div>
    `;
  }

  // Add game
  addBtn.addEventListener('click', () => {
    showModal({
      title: 'Добавить игру',
      bodyHtml: gameFormHtml(),
      submitLabel: 'Создать',
      onSubmit: async (form, close) => {
        const data = getFormData(form);
        try {
          await createGame(data);
          showToast('Игра добавлена!', 'success');
          close();
          await loadGames();
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  });

  // Edit game
  function openEditModal(game) {
    showModal({
      title: 'Редактировать игру',
      bodyHtml: gameFormHtml(game),
      submitLabel: 'Сохранить',
      onSubmit: async (form, close) => {
        const data = getFormData(form);
        try {
          await updateGame(game.id, data);
          showToast(`"${data.name}" обновлена`, 'success');
          close();
          await loadGames();
        } catch (err) {
          showToast(err.message, 'error');
        }
      },
    });
  }

  function getFormData(form) {
    return {
      name: form.querySelector('#game-name').value.trim(),
      genreId: parseInt(form.querySelector('#game-genre').value),
      price: parseFloat(form.querySelector('#game-price').value),
      releaseDate: form.querySelector('#game-date').value,
    };
  }

  await loadGames();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
