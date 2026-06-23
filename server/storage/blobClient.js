export function isBlobStorageEnabled() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );
}

export function getBlobClientOptions(extra = {}) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN, ...extra };
  }

  if (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID) {
    return {
      oidcToken: process.env.VERCEL_OIDC_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
      ...extra,
    };
  }

  return { ...extra };
}
