import express from 'express';
import { uploadFileToBlob } from '../storage/blob.js';
import { isBlobStorageEnabled } from '../storage/blobClient.js';
import { MAX_UPLOAD_BYTES } from '../middleware/upload.js';

export function registerBlobUploadRoutes(app, { csrfProtection, requireAuth }) {
  app.post(
    '/api/blob-upload',
    csrfProtection,
    requireAuth,
    express.raw({
      limit: MAX_UPLOAD_BYTES,
      type: () => true,
    }),
    async (req, res) => {
      if (!isBlobStorageEnabled()) {
        return res.status(503).json({ error: 'Blob storage is not configured.' });
      }

      const filename = typeof req.query.filename === 'string' ? req.query.filename.trim() : '';
      if (!filename) {
        return res.status(400).json({ error: 'filename query param is required.' });
      }

      if (!req.body?.length) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const access = req.query.access === 'public' ? 'public' : 'private';
      const entityType = typeof req.query.entityType === 'string' ? req.query.entityType : null;
      const entityId = typeof req.query.entityId === 'string' ? req.query.entityId : null;
      const folder =
        typeof req.query.folder === 'string'
          ? req.query.folder
          : entityType
            ? `${entityType}s`
            : 'uploads';
      const contentType = req.headers['content-type'] || 'application/octet-stream';

      try {
        const result = await uploadFileToBlob({
          buffer: req.body,
          contentType,
          filename,
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
}
