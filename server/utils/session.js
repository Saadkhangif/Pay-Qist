import crypto from 'crypto';
import { SESSION_MAX_AGE_MS, SESSION_SECRET } from '../config.js';

function sign(data) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
}

export function createSessionToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) {
    throw new Error('Invalid session.');
  }

  const [data, signature] = token.split('.');
  const expected = sign(data);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid session.');
  }

  const payload = JSON.parse(Buffer.from(data, 'base64url').toString());

  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error('Session expired.');
  }

  return payload;
}
