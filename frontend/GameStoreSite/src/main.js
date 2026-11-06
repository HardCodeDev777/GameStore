// ========================================
// GameStore — Main Application Entry
// ========================================

import './style.css';
import { route, startRouter } from './router.js';
import { renderNavbar } from './components/navbar.js';
import { renderHome } from './pages/home.js';
import { renderLogin } from './pages/login.js';
import { renderAdmin } from './pages/admin.js';

// Build app shell
const app = document.getElementById('app');

app.innerHTML = `
  <div id="page-content" style="opacity: 1; transform: translateY(0);"></div>
`;

// Mount navbar
renderNavbar(app);

// Register routes
route('/', renderHome);
route('/login', renderLogin);
route('/admin', renderAdmin);

// Start the router
startRouter();
