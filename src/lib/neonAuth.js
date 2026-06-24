import { createAuthClient } from '@neondatabase/neon-js/auth';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL || '';

export const isNeonAuthConfigured = Boolean(authUrl);
export const authClient = isNeonAuthConfigured ? createAuthClient(authUrl) : null;

export async function getNeonSessionToken() {
  if (!authClient) {
    return null;
  }

  if (typeof authClient.getJWTToken === 'function') {
    const token = await authClient.getJWTToken();
    if (token) {
      return token;
    }
  }

  const { data } = await authClient.getSession();
  return data?.session?.token || null;
}

export async function neonSignIn({ email, password }) {
  if (!authClient) {
    throw new Error('Neon Auth is not configured.');
  }

  const result = await authClient.signIn.email({ email, password });

  if (result.error) {
    throw new Error(result.error.message || 'Invalid email or password.');
  }

  return result.data;
}

export async function neonSignUp({ email, password, name }) {
  if (!authClient) {
    throw new Error('Neon Auth is not configured.');
  }

  const result = await authClient.signUp.email({
    email,
    password,
    name: name || email.split('@')[0] || 'Customer',
  });

  if (result.error) {
    throw new Error(result.error.message || 'Unable to create account.');
  }

  return result.data;
}

export async function neonSignOut() {
  if (!authClient) {
    return;
  }

  await authClient.signOut();
}

export async function neonGetSession() {
  if (!authClient) {
    return null;
  }

  const { data } = await authClient.getSession();
  return data;
}
