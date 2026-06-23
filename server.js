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
import { imageUpload } from './server/middleware/upload.js';
import { uploadFileToBlobAndDb, getStorageStatus, streamBlobToResponse } from './server/storage/blob.js';
import { getBlobById, getBlobByPathname } from './server/db/blobs.js';
import { isDatabaseEnabled } from './server/db/index.js';
import { registerAvatarRoutes } from './server/routes/avatar.js';
import { registerBlobUploadRoutes } from './server/routes/blobUpload.js';
import { persistApplicationImages, resolvePersonImageUrls } from './server/utils/applicationImages.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const products = [...seedProducts];
const orders = [];
const payments = [];
const applications = [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
applySecurityMiddleware(app);
app.use(cookieParser());

registerAvatarRoutes(app, { csrfProtection, requireAuth });
registerBlobUploadRoutes(app, { csrfProtection, requireAuth });

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

function canViewBlob(record, auth) {
  if (!record) {
    return false;
  }

  if (auth.role === 'admin') {
    return true;
  }

  return record.uploaded_by === auth.id;
}

async function serveAuthorizedBlob(req, res, record) {
  if (!record) {
    return res.status(404).json({ error: 'File not found.' });
  }

  if (!canViewBlob(record, req.auth)) {
    return res.status(403).json({ error: 'Not allowed to view this file.' });
  }

  if (record.access === 'public') {
    return res.redirect(record.url);
  }

  try {
    const streamed = await streamBlobToResponse(res, record.pathname, 'private');
    if (!streamed) {
      return res.status(404).send('Not found');
    }
    return undefined;
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to load file.' });
  }
}

app.get('/api/csrf-token', (req, res) => {
  const csrfToken = issueCsrfToken(res);
  res.json({ csrfToken });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, storage: getStorageStatus() });
});

app.get('/api/storage/status', requireAuth, requireAdmin, (req, res) => {
  res.json(getStorageStatus());
});

app.post(
  '/api/uploads',
  requireAuth,
  imageUpload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const access = req.body.access === 'private' ? 'private' : 'public';
    const entityType = req.body.entityType || null;
    const entityId = req.body.entityId || null;
    const folder = req.body.folder || (entityType ? `${entityType}s` : 'uploads');

    try {
      const result = await uploadFileToBlobAndDb({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        folder,
        access,
        uploadedBy: req.auth.id,
        entityType,
        entityId,
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Upload failed.' });
    }
  },
);

app.get('/api/uploads/:id', requireAuth, async (req, res) => {
  if (!isDatabaseEnabled()) {
    return res.status(503).json({ error: 'Database is not configured.' });
  }

  const record = await getBlobById(req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'File record not found.' });
  }

  if (!canViewBlob(record, req.auth)) {
    return res.status(403).json({ error: 'Not allowed to view this file.' });
  }

  return res.json({
    id: record.id,
    url: record.url,
    pathname: record.pathname,
    contentType: record.content_type,
    sizeBytes: record.size_bytes,
    access: record.access,
    entityType: record.entity_type,
    entityId: record.entity_id,
    createdAt: record.created_at,
  });
});

app.get('/api/uploads/:id/file', requireAuth, async (req, res) => {
  if (!isDatabaseEnabled()) {
    return res.status(503).json({ error: 'Database is not configured.' });
  }

  const record = await getBlobById(req.params.id);
  return serveAuthorizedBlob(req, res, record);
});

app.get('/api/blobs', requireAuth, async (req, res) => {
  const pathname = req.query.pathname;

  if (!pathname || typeof pathname !== 'string') {
    return res.status(400).json({ error: 'Missing pathname' });
  }

  if (!isDatabaseEnabled()) {
    return res.status(503).json({ error: 'Database is not configured.' });
  }

  const record = await getBlobByPathname(pathname);
  return serveAuthorizedBlob(req, res, record);
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

    const { applicant: storedApplicant, referral: storedReferral } = await persistApplicationImages(
      applicant,
      referral,
      {
        applicationId,
        uploadedBy: user.id,
      },
    );

    const application = {
      id: applicationId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      applicant: storedApplicant,
      referral: storedReferral,
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

  res.json({
    ...application,
    applicant: resolvePersonImageUrls(application.applicant),
    referral: resolvePersonImageUrls(application.referral),
    relatedOrders,
  });
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
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File is too large. Maximum size is 5 MB.' });
  }

  if (err?.message === 'Only image files are allowed.') {
    return res.status(400).json({ error: err.message });
  }

  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

function setupProductionStatic() {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (IS_PRODUCTION && process.env.VERCEL) {
  setupProductionStatic();
}

async function startServer() {
  if (IS_PRODUCTION) {
    setupProductionStatic();
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
    const storage = getStorageStatus();
    if (storage.blob && storage.database) {
      console.log('Vercel Blob + Neon Postgres storage is configured.');
    } else if (storage.blob || storage.database) {
      console.log('Partial storage config:', storage);
    }
  });
}

if (!process.env.VERCEL) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default app;
