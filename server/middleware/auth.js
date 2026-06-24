import { SESSION_COOKIE } from '../config.js';
import { verifySessionToken } from '../utils/session.js';
import { getUserById } from '../utils/users.js';
import { normalizeRole } from '../utils/roles.js';
import { isNeonAuthEnabled, verifyNeonAuthToken } from '../utils/neonJwt.js';
import { isDatabaseEnabled } from '../db/index.js';
import { getOrCreateProfileFromNeon, getProfileById } from '../db/userProfiles.js';

function bearerToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7).trim();
}

async function resolveNeonAuth(req) {
  const token = bearerToken(req);

  if (!token || !isNeonAuthEnabled()) {
    return null;
  }

  const payload = await verifyNeonAuthToken(token);
  const userId = payload.sub;

  if (!userId) {
    return null;
  }

  const email =
    typeof payload.email === 'string'
      ? payload.email
      : typeof payload.user_email === 'string'
        ? payload.user_email
        : '';
  const name =
    typeof payload.name === 'string'
      ? payload.name
      : typeof payload.user_name === 'string'
        ? payload.user_name
        : email.split('@')[0] || 'Customer';

  const profile = await getOrCreateProfileFromNeon({
    id: userId,
    email,
    name,
  });

  return {
    id: profile.id,
    uid: profile.id,
    email: profile.email,
    name: profile.name,
    role: normalizeRole(profile.role),
    profile,
  };
}

async function resolveLegacyAuth(req) {
  const sessionToken = req.cookies?.[SESSION_COOKIE];

  if (!sessionToken) {
    return null;
  }

  const decoded = verifySessionToken(sessionToken);

  if (isNeonAuthEnabled() && isDatabaseEnabled()) {
    const profile = await getProfileById(decoded.id);
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      uid: profile.id,
      email: profile.email,
      name: profile.name,
      role: normalizeRole(profile.role),
      profile,
    };
  }

  const user = getUserById(decoded.id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    uid: user.id,
    email: user.email,
    name: user.name,
    role: normalizeRole(user.role),
    profile: user,
  };
}

export async function resolveRequestAuth(req) {
  try {
    const neonAuth = await resolveNeonAuth(req);
    if (neonAuth) {
      return neonAuth;
    }
  } catch {
    return null;
  }

  try {
    return await resolveLegacyAuth(req);
  } catch {
    return null;
  }
}

export async function requireAuth(req, res, next) {
  const auth = await resolveRequestAuth(req);

  if (!auth) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  req.auth = auth;
  return next();
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  return next();
}

export async function getAuthenticatedProfile(req) {
  const auth = await resolveRequestAuth(req);
  return auth?.profile || null;
}
