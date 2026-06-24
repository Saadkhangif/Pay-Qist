import { ADMIN_EMAIL } from '../config.js';
import { getSql, isDatabaseEnabled } from './index.js';

const memoryProfiles = new Map();

function mapRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name || 'Customer',
    email: row.email,
    role: row.role || 'customer',
    cnic: row.cnic || '',
    phone: row.phone || '',
    avatarPathname: row.avatar_pathname || '',
    profileComplete: Boolean(row.cnic && row.phone),
  };
}

function resolveRole(email) {
  return email.trim().toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer';
}

function mapMemoryProfile(profile) {
  return {
    ...profile,
    profileComplete: Boolean(profile.cnic && profile.phone),
  };
}

export async function getProfileById(id) {
  if (!id) {
    return null;
  }

  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, name, role, cnic, phone, avatar_pathname
      FROM user_profiles
      WHERE id = ${id}
      LIMIT 1
    `;
    return mapRow(rows[0]);
  }

  return mapMemoryProfile(memoryProfiles.get(id) || null);
}

export async function getProfileByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, name, role, cnic, phone, avatar_pathname
      FROM user_profiles
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `;
    return mapRow(rows[0]);
  }

  for (const profile of memoryProfiles.values()) {
    if (profile.email === normalizedEmail) {
      return mapMemoryProfile(profile);
    }
  }

  return null;
}

export async function getOrCreateProfileFromNeon({ id, email, name }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await getProfileById(id);

  if (existing) {
    return existing;
  }

  const profile = {
    id,
    email: normalizedEmail,
    name: name || normalizedEmail.split('@')[0] || 'Customer',
    role: resolveRole(normalizedEmail),
    cnic: '',
    phone: '',
    avatarPathname: '',
  };

  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO user_profiles (id, email, name, role)
      VALUES (${profile.id}, ${profile.email}, ${profile.name}, ${profile.role})
      ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email,
          name = EXCLUDED.name,
          updated_at = NOW()
      RETURNING id, email, name, role, cnic, phone, avatar_pathname
    `;
    return mapRow(rows[0]);
  }

  memoryProfiles.set(id, profile);
  return mapMemoryProfile(profile);
}

export async function upsertProfile(userId, { cnic, email, phone, name, password: _password }) {
  const existing = await getProfileById(userId);

  if (!existing) {
    throw new Error('User not found.');
  }

  const normalizedEmail = (email || existing.email).trim().toLowerCase();
  const normalizedCnic = String(cnic || '').replace(/\D/g, '');
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  const nextName = name || existing.name;

  if (normalizedEmail !== existing.email) {
    const duplicate = await getProfileByEmail(normalizedEmail);
    if (duplicate && duplicate.id !== userId) {
      throw new Error('That email is already registered.');
    }
  }

  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      UPDATE user_profiles
      SET email = ${normalizedEmail},
          name = ${nextName},
          cnic = ${normalizedCnic},
          phone = ${normalizedPhone},
          updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, cnic, phone, avatar_pathname
    `;
    return mapRow(rows[0]);
  }

  const updated = {
    ...existing,
    email: normalizedEmail,
    name: nextName,
    cnic: normalizedCnic,
    phone: normalizedPhone,
  };
  memoryProfiles.set(userId, updated);
  return mapMemoryProfile(updated);
}

export async function updateProfileAvatar(userId, avatarPathname) {
  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      UPDATE user_profiles
      SET avatar_pathname = ${avatarPathname || ''},
          updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, cnic, phone, avatar_pathname
    `;
    return mapRow(rows[0]);
  }

  const existing = memoryProfiles.get(userId);
  if (!existing) {
    throw new Error('User not found.');
  }

  const updated = { ...existing, avatarPathname: avatarPathname || '' };
  memoryProfiles.set(userId, updated);
  return mapMemoryProfile(updated);
}

export async function listProfiles() {
  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      SELECT id, email, name, role, cnic, phone, avatar_pathname
      FROM user_profiles
      ORDER BY created_at DESC
    `;
    return rows.map(mapRow);
  }

  return Array.from(memoryProfiles.values()).map(mapMemoryProfile);
}

export async function updateProfileRole(userId, role, actorId) {
  const user = await getProfileById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  if (user.email === ADMIN_EMAIL && role === 'customer') {
    throw new Error('The primary admin account cannot be demoted.');
  }

  if (userId === actorId && role === 'customer' && user.role === 'admin') {
    throw new Error('You cannot remove your own admin access.');
  }

  const profiles = await listProfiles();
  const adminCount = profiles.filter((entry) => entry.role === 'admin').length;
  if (user.role === 'admin' && role === 'customer' && adminCount <= 1) {
    throw new Error('At least one admin account must remain.');
  }

  if (isDatabaseEnabled()) {
    const sql = getSql();
    const rows = await sql`
      UPDATE user_profiles
      SET role = ${role},
          updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, cnic, phone, avatar_pathname
    `;
    return mapRow(rows[0]);
  }

  const updated = { ...user, role };
  memoryProfiles.set(userId, updated);
  return mapMemoryProfile(updated);
}
