import crypto from 'crypto';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config.js';
import { hashPassword, verifyPassword } from './password.js';

const users = new Map();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    cnic: user.cnic || '',
    phone: user.phone || '',
    profileComplete: Boolean(user.cnic && user.phone),
  };
}

function seedAdminUser() {
  users.set(ADMIN_EMAIL, {
    id: 'admin-1',
    name: 'Admin',
    email: ADMIN_EMAIL,
    passwordHash: hashPassword(ADMIN_PASSWORD),
    role: 'admin',
    cnic: '1234512345671',
    phone: '',
    profileComplete: true,
  });
}

seedAdminUser();

export function authenticate(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return publicUser(user);
}

export function createUser({ cnic, email, phone, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCnic = String(cnic || '').replace(/\D/g, '');
  const normalizedPhone = String(phone || '').replace(/\D/g, '');

  if (users.has(normalizedEmail)) {
    throw new Error('Unable to create account. Please try signing in or use a different email.');
  }

  const user = {
    id: crypto.randomUUID(),
    name: normalizedEmail.split('@')[0] || 'Customer',
    email: normalizedEmail,
    cnic: normalizedCnic,
    phone: normalizedPhone,
    passwordHash: hashPassword(password),
    role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer',
  };

  users.set(normalizedEmail, user);
  return publicUser(user);
}

export function updateUserProfile(userId, { cnic, email, phone, password }) {
  const user = getInternalUserById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  const normalizedCnic = String(cnic || '').replace(/\D/g, '');
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== user.email) {
    if (users.has(normalizedEmail)) {
      throw new Error('That email is already registered.');
    }
    users.delete(user.email);
    user.email = normalizedEmail;
    users.set(normalizedEmail, user);
  }

  user.cnic = normalizedCnic;
  user.phone = normalizedPhone;

  if (password) {
    user.passwordHash = hashPassword(password);
  }

  return publicUser(user);
}

export function getUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) {
      return publicUser(user);
    }
  }

  return null;
}

export function getInternalUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }

  return null;
}

export function listUsers() {
  return Array.from(users.values()).map(publicUser);
}

export function updateUserRole(userId, role, actorId) {
  const user = getInternalUserById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  if (user.email === ADMIN_EMAIL && role === 'customer') {
    throw new Error('The primary admin account cannot be demoted.');
  }

  if (userId === actorId && role === 'customer' && user.role === 'admin') {
    throw new Error('You cannot remove your own admin access.');
  }

  const adminCount = Array.from(users.values()).filter((entry) => entry.role === 'admin').length;
  if (user.role === 'admin' && role === 'customer' && adminCount <= 1) {
    throw new Error('At least one admin account must remain.');
  }

  user.role = role;
  return publicUser(user);
}
