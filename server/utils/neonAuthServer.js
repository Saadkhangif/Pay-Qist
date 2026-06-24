import { APP_URL, NEON_AUTH_BASE_URL } from '../config.js';
import { getOrCreateProfileFromNeon } from '../db/userProfiles.js';

const cookieJar = new Map();

function storeCookies(response) {
  const setCookie = response.headers.getSetCookie?.() || [];
  for (const entry of setCookie) {
    const [pair] = entry.split(';');
    const [name, value] = pair.split('=');
    if (name && value) {
      cookieJar.set(name.trim(), value.trim());
    }
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function neonAuthRequest(path, { method = 'GET', body } = {}) {
  if (!NEON_AUTH_BASE_URL) {
    throw new Error('Neon Auth is not configured.');
  }

  const headers = { Origin: APP_URL.replace(/\/$/, '') };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const cookies = cookieHeader();
  if (cookies) {
    headers.Cookie = cookies;
  }

  const response = await fetch(`${NEON_AUTH_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  storeCookies(response);
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

export async function signInWithNeonAuth({ email, password }) {
  cookieJar.clear();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const { response, payload } = await neonAuthRequest('/sign-in/email', {
    method: 'POST',
    body: { email: normalizedEmail, password: normalizedPassword },
  });

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Invalid email or password.');
  }

  const neonUser = payload?.user;
  if (!neonUser?.id) {
    throw new Error('Invalid email or password.');
  }

  return getOrCreateProfileFromNeon({
    id: neonUser.id,
    email: neonUser.email || normalizedEmail,
    name: neonUser.name,
  });
}
