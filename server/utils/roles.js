import { ADMIN_EMAIL } from '../config.js';

export function normalizeRole(role, email) {
  const normalized = String(role || '').toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (email?.toLowerCase() === ADMIN_EMAIL) return 'admin';
  return 'customer';
}

export function userFromRecord(record) {
  const email = record.email || '';
  return {
    id: record.id,
    name: record.name || 'Customer',
    email,
    role: normalizeRole(record.role, email),
  };
}
