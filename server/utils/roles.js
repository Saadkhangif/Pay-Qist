export function normalizeRole(role) {
  const normalized = String(role || '').toLowerCase();
  return normalized === 'admin' ? 'admin' : 'customer';
}

export function userFromRecord(record) {
  const email = record.email || '';
  return {
    id: record.id,
    name: record.name || 'Customer',
    email,
    role: normalizeRole(record.role),
    cnic: record.cnic || '',
    phone: record.phone || '',
    profileComplete: Boolean(record.cnic && record.phone),
  };
}
