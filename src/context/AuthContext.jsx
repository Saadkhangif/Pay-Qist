import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hasFirebaseConfig, loadFirebaseAuthTools, loadFirebaseStoreTools } from '../lib/firebase';
import { readStorage, writeStorage } from '../lib/storage';

const AuthContext = createContext(null);
const USERS_KEY = 'payqist_users';
const AUTH_KEY = 'payqist_auth_user';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generates an initial mock admin user when running the app in local demo mode.
 */
function getInitialUsers(adminEmail) {
  return [
    {
      id: 'admin-1',
      name: 'Pay Qist Admin',
      email: 'admin@payqist.com',
      password: 'admin123',
      role: 'admin',
      provider: 'local',
    },
  ];
}

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
async function requestJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to complete verification request.');
  }

  return payload;
}

export function AuthProvider({ children }) {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@payqist.com';
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, null) || getInitialUsers(adminEmail));
  const [user, setUser] = useState(() => readStorage(AUTH_KEY, null));

  // Sync the users list to local storage when running in local demo mode (no Firebase)
  useEffect(() => {
    if (!hasFirebaseConfig) {
      writeStorage(USERS_KEY, users);
    }
  }, [users]);

  // Sync the currently authenticated user to local storage in local demo mode
  useEffect(() => {
    if (!hasFirebaseConfig) {
      writeStorage(AUTH_KEY, user);
    }
  }, [user]);

  // Initialize and handle Firebase authentication state and real-time database listeners
  useEffect(() => {
    if (!hasFirebaseConfig) {
      return undefined;
    }

    let unsubscribeAuth = () => undefined;
    let unsubscribeUsers = () => undefined;
    let unsubscribeProfile = () => undefined;
    let mounted = true;

    (async () => {
      const authTools = await loadFirebaseAuthTools();
      const storeTools = await loadFirebaseStoreTools();

      if (!mounted || !authTools || !storeTools) {
        return;
      }

      await authTools.setPersistence(authTools.auth, authTools.browserLocalPersistence).catch(() => undefined);

      // Listen for changes in the user's authentication state
      unsubscribeAuth = authTools.onAuthStateChanged(authTools.auth, (firebaseUser) => {
        unsubscribeProfile();

        if (!firebaseUser) {
          setUser(null);
          return;
        }

        const userRef = authTools.doc(storeTools.db, 'users', firebaseUser.uid);

        // Listen for real-time changes to the authenticated user's profile document
        unsubscribeProfile = authTools.onSnapshot(userRef, (snapshot) => {
          const profileData = snapshot.exists() ? snapshot.data() : {};
          const profile = normalizeUserRecord(
            {
              ...firebaseUser,
              role: profileData.role,
              provider: profileData.provider || firebaseUser.providerData?.[0]?.providerId,
            },
            adminEmail,
          );
          setUser(profile);

          authTools.setDoc(
            userRef,
            {
              uid: firebaseUser.uid,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              provider: profile.provider,
              updatedAt: authTools.serverTimestamp(),
            },
            { merge: true },
          );
        });

      });

      // Listen for real-time changes to the entire users collection (for admin view)
      const usersQuery = storeTools.query(storeTools.collection(storeTools.db, 'users'));
      unsubscribeUsers = storeTools.onSnapshot(usersQuery, (snapshot) => {
        const nextUsers = snapshot.docs.map((document) => {
          const data = document.data();
          return {
            id: document.id,
            name: data.name || 'Customer',
            email: data.email,
            role: data.role || (data.email === adminEmail ? 'admin' : 'customer'),
            provider: data.provider || 'local',
          };
        });

        if (nextUsers.length) {
          setUsers(nextUsers);
        }
      });
    })();

    return () => {
      mounted = false;
      unsubscribeProfile();
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, [adminEmail]);

  /**
   * Persists a newly created or updated user record to Firestore.
   */
  async function persistUserRecord(nextRecord) {
    if (!hasFirebaseConfig) {
      return;
    }

    const tools = await loadFirebaseAuthTools();
    const storeTools = await loadFirebaseStoreTools();
    await tools.setDoc(
      tools.doc(storeTools.db, 'users', nextRecord.id),
      {
        uid: nextRecord.id,
        name: nextRecord.name,
        email: nextRecord.email,
        role: nextRecord.role,
        provider: nextRecord.provider,
        updatedAt: tools.serverTimestamp(),
      },
      { merge: true },
    );
  }

  /**
   * Registers a new user account via Firebase Auth or local state.
   */
  async function signup({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      throw new Error('Please fill in all fields.');
    }

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseAuthTools();
      const credential = await tools.createUserWithEmailAndPassword(tools.auth, normalizedEmail, password);
      await tools.updateProfile(credential.user, { displayName: name });
      const profile = buildUserProfile({ ...credential.user, displayName: name }, adminEmail);

      await tools.setDoc(
        tools.doc((await loadFirebaseStoreTools()).db, 'users', credential.user.uid),
        {
          uid: credential.user.uid,
          name,
          email: normalizedEmail,
          role: profile.role,
          provider: 'password',
          createdAt: tools.serverTimestamp(),
          updatedAt: tools.serverTimestamp(),
        },
        { merge: true },
      );

      setUser(profile);
      return profile;
    }

    if (users.some((existingUser) => existingUser.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const nextUser = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      password,
      role: normalizedEmail === adminEmail ? 'admin' : 'customer',
      provider: 'local',
    };

    setUsers((currentUsers) => [...currentUsers, nextUser]);
    setUser(normalizeUserRecord(nextUser, adminEmail));
    return nextUser;
  }

  /**
   * Authenticates an existing user via Firebase Auth or local state.
   */
  async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseAuthTools();
      const credential = await tools.signInWithEmailAndPassword(tools.auth, normalizedEmail, password);
      return buildUserProfile(credential.user, adminEmail);
    }

    const existingUser = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === password);

    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    const profile = normalizeUserRecord(existingUser, adminEmail);
    setUser(profile);
    return profile;
  }

  /**
   * Handles Google Single Sign-On using a popup window.
   */
  async function signInWithGoogle() {
    if (hasFirebaseConfig) {
      const tools = await loadFirebaseAuthTools();
      const provider = tools.getGoogleProvider();
      const credential = await tools.signInWithPopup(tools.auth, provider);
      return buildUserProfile(credential.user, adminEmail);
    }

    const googleEmail = 'google.user@payqist.com';
    let googleUser = users.find((candidate) => candidate.email === googleEmail);

    if (!googleUser) {
      googleUser = {
        id: crypto.randomUUID(),
        name: 'Google User',
        email: googleEmail,
        password: '',
        role: 'customer',
        provider: 'google',
      };
      setUsers((currentUsers) => [...currentUsers, googleUser]);
    }

    const profile = normalizeUserRecord(googleUser, adminEmail);
    setUser(profile);
    return profile;
  }

  /**
   * Logs out the current user and clears the session.
   */
  async function logout() {
    if (hasFirebaseConfig) {
      const tools = await loadFirebaseAuthTools();
      await tools.signOut(tools.auth);
      return;
    }

    setUser(null);
  }

  /**
   * Sends a password reset email using Firebase Auth.
   */
  async function resetPassword(email) {
    if (!hasFirebaseConfig) {
      return;
    }

    const tools = await loadFirebaseAuthTools();
    await tools.sendPasswordResetEmail(tools.auth, email.trim().toLowerCase());
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

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseAuthTools();
      const storeTools = await loadFirebaseStoreTools();
      await tools.setDoc(
        tools.doc(storeTools.db, 'users', userId),
        { role, updatedAt: tools.serverTimestamp() },
        { merge: true },
      );

      if (user?.id === userId) {
        setUser((currentUser) => (currentUser ? { ...currentUser, role } : currentUser));
      }

      return;
    }

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
      authMode: hasFirebaseConfig ? 'firebase' : 'local',
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