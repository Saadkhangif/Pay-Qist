import { getSql, isDatabaseEnabled } from './index.js';

export async function insertBlobRecord({
  pathname,
  url,
  contentType,
  sizeBytes,
  access,
  uploadedBy,
  entityType,
  entityId,
}) {
  if (!isDatabaseEnabled()) {
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    INSERT INTO blobs (
      pathname,
      url,
      content_type,
      size_bytes,
      access,
      uploaded_by,
      entity_type,
      entity_id
    )
    VALUES (
      ${pathname},
      ${url},
      ${contentType || null},
      ${sizeBytes ?? null},
      ${access},
      ${uploadedBy || null},
      ${entityType || null},
      ${entityId || null}
    )
    RETURNING id, pathname, url, content_type, size_bytes, access, uploaded_by, entity_type, entity_id, created_at
  `;

  return rows[0] || null;
}

export async function getBlobById(id) {
  if (!isDatabaseEnabled()) {
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, pathname, url, content_type, size_bytes, access, uploaded_by, entity_type, entity_id, created_at
    FROM blobs
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] || null;
}

export async function getBlobByPathname(pathname) {
  if (!isDatabaseEnabled() || !pathname) {
    return null;
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, pathname, url, content_type, size_bytes, access, uploaded_by, entity_type, entity_id, created_at
    FROM blobs
    WHERE pathname = ${pathname}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return rows[0] || null;
}

export async function listBlobsForEntity(entityType, entityId) {
  if (!isDatabaseEnabled()) {
    return [];
  }

  const sql = getSql();
  return sql`
    SELECT id, pathname, url, content_type, size_bytes, access, uploaded_by, entity_type, entity_id, created_at
    FROM blobs
    WHERE entity_type = ${entityType} AND entity_id = ${entityId}
    ORDER BY created_at DESC
  `;
}
