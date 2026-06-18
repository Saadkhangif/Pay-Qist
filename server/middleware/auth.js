import { verifySessionToken } from '../utils/session.js';
import { getUserById } from '../utils/users.js';
import { normalizeRole } from '../utils/roles.js';

export async function requireAuth(req, res, next) {
  const sessionToken = req.cookies?.__session;

  if (!sessionToken) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = verifySessionToken(sessionToken);
    const user = getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }

    req.auth = {
      id: user.id,
      uid: user.id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role, user.email),
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  return next();
}
