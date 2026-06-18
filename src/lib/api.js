const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let csrfToken = null;

export function usesSecureApi() {
  return Boolean(API_BASE_URL);
}

export async function initApiSecurity() {
  if (!usesSecureApi()) return;

  const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to initialize security tokens.');
  }

  const payload = await response.json();
  csrfToken = payload.csrfToken;
}

export async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    credentials: 'include',
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

export { API_BASE_URL };
