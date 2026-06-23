import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ALLOWED_ORIGINS, APP_URL, CANONICAL_HOST, IS_PRODUCTION } from '../config.js';

function isAllowedHost(hostHeader) {
  if (!hostHeader) {
    return false;
  }
  return hostHeader === CANONICAL_HOST;
}

export function applySecurityMiddleware(app) {
  if (IS_PRODUCTION) {
    app.set('trust proxy', 1);
    app.use((req, res, next) => {
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        return next();
      }
      if (!isAllowedHost(req.headers.host)) {
        return res.status(400).json({ error: 'Invalid host.' });
      }
      const redirectUrl = new URL(req.originalUrl, APP_URL);
      return res.redirect(301, redirectUrl.toString());
    });
  }

  app.use(
    helmet({
      contentSecurityPolicy: IS_PRODUCTION
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
              fontSrc: ["'self'", 'https://fonts.gstatic.com'],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
              frameSrc: ["'none'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      hsts: IS_PRODUCTION
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          if (IS_PRODUCTION) {
            callback(new Error('Not allowed by CORS'));
            return;
          }
          callback(null, true);
          return;
        }
        if (ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: IS_PRODUCTION ? 300 : 2000,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests. Please try again later.' },
      skip(req) {
        // Keep CSRF bootstrap and health checks reachable even during high request bursts.
        if (req.method === 'GET' && (req.path === '/api/csrf-token' || req.path === '/api/health')) {
          return true;
        }
        return false;
      },
    }),
  );
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again later.' },
});
