export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = Number(process.env.PORT) || 8787;
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@payqist.com').toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'payqist-dev-session-secret';
export const SESSION_COOKIE = '__session';
export const CSRF_COOKIE = 'csrf_token';
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8787,http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'strict' : 'lax',
  path: '/',
};

export const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'strict' : 'lax',
  path: '/',
};
