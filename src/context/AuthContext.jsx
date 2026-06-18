import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

const AuthContext = createContext(null);
const USERS_KEY = 'payqist_users';
const AUTH_KEY = 'payqist_auth_user';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Maps a Firebase user object into the standard profile structure used throughout the app.
 */
function buildUserProfile(user, adminEmail) {
  return {
    id: user.uid || user.id,
    name: user.displayName || user.name || 'Customer',
    email: user.email,
    role: user.role || (user.email === adminEmail ? 'admin' : 'customer'),
    provider: user.providerData?.[0]?.providerId || user.provider || 'local',
  };
}

/**
 * Normalizes a local user record to ensure it consistently matches the application's user shape.
 */
function normalizeUserRecord(user, adminEmail) {
  return {
    id: user.uid || user.id,
    name: user.displayName || user.name || 'Customer',
    email: user.email,
    role: user.role || (user.email === adminEmail ? 'admin' : 'customer'),
    provider: user.providerData?.[0]?.providerId || user.provider || 'local',
  };
}

/**
 * Helper function to make JSON POST requests to the backend API.
 *
 * @param {string} path - The API endpoint path.
 * @param {object} body - The request payload.
 * @returns {Promise<object>} The JSON response from the server.
 */
async function requestJson(path, body, method = 'POST') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to complete verification request.');
  }

  return payload;
}

export function AuthProvider({ children }) {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@payqist.com';
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(() => readStorage(AUTH_KEY, null));

  // Fetch users from backend (e.g. for admin dashboard)
  useEffect(() => {
    if (user?.role === 'admin') {
      fetch(`${API_BASE_URL}/api/users`)
        .then(res => res.json())
        .then(setUsers)
        .catch(console.error);
    }
  }, [user]);

  // Sync the currently authenticated user to local storage in local demo mode
  useEffect(() => {
    writeStorage(AUTH_KEY, user);
  }, [user]);

  /**
   * Persists a newly created or updated user record to Firestore.
   */
  async function persistUserRecord(nextRecord) {
    // TODO: Make an API call to MongoDB to update/persist the user record
  }

  /**
   * Registers a new user account via Firebase Auth or local state.
   */
  async function signup({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      throw new Error('Please fill in all fields.');
    }

    const payload = await requestJson('/api/auth/signup', { name, email: normalizedEmail, password });
    setUser(payload.user);
    return payload.user;
  }

  /**
   * Authenticates an existing user via Firebase Auth or local state.
   */
  async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const payload = await requestJson('/api/auth/login', { email: normalizedEmail, password });
    setUser(payload.user);
    return payload.user;
  }

  /**
   * Handles Google Single Sign-On using a popup window.
   */
  async function signInWithGoogle() {
    // Redirect the user to the Node.js OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  /**
   * Logs out the current user and clears the session.
   */
  async function logout() {
    setUser(null);
    await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' }).catch(() => {});
  }

  /**
   * Sends a password reset email using Firebase Auth.
   */
  async function resetPassword(email) {
    // TODO: API call to your backend to trigger a password reset email
  }

  /**
   * Requests a signup verification code from the backend API.
   */
  async function requestSignupVerificationCode(email) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Email is required to send a verification code.');
    }

    return requestJson('/api/verification/request', {
      email: normalizedEmail,
    });
  }

  /**
   * Verifies the given signup verification code against the backend API.
   */
  async function verifySignupVerificationCode(email, code) {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    if (!normalizedEmail || !trimmedCode) {
      throw new Error('Email and verification code are required.');
    }

    return requestJson('/api/verification/verify', {
      email: normalizedEmail,
      code: trimmedCode,
    });
  }

  /**
   * Updates the role of a specific user in Firestore or local state (e.g., promoting to admin).
   */
  async function updateUserRole(userId, nextRole) {
    const role = nextRole || 'customer';

    await requestJson(`/api/users/${userId}/role`, { role }, 'PUT');
    setUsers((currentUsers) =>
      currentUsers.map((candidate) =>
        candidate.id === userId
          ? {
              ...candidate,
              role,
            }
          : candidate,
      ),
    );

    if (user?.id === userId) {
      setUser((currentUser) => (currentUser ? { ...currentUser, role } : currentUser));
    }
  }

  /**
   * Removes any special role from a user, setting them back to a standard customer.
   */
  async function removeUserRole(userId) {
    await updateUserRole(userId, 'customer');
  }

  const value = useMemo(
    () => ({
      user,
      users,
      isAdmin: user?.role === 'admin',
      signup,
      login,
      signInWithGoogle,
      logout,
      resetPassword,
      requestSignupVerificationCode,
      verifySignupVerificationCode,
      updateUserRole,
      removeUserRole,
      authMode: 'node',
    }),
    [user, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}