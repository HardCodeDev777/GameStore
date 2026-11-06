// ========================================
// GameStore API Client
// Fetch wrappers with JWT authentication
// ========================================

const API_BASE = '';

/** Get stored JWT token */
function getToken() {
  return localStorage.getItem('gs_token');
}

/** Save JWT token */
export function setToken(token) {
  localStorage.setItem('gs_token', token);
}

/** Remove JWT token (logout) */
export function removeToken() {
  localStorage.removeItem('gs_token');
}

/** Check if user is authenticated */
export function isAuthenticated() {
  return !!getToken();
}

/** Check if current user has Admin role */
export function isAdmin() {
  const token = getToken();
  if (!token) return false;
  try {
    // JWT uses Base64Url, but atob expects standard Base64
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    // Check both standard JWT role claim and Microsoft schema claim
    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
    
    if (Array.isArray(roleClaim)) return roleClaim.includes('Admin');
    return roleClaim === 'Admin';
  } catch {
    return false;
  }
}

/** Decode JWT payload to get username */
export function getUsername() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || payload.unique_name || payload.sub;
  } catch {
    return null;
  }
}

/** Build headers with optional JWT */
function buildHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

/** Generic fetch wrapper */
async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...buildHeaders(options.auth !== false),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data.errors) {
        errorMessage = Object.values(data.errors).flat().join(', ');
      } else if (data.title) {
        errorMessage = data.title;
      }
    } catch { /* ignore */ }
    if (res.status === 401 && url === '/auth/login') {
      errorMessage = 'Неверное имя пользователя или пароль';
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return null;
}

// ========================================
// Auth Endpoints
// ========================================

export async function login(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    auth: false,
  });
  if (data?.token) {
    setToken(data.token);
  }
  return data;
}

export async function register(username, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    auth: false,
  });
}

// ========================================
// Games Endpoints
// ========================================

export async function getGames() {
  return request('/games');
}

export async function getGame(id) {
  return request(`/games/${id}`);
}

export async function createGame(game) {
  return request('/games', {
    method: 'POST',
    body: JSON.stringify(game),
  });
}

export async function updateGame(id, game) {
  return request(`/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(game),
  });
}

export async function deleteGame(id) {
  return request(`/games/${id}`, {
    method: 'DELETE',
  });
}
