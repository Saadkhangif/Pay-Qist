import { Readable } from 'node:stream';
import { put, del, get } from '@vercel/blob';
import { isBlobStorageEnabled, getBlobClientOptions } from './blobClient.js';

function sanitizeFilename(name = 'file') {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

function buildPathname({ folder, filename, userId }) {
  const safeName = sanitizeFilename(filename);
  const prefix = folder || 'uploads';
  const owner = userId ? `${userId}/` : '';
  return `${prefix}/${owner}${Date.now()}-${safeName}`;
}

export async function uploadFileToBlob({
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
    throw new Error('Blob storage is not configured. Add Vercel Blob to your project.');
  }

  const pathname = buildPathname({ folder, filename, userId: uploadedBy });
  const blob = await put(pathname, buffer, getBlobClientOptions({
    access,
    contentType: contentType || 'application/octet-stream',
  }));

  return {
    url: blob.url,
    pathname: blob.pathname || pathname,
    access,
  };
}

export async function deleteBlobByUrl(url) {
  if (!isBlobStorageEnabled() || !url) {
    return;
  }

  await del(url, getBlobClientOptions());
}

export async function streamBlobToResponse(res, pathnameOrUrl, access) {
  if (!isBlobStorageEnabled()) {
    throw new Error('Blob storage is not configured.');
  }

  const result = await get(pathnameOrUrl, getBlobClientOptions({
    access,
  }));

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
  };
}
