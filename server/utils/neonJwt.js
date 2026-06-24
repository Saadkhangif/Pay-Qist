import * as jose from 'jose';
import { NEON_AUTH_BASE_URL } from '../config.js';

let jwks = null;

function getJwks() {
  if (!NEON_AUTH_BASE_URL) {
    return null;
  }

  if (!jwks) {
    jwks = jose.createRemoteJWKSet(new URL(`${NEON_AUTH_BASE_URL}/.well-known/jwks.json`));
  }

  return jwks;
}

export function isNeonAuthEnabled() {
  return Boolean(NEON_AUTH_BASE_URL);
}

export async function verifyNeonAuthToken(token) {
  const keys = getJwks();

  if (!keys) {
    throw new Error('Neon Auth is not configured.');
  }

  const { payload } = await jose.jwtVerify(token, keys, {
    issuer: new URL(NEON_AUTH_BASE_URL).origin,
  });

  return payload;
}
