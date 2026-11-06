// ========================================
// Login / Register Page
// ========================================

import { login, register, isAuthenticated } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';

export async function renderLogin(container) {
  // Redirect if already logged in
  if (isAuthenticated()) {
    navigate('/');
    return;
  }

  let activeTab = 'login';

  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">GAMESTORE</div>
          <p class="auth-subtitle">Войдите в аккаунт или создайте новый</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login">Вход</button>
          <button class="auth-tab" id="tab-register">Регистрация</button>
        </div>

        <form id="auth-form">
          <div class="form-group">
            <label class="form-label" for="auth-username">Имя пользователя</label>
            <input class="form-input" type="text" id="auth-username" 
                   placeholder="Введите имя пользователя" required autocomplete="username" />
          </div>

          <div class="form-group">
            <label class="form-label" for="auth-password">Пароль</label>
            <input class="form-input" type="password" id="auth-password" 
                   placeholder="Введите пароль" required autocomplete="current-password" />
          </div>

          <div id="auth-error" class="form-error" style="display:none;"></div>

          <button type="submit" class="btn btn-primary form-btn" id="auth-submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  `;

  const tabLogin = container.querySelector('#tab-login');
  const tabRegister = container.querySelector('#tab-register');
  const submitBtn = container.querySelector('#auth-submit');
  const form = container.querySelector('#auth-form');
  const errorEl = container.querySelector('#auth-error');
  const passwordInput = container.querySelector('#auth-password');

  function switchTab(tab) {
    activeTab = tab;
    tabLogin.classList.toggle('active', tab === 'login');
    tabRegister.classList.toggle('active', tab === 'register');
    submitBtn.textContent = tab === 'login' ? 'Войти' : 'Зарегистрироваться';
    passwordInput.autocomplete = tab === 'login' ? 'current-password' : 'new-password';
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const username = container.querySelector('#auth-username').value.trim();
    const password = container.querySelector('#auth-password').value;

    if (!username || !password) {
      errorEl.textContent = 'Заполните все поля';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Загрузка...';

    try {
      if (activeTab === 'login') {
        await login(username, password);
        showToast(`Добро пожаловать, ${username}!`, 'success');
        navigate('/');
      } else {
        await register(username, password);
        showToast('Аккаунт создан! Теперь войдите.', 'success');
        switchTab('login');
      }
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      showToast(err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = activeTab === 'login' ? 'Войти' : 'Зарегистрироваться';
    }
  });
}
