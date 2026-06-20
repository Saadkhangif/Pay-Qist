import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { applySecurityMiddleware, authRateLimiter, contactRateLimiter } from './server/middleware/security.js';
import { csrfProtection, issueCsrfToken } from './server/middleware/csrf.js';
import { requireAuth, requireAdmin } from './server/middleware/auth.js';
import {
  applicationSubmitSchema,
  checkoutSchema,
  contactSchema,
  loginSchema,
  productSchema,
  profileSchema,
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
  updateUserProfile,
  listUsers,
  updateUserRole as setUserRole,
} from './server/utils/users.js';
import { seedProducts } from './src/data/seedProducts.js';

dotenv.config();

const products = [...seedProducts];
const orders = [];
const payments = [];
const applications = [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
applySecurityMiddleware(app);
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
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
    const user = createUser(req.body);
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

app.put('/api/auth/profile', requireAuth, validateBody(profileSchema), (req, res) => {
  try {
    const user = updateUserProfile(req.auth.id, req.body);
    return res.json({ user: userFromRecord(user) });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to update profile.' });
  }
});

app.get('/api/products', async (req, res) => {
  res.json(products);
});

app.post('/api/products', requireAuth, requireAdmin, validateBody(productSchema), async (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  products.push(product);
  res.json(product);
});

app.put('/api/products/:id', requireAuth, requireAdmin, validateBody(productSchema.partial()), async (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  products[index] = { ...products[index], ...req.body, id: req.params.id };
  res.json(products[index]);
});

app.delete('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  products.splice(index, 1);
  res.json({ success: true });
});

app.get('/api/orders', requireAuth, async (req, res) => {
  const userOrders =
    req.auth.role === 'admin'
      ? orders
      : orders.filter((order) => order.userId === req.auth.id);
  res.json(userOrders);
});

app.get('/api/payments', requireAuth, async (req, res) => {
  const userPayments =
    req.auth.role === 'admin'
      ? payments
      : payments.filter((payment) => payment.userId === req.auth.id);
  res.json(userPayments);
});

const ALLOW_MOCK_CHECKOUT = !IS_PRODUCTION || process.env.ALLOW_MOCK_CHECKOUT === 'true';

function processCartCheckout({ cart, user, paymentMethod = 'card', paymentReference = '', applicationId = null }) {
  const createdOrders = [];
  const createdPayments = [];

  for (const item of cart) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const allowedMonths = product.allowedInstallmentMonths?.length
      ? product.allowedInstallmentMonths
      : [3, 6, 12];
    const installmentMonths = item.installmentMonths || allowedMonths[allowedMonths.length - 1];

    if (!allowedMonths.includes(installmentMonths)) {
      throw new Error(
        `Invalid installment plan for ${product.title}. Allowed: ${allowedMonths.join(', ')} months.`,
      );
    }

    const unitDownPayment = Math.round(Number(product.price) * 0.2);
    const unitMonthly = Math.ceil(Math.max(0, Number(product.price) - unitDownPayment) / installmentMonths);
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const order = {
      id: orderId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.imageUrl,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      installmentMonths,
      monthlyPayment: unitMonthly,
      downPayment: unitDownPayment * item.quantity,
      paymentStatus: 'approved',
      paymentMethod,
      quantity: item.quantity,
      applicationId,
      createdAt,
    };

    const payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      orderId,
      orderTitle: product.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: unitDownPayment * item.quantity,
      paymentMethod,
      paymentReference: paymentReference || '',
      paymentStatus: 'completed',
      createdAt,
    };

    createdOrders.push(order);
    createdPayments.push(payment);
    orders.push(order);
    payments.push(payment);
  }

  return { createdOrders, createdPayments };
}

app.post('/api/checkout', requireAuth, validateBody(checkoutSchema), async (req, res) => {
  if (!ALLOW_MOCK_CHECKOUT) {
    return res.status(501).json({ error: 'Payment processing is not configured.' });
  }

  const { cart, paymentMethod = 'card', paymentReference = '' } = req.body;
  const user = getUserById(req.auth.id);

  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }

  if (user.role !== 'admin' && !user.profileComplete) {
    return res.status(403).json({ error: 'Complete your profile before checkout.' });
  }

  try {
    const { createdOrders, createdPayments } = processCartCheckout({
      cart,
      user,
      paymentMethod,
      paymentReference,
    });

    res.json({
      createdOrders,
      createdPayments,
      userId: req.auth.id,
      paymentMethod,
      itemCount: cart.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Checkout failed.' });
  }
});

app.post('/api/applications/submit', requireAuth, validateBody(applicationSubmitSchema), async (req, res) => {
  if (!ALLOW_MOCK_CHECKOUT) {
    return res.status(501).json({ error: 'Application processing is not configured.' });
  }

  const { cart, paymentMethod = 'card', paymentReference = '', applicant, referral } = req.body;
  const user = getUserById(req.auth.id);

  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }

  if (user.role !== 'admin' && !user.profileComplete) {
    return res.status(403).json({ error: 'Complete your profile before applying.' });
  }

  try {
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const application = {
      id: applicationId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      applicant,
      referral,
      status: 'submitted',
      createdAt,
    };

    applications.push(application);

    const { createdOrders, createdPayments } = processCartCheckout({
      cart,
      user,
      paymentMethod,
      paymentReference,
      applicationId,
    });

    res.json({
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt,
        applicantName: applicant.fullName,
      },
      createdOrders,
      createdPayments,
      userId: req.auth.id,
      paymentMethod,
      itemCount: cart.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to submit application.' });
  }
});

app.get('/api/applications/mine', requireAuth, (req, res) => {
  const mine = applications
    .filter((entry) => entry.userId === req.auth.id)
    .map((entry) => ({
      id: entry.id,
      status: entry.status,
      createdAt: entry.createdAt,
      applicantName: entry.applicant.fullName,
      orderCount: orders.filter((order) => order.applicationId === entry.id).length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(mine);
});

app.get('/api/applications', requireAuth, requireAdmin, (req, res) => {
  res.json(
    applications
      .map((entry) => ({
        id: entry.id,
        userId: entry.userId,
        userName: entry.userName,
        userEmail: entry.userEmail,
        applicantName: entry.applicant.fullName,
        applicantPhone: entry.applicant.phone,
        applicantEmail: entry.applicant.email,
        referralName: entry.referral.fullName,
        referralPhone: entry.referral.phone,
        status: entry.status,
        createdAt: entry.createdAt,
        orderCount: orders.filter((order) => order.applicationId === entry.id).length,
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  );
});

app.get('/api/applications/:id', requireAuth, requireAdmin, (req, res) => {
  const application = applications.find((entry) => entry.id === req.params.id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const relatedOrders = orders
    .filter((order) => order.applicationId === application.id)
    .map((order) => ({
      id: order.id,
      productTitle: order.productTitle,
      productImage: order.productImage,
      installmentMonths: order.installmentMonths,
      monthlyPayment: order.monthlyPayment,
      downPayment: order.downPayment,
      paymentMethod: order.paymentMethod,
      quantity: order.quantity,
    }));

  res.json({ ...application, relatedOrders });
});

app.post('/api/contact', contactRateLimiter, validateBody(contactSchema), (req, res) => {
  res.json({ success: true, message: 'Message received.' });
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
      const user = setUserRole(req.params.id, req.body.role, req.auth.id);
      res.json({ success: true, role: user.role });
    } catch (error) {
      res.status(404).json({ error: error.message || 'User not found.' });
    }
  },
);

app.use((err, req, res, _next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

async function startServer() {
  if (IS_PRODUCTION) {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      return res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Pay Qist running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
