// Tiny auth helpers. The token is a JWT stored in localStorage; the API
// client reads it on every request. Trade-off documented in the plan:
// vulnerable to XSS, OK for a single-operator gestionale. To be hardened
// later with httpOnly cookies + CSRF.

const KEY = 'esteticaLuna.token';

export function getToken() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}
