import express from 'express';
import { Readable } from 'stream';
import { get, put } from '@vercel/blob';
import { insertBlobRecord } from '../db/blobs.js';
import { isBlobStorageEnabled, isDatabaseEnabled } from '../db/index.js';
import { updateUserAvatar } from '../utils/users.js';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

function sanitizeFilename(name = 'avatar') {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
}

function buildAvatarPathname(userId, filename) {
  return `avatars/${userId}/${Date.now()}-${sanitizeFilename(filename)}`;
}

function canViewAvatar({ auth, pathname }) {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }

  if (auth.role === 'admin') {
    return pathname.startsWith('avatars/');
  }

  return pathname.startsWith(`avatars/${auth.id}/`);
}

export function registerAvatarRoutes(app, { csrfProtection, requireAuth }) {
  app.post(
    '/api/avatar/upload',
    csrfProtection,
    requireAuth,
    express.raw({
      limit: MAX_AVATAR_BYTES,
      type: (req) => ALLOWED_TYPES.has(req.headers['content-type'] || ''),
    }),
    async (req, res) => {
      if (!isBlobStorageEnabled()) {
        return res.status(503).json({ error: 'Blob storage is not configured.' });
      }

      const filename = typeof req.query.filename === 'string' ? req.query.filename : 'avatar';
      const contentType = req.headers['content-type'] || 'application/octet-stream';

      if (!ALLOWED_TYPES.has(contentType)) {
        return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are allowed.' });
      }

      if (!req.body?.length) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      try {
        const pathname = buildAvatarPathname(req.auth.id, filename);
        const blob = await put(pathname, req.body, {
          access: 'private',
          contentType,
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: false,
        });

        let record = null;
        if (isDatabaseEnabled()) {
          record = await insertBlobRecord({
            pathname: blob.pathname || pathname,
            url: blob.url,
            contentType,
            sizeBytes: req.body.length,
            access: 'private',
            uploadedBy: req.auth.id,
            entityType: 'avatar',
            entityId: req.auth.id,
          });
        }

        updateUserAvatar(req.auth.id, blob.pathname || pathname);

        return res.json({
          url: blob.url,
          pathname: blob.pathname || pathname,
          contentType: blob.contentType || contentType,
          id: record?.id || null,
          storedInDatabase: Boolean(record),
        });
      } catch (error) {
        return res.status(500).json({ error: error.message || 'Avatar upload failed.' });
      }
    },
  );

  app.get('/api/avatar/view', requireAuth, async (req, res) => {
    if (!isBlobStorageEnabled()) {
      return res.status(503).json({ error: 'Blob storage is not configured.' });
    }

    const pathname = typeof req.query.pathname === 'string' ? req.query.pathname : '';

    if (!canViewAvatar({ auth: req.auth, pathname })) {
      return res.status(403).json({ error: 'Not allowed to view this file.' });
    }

    try {
      const result = await get(pathname, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      if (!result || result.statusCode === 404) {
        return res.status(404).json({ error: 'Avatar not found.' });
      }

      res.setHeader('Content-Type', result.blob.contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'private, max-age=3600');

      if (result.stream) {
        Readable.fromWeb(result.stream).pipe(res);
        return;
      }

      return res.status(404).json({ error: 'Avatar not found.' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Unable to load avatar.' });
    }
  });
}
