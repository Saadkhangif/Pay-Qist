import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { applySecurityMiddleware, authRateLimiter } from './server/middleware/security.js';
import { csrfProtection, issueCsrfToken } from './server/middleware/csrf.js';
import { requireAuth, requireAdmin } from './server/middleware/auth.js';
import {
  checkoutSchema,
  loginSchema,
  productSchema,
  roleUpdateSchema,
  signupSchema,
  validateBody,
} from './server/validation/schemas.js';
import {
  COOKIE_OPTIONS,
  IS_PRODUCTION,
  PORT,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
} from './server/config.js';
import { userFromRecord } from './server/utils/roles.js';
import { createSessionToken, verifySessionToken } from './server/utils/session.js';
import {
  authenticate,
  createUser,
  getUserById,
  listUsers,
  updateUserRole as setUserRole,
} from './server/utils/users.js';

dotenv.config();

const app = express();
applySecurityMiddleware(app);
app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));
app.use('/api', csrfProtection);

function setSessionCookie(res, user) {
  res.cookie(SESSION_COOKIE, createSessionToken(user), {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_MAX_AGE_MS,
  });
}

function clearSession(res) {
  res.clearCookie(SESSION_COOKIE, COOKIE_OPTIONS);
}

app.get('/api/csrf-token', (req, res) => {
  const csrfToken = issueCsrfToken(res);
  res.json({ csrfToken });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const sessionToken = req.cookies?.[SESSION_COOKIE];
  if (!sessionToken) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const decoded = verifySessionToken(sessionToken);
    const user = getUserById(decoded.id);

    if (!user) {
      clearSession(res);
      return res.status(401).json({ error: 'Session expired.' });
    }

    return res.json({ user: userFromRecord(user) });
  } catch {
    clearSession(res);
    return res.status(401).json({ error: 'Session expired.' });
  }
});

app.post('/api/auth/signup', authRateLimiter, validateBody(signupSchema), (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = createUser(name, email, password);
    setSessionCookie(res, user);
    return res.json({ user: userFromRecord(user) });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to create account.' });
  }
});

app.post('/api/auth/login', authRateLimiter, validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body;
  const user = authenticate(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  setSessionCookie(res, user);
  return res.json({ user: userFromRecord(user) });
});

app.post('/api/auth/logout', (req, res) => {
  clearSession(res);
  return res.json({ message: 'Logged out.' });
});

app.get('/api/products', async (req, res) => {
  res.json([]);
});

app.post('/api/products', requireAuth, requireAdmin, validateBody(productSchema), async (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  res.json(product);
});

app.put('/api/products/:id', requireAuth, requireAdmin, validateBody(productSchema.partial()), async (req, res) => {
  res.json({ id: req.params.id, ...req.body, success: true });
});

app.delete('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
  res.json({ success: true });
});

app.get('/api/orders', requireAuth, async (req, res) => {
  res.json([]);
});

app.get('/api/payments', requireAuth, async (req, res) => {
  res.json([]);
});

app.post('/api/checkout', requireAuth, validateBody(checkoutSchema), async (req, res) => {
  const { cart, paymentMethod } = req.body;
  res.json({
    createdOrders: [],
    createdPayments: [],
    userId: req.auth.id,
    paymentMethod: paymentMethod || 'card',
    itemCount: cart.length,
  });
});

app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  res.json(listUsers());
});

app.put(
  '/api/users/:id/role',
  requireAuth,
  requireAdmin,
  validateBody(roleUpdateSchema),
  (req, res) => {
    try {
      const user = setUserRole(req.params.id, req.body.role);
      res.json({ success: true, role: user.role });
    } catch (error) {
      res.status(404).json({ error: error.message || 'User not found.' });
    }
  },
);

app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  if (IS_PRODUCTION) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
  return res.status(500).json({ error: err.message || 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Secure API running on http://localhost:${PORT}`);
});
