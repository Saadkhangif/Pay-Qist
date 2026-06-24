import { SESSION_COOKIE } from '../config.js';
import { verifySessionToken } from '../utils/session.js';
import { getUserById } from '../utils/users.js';
import { normalizeRole } from '../utils/roles.js';

function profileFromSession(decoded) {
  return {
    id: decoded.id,
    name: decoded.name || 'Customer',
    email: decoded.email || '',
    role: decoded.role || 'customer',
    cnic: '',
    phone: '',
    avatarPathname: '',
    profileComplete: false,
  };
}

async function resolveSessionAuth(req) {
  const sessionToken = req.cookies?.[SESSION_COOKIE];

  if (!sessionToken) {
    return null;
  }

  const decoded = verifySessionToken(sessionToken);
  const user = getUserById(decoded.id);
  const profile = user || profileFromSession(decoded);

  return {
    id: profile.id,
    uid: profile.id,
    email: profile.email,
    name: profile.name,
    role: normalizeRole(profile.role),
    profile,
  };
}

export async function resolveRequestAuth(req) {
  try {
    return await resolveSessionAuth(req);
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
