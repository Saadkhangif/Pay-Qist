import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, initApiSecurity } from '../lib/api';
import {
  isNeonAuthConfigured,
  neonGetSession,
  neonSignIn,
  neonSignOut,
  neonSignUp,
} from '../lib/neonAuth';

const AuthContext = createContext(null);

function buildUserProfile(user) {
  return {
    id: user.id,
    name: user.name || 'Customer',
    email: user.email || '',
    role: user.role || 'customer',
    cnic: user.cnic || '',
    phone: user.phone || '',
    avatarPathname: user.avatarPathname || '',
    profileComplete: Boolean(user.profileComplete ?? (user.cnic && user.phone)),
    provider: isNeonAuthConfigured ? 'neon' : 'local',
  };
}

async function fetchAppUser() {
  const payload = await apiFetch('/api/auth/me');
  return buildUserProfile(payload.user);
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

        if (isNeonAuthConfigured) {
          const session = await neonGetSession();
          if (!session?.user) {
            if (!cancelled) setUser(null);
            return;
          }

          const profile = await fetchAppUser().catch(() => null);
          if (!cancelled) {
            setUser(profile);
          }
          return;
        }

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

  async function signup({ cnic, email, phone, password, confirmPassword }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (isNeonAuthConfigured) {
      await neonSignUp({
        email: normalizedEmail,
        password,
        name: normalizedEmail.split('@')[0] || 'Customer',
      });

      const profile = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          cnic: cnic.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          password,
          confirmPassword,
        }),
      });

      const nextProfile = buildUserProfile(profile.user);
      setUser(nextProfile);
      return nextProfile;
    }

    const payload = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        cnic: cnic.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
        confirmPassword,
      }),
    });
    const profile = buildUserProfile(payload.user);
    setUser(profile);
    return profile;
  }

  async function completeProfile({ cnic, email, phone, password, confirmPassword }) {
    const payload = await apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        cnic: cnic.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        confirmPassword,
      }),
    });
    const profile = buildUserProfile(payload.user);
    setUser(profile);
    return profile;
  }

  async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (isNeonAuthConfigured) {
      await neonSignIn({ email: normalizedEmail, password });
      const profile = await fetchAppUser();
      setUser(profile);
      return profile;
    }

    const payload = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });
    const profile = buildUserProfile(payload.user);
    setUser(profile);
    return profile;
  }

  async function logout() {
    if (isNeonAuthConfigured) {
      await neonSignOut().catch(() => {});
    } else {
      await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
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

  function updateAvatarPathname(avatarPathname) {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, avatarPathname: avatarPathname || '' } : currentUser,
    );
  }

  const value = useMemo(
    () => ({
      user,
      users,
      isLoading,
      isAdmin: user?.role === 'admin',
      signup,
      completeProfile,
      login,
      logout,
      updateUserRole,
      removeUserRole,
      updateAvatarPathname,
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
