import { getSql, isDatabaseEnabled } from './index.js';

export async function createComment(comment) {
  if (!isDatabaseEnabled()) {
    throw new Error('Database is not configured.');
  }

  const sql = getSql();
  const rows = await sql`
    INSERT INTO comments (comment)
    VALUES (${comment})
    RETURNING comment
  `;

  return rows[0]?.comment ?? comment;
}

export async function listComments(limit = 20) {
  if (!isDatabaseEnabled()) {
    return [];
  }

  const sql = getSql();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  return sql`
    SELECT comment
    FROM comments
    ORDER BY ctid DESC
    LIMIT ${safeLimit}
  `;
}
