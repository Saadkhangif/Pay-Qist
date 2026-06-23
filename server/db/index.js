import { neon } from '@neondatabase/serverless';
import { isBlobStorageEnabled } from '../storage/blobClient.js';

export { isBlobStorageEnabled };

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function isDatabaseEnabled() {
  return Boolean(resolveDatabaseUrl());
}

let sqlClient = null;

export function getSql() {
  if (!isDatabaseEnabled()) {
    throw new Error('DATABASE_URL is not configured. Add Neon via the Vercel Marketplace.');
  }

  if (!sqlClient) {
    sqlClient = neon(resolveDatabaseUrl());
  }

  return sqlClient;
}
