export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = Number(process.env.PORT) || 8787;

function requireProductionEnv(name) {
  const value = process.env[name]?.trim();
  if (value) {
    return value;
  }
  if (IS_PRODUCTION) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return undefined;
}

function requireProductionSecret(name, devDefault) {
  const value = requireProductionEnv(name);
  if (value) {
    return value;
  }
  return devDefault;
}

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@payqist.com').toLowerCase();
export const ADMIN_PASSWORD = requireProductionSecret('ADMIN_PASSWORD', 'admin123');
export const SESSION_SECRET = requireProductionSecret('SESSION_SECRET', 'payqist-dev-session-secret-change-me');
export const APP_URL = requireProductionSecret('APP_URL', `http://localhost:${PORT}`);

if (IS_PRODUCTION) {
  if (SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production.');
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters in production.');
  }
}

export const SESSION_COOKIE = '__session';
export const CSRF_COOKIE = 'csrf_token';
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8787,http://127.0.0.1:8787,http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const parsedAppUrl = new URL(APP_URL);
export const CANONICAL_HOST = parsedAppUrl.host;

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
