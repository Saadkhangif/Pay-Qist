import crypto from 'crypto';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config.js';

const users = new Map();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function passwordsMatch(input, stored) {
  const inputBuffer = Buffer.from(input);
  const storedBuffer = Buffer.from(stored);

  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}

function seedAdminUser() {
  users.set(ADMIN_EMAIL, {
    id: 'admin-1',
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });
}

seedAdminUser();

export function authenticate(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user || !passwordsMatch(password, user.password)) {
    return null;
  }

  return publicUser(user);
}

export function createUser(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (users.has(normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: normalizedEmail === ADMIN_EMAIL ? 'admin' : 'customer',
  };

  users.set(normalizedEmail, user);
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

export function listUsers() {
  return Array.from(users.values()).map(publicUser);
}

export function updateUserRole(userId, role) {
  for (const user of users.values()) {
    if (user.id === userId) {
      user.role = role;
      return publicUser(user);
    }
  }

  throw new Error('User not found.');
}
