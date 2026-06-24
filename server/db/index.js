import { isBlobStorageEnabled } from '../storage/blobClient.js';

export { isBlobStorageEnabled };

export function isDatabaseEnabled() {
  return false;
}

export function getSql() {
  throw new Error('Database is not configured.');
}
