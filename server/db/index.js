import { neon } from '@neondatabase/serverless';

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function isDatabaseEnabled() {
  return Boolean(resolveDatabaseUrl());
}

export function isBlobStorageEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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
