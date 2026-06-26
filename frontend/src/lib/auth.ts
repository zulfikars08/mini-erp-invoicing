const TOKEN_KEY = 'mini_erp_token';
const USER_KEY = 'mini_erp_user';

export function getToken() { if (typeof window === 'undefined') return null; return localStorage.getItem(TOKEN_KEY); }
export function setSession(token: string, user: unknown) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function clearSession() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
export function getUser() { if (typeof window === 'undefined') return null; const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; }
