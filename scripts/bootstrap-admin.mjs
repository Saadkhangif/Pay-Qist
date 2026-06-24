import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ path: '.env.development.local', override: true });

const AUTH_URL = (process.env.NEON_AUTH_BASE_URL || process.env.VITE_NEON_AUTH_URL || '').replace(/\/$/, '');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@payqist.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';
const APP_URL = process.env.APP_URL || 'http://localhost:8787';
const ORIGIN = APP_URL.replace(/\/$/, '');

if (!AUTH_URL) {
  console.error('Missing NEON_AUTH_BASE_URL or VITE_NEON_AUTH_URL.');
  process.exit(1);
}

const cookieJar = new Map();

function storeCookies(response) {
  const setCookie = response.headers.getSetCookie?.() || [];
  for (const entry of setCookie) {
    const [pair] = entry.split(';');
    const [name, value] = pair.split('=');
    if (name && value) cookieJar.set(name.trim(), value.trim());
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function authRequest(path, { method = 'GET', body } = {}) {
  const headers = { Origin: ORIGIN };
  if (body) headers['Content-Type'] = 'application/json';
  const cookies = cookieHeader();
  if (cookies) headers.Cookie = cookies;

  const response = await fetch(`${AUTH_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  storeCookies(response);
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function ensureAdminAccount() {
  const signIn = await authRequest('/sign-in/email', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  if (signIn.response.ok) {
    console.log(`Admin account already exists: ${ADMIN_EMAIL}`);
    return signIn;
  }

  const signUp = await authRequest('/sign-up/email', {
    method: 'POST',
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: 'Admin',
    },
  });

  if (!signUp.response.ok) {
    throw new Error(signUp.payload?.message || signUp.payload?.error || 'Unable to create admin in Neon Auth.');
  }

  console.log(`Created admin account in Neon Auth: ${ADMIN_EMAIL}`);
  return signUp;
}

async function getSessionToken() {
  const tokenResponse = await authRequest('/token');
  const jwt = tokenResponse.payload?.token;

  if (jwt?.includes('.')) {
    return jwt;
  }

  const session = await authRequest('/get-session');
  const fallback = session.payload?.session?.token;
  if (fallback?.includes('.')) {
    return fallback;
  }

  throw new Error('No JWT token after sign-in.');
}

async function verifyBackendAdmin(token) {
  const me = await fetch(`${ORIGIN}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await me.json();
  if (!me.ok) {
    throw new Error(payload.error || 'Backend rejected admin session.');
  }
  if (payload.user?.role !== 'admin') {
    throw new Error(`Expected admin role, got: ${payload.user?.role}`);
  }
  return payload.user;
}

async function main() {
  console.log('Bootstrapping admin for Pay Qist...');
  console.log(`Auth URL: ${AUTH_URL}`);
  console.log(`Admin email: ${ADMIN_EMAIL}`);

  await ensureAdminAccount();
  const token = await getSessionToken();
  const user = await verifyBackendAdmin(token);

  console.log('');
  console.log('Admin portal is ready.');
  console.log(`Login URL: ${ORIGIN}/home`);
  console.log(`Admin portal: ${ORIGIN}/admin`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Role: ${user.role}`);
  console.log(`Profile ID: ${user.id}`);
}

main().catch((error) => {
  console.error('Bootstrap failed:', error.message);
  process.exit(1);
});
