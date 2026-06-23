import { Readable } from 'node:stream';
import { put, del, get } from '@vercel/blob';
import { insertBlobRecord } from '../db/blobs.js';
import { isBlobStorageEnabled, isDatabaseEnabled } from '../db/index.js';

function sanitizeFilename(name = 'file') {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

function buildPathname({ folder, filename, userId }) {
  const safeName = sanitizeFilename(filename);
  const prefix = folder || 'uploads';
  const owner = userId ? `${userId}/` : '';
  return `${prefix}/${owner}${Date.now()}-${safeName}`;
}

/**
 * Upload a file to Vercel Blob and persist metadata in Neon Postgres.
 * Blob stores the file; the database stores the URL + metadata for lookups.
 */
export async function uploadFileToBlobAndDb({
  buffer,
  contentType,
  filename,
  folder,
  access = 'public',
  uploadedBy,
  entityType,
  entityId,
}) {
  if (!isBlobStorageEnabled()) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Add Vercel Blob to your project.');
  }

  const pathname = buildPathname({ folder, filename, userId: uploadedBy });
  const blob = await put(pathname, buffer, {
    access,
    contentType: contentType || 'application/octet-stream',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  let record = null;
  if (isDatabaseEnabled()) {
    record = await insertBlobRecord({
      pathname: blob.pathname || pathname,
      url: blob.url,
      contentType: contentType || null,
      sizeBytes: buffer.length,
      access,
      uploadedBy,
      entityType,
      entityId,
    });
  }

  return {
    id: record?.id || null,
    url: blob.url,
    pathname: blob.pathname || pathname,
    access,
    storedInDatabase: Boolean(record),
  };
}

export async function deleteBlobByUrl(url) {
  if (!isBlobStorageEnabled() || !url) {
    return;
  }

  await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
}

/**
 * Stream a blob from Vercel Blob storage to an Express response.
 * Required for private blobs, which cannot be served directly by URL.
 */
export async function streamBlobToResponse(res, pathnameOrUrl, access) {
  if (!isBlobStorageEnabled()) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');
  }

  const result = await get(pathnameOrUrl, {
    access,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  if (!result || result.statusCode !== 200) {
    return false;
  }

  res.setHeader('Content-Type', result.blob.contentType);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (result.blob.cacheControl) {
    res.setHeader('Cache-Control', result.blob.cacheControl);
  }

  if (result.blob.etag) {
    res.setHeader('ETag', result.blob.etag);
  }

  const nodeStream = Readable.fromWeb(result.stream);

  await new Promise((resolve, reject) => {
    nodeStream.on('error', reject);
    res.on('error', reject);
    nodeStream.pipe(res);
    nodeStream.on('end', resolve);
  });

  return true;
}

export function getStorageStatus() {
  return {
    blob: isBlobStorageEnabled(),
    database: isDatabaseEnabled(),
  };
}
