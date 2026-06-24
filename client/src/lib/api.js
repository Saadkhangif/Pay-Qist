const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const CSRF_COOKIE_NAME = 'csrf_token';

let csrfToken = null;

async function getAuthHeaders(isMutation) {
  const headers = {};

  if (isMutation) {
    const token = await ensureCsrfToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
  }

  return headers;
}

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
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Unable to initialize security tokens.');
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
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const authHeaders = await getAuthHeaders(isMutation);
  const headers = {
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...authHeaders,
    ...options.headers,
  };

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

export async function apiUpload(path, formData) {
  return apiFetch(path, {
    method: 'POST',
    body: formData,
  });
}

export function avatarViewUrl(pathname) {
  if (!pathname) return null;
  return `${API_BASE_URL}/api/avatar/view?pathname=${encodeURIComponent(pathname)}`;
}

export async function uploadAvatarFile(file) {
  const authHeaders = await getAuthHeaders(true);
  const response = await fetch(
    `${API_BASE_URL}/api/avatar/upload?filename=${encodeURIComponent(file.name)}`,
    {
      method: 'POST',
      body: file,
      credentials: 'include',
      headers: {
        ...authHeaders,
        'Content-Type': file.type,
      },
    },
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || payload.message || `Upload failed (${response.status}).`);
  }

  return payload;
}

export async function uploadBlobFile(file, options = {}) {
  const { access = 'private', folder, entityType, entityId } = options;
  const params = new URLSearchParams({ filename: file.name });

  if (access) {
    params.set('access', access);
  }
  if (folder) {
    params.set('folder', folder);
  }
  if (entityType) {
    params.set('entityType', entityType);
  }
  if (entityId) {
    params.set('entityId', entityId);
  }

  const authHeaders = await getAuthHeaders(true);
  const response = await fetch(`${API_BASE_URL}/api/blob-upload?${params}`, {
    method: 'POST',
    body: file,
    credentials: 'include',
    headers: {
      ...authHeaders,
      'Content-Type': file.type || 'application/octet-stream',
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || payload.message || `Upload failed (${response.status}).`);
  }

  return payload;
}

export function blobFileUrl(id) {
  if (!id) return null;
  return `${API_BASE_URL}/api/uploads/${id}/file`;
}

export function blobPathnameUrl(pathname) {
  if (!pathname) return null;
  return `${API_BASE_URL}/api/blobs?pathname=${encodeURIComponent(pathname)}`;
}

export { API_BASE_URL };
