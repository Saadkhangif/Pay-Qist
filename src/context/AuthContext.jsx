import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, initApiSecurity } from '../lib/api';

const AuthContext = createContext(null);

function buildUserProfile(user) {
  return {
    id: user.id,
    name: user.name || 'Customer',
    email: user.email || '',
    role: user.role || 'customer',
    provider: 'local',
  };
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      try {
        await initApiSecurity();
        const payload = await apiFetch('/api/auth/me').catch(() => null);
        if (!cancelled) {
          setUser(payload?.user ? buildUserProfile(payload.user) : null);
        }
      } catch (error) {
        console.error('Auth bootstrap failed:', error);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    apiFetch('/api/users')
      .then((payload) => setUsers(Array.isArray(payload) ? payload : []))
      .catch(console.error);
  }, [user]);

  async function signup({ name, email, password }) {
    const payload = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
    const profile = buildUserProfile(payload.user);
    setUser(profile);
    return profile;
  }

  async function login({ email, password }) {
    const payload = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });
    const profile = buildUserProfile(payload.user);
    setUser(profile);
    return profile;
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }

  async function updateUserRole(userId, nextRole) {
    const role = nextRole === 'admin' ? 'admin' : 'customer';

    await apiFetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });

    setUsers((currentUsers) =>
      currentUsers.map((candidate) =>
        candidate.id === userId ? { ...candidate, role } : candidate,
      ),
    );

    if (user?.id === userId) {
      setUser((currentUser) => (currentUser ? { ...currentUser, role } : currentUser));
    }
  }

  async function removeUserRole(userId) {
    await updateUserRole(userId, 'customer');
  }

  const value = useMemo(
    () => ({
      user,
      users,
      isLoading,
      isAdmin: user?.role === 'admin',
      signup,
      login,
      logout,
      updateUserRole,
      removeUserRole,
    }),
    [user, users, isLoading],
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
