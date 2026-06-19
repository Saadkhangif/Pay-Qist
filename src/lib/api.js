const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const CSRF_COOKIE_NAME = 'csrf_token';

let csrfToken = null;

function readCsrfCookie() {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getCsrfToken() {
  return csrfToken || readCsrfCookie();
}

export async function initApiSecurity() {
  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to initialize security tokens.');
  }

  const payload = await response.json();
  csrfToken = payload.csrfToken;
  return csrfToken;
}

export async function ensureCsrfToken() {
  const existing = getCsrfToken();
  if (existing) {
    csrfToken = existing;
    return existing;
  }

  return initApiSecurity();
}

function buildErrorMessage(payload, status) {
  return payload.error || payload.message || `Request failed (${status}).`;
}

export async function apiFetch(path, options = {}, retryOnCsrf = true) {
  const method = (options.method || 'GET').toUpperCase();
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (isMutation) {
    const token = await ensureCsrfToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    credentials: 'include',
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = buildErrorMessage(payload, response.status);

    if (
      retryOnCsrf &&
      isMutation &&
      response.status === 403 &&
      typeof message === 'string' &&
      message.toLowerCase().includes('csrf')
    ) {
      csrfToken = null;
      await initApiSecurity();
      return apiFetch(path, options, false);
    }

    throw new Error(message);
  }

  return payload;
}

export { API_BASE_URL };
