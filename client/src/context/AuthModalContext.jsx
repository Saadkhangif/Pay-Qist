import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [returnTo, setReturnTo] = useState(null);

  const openAuthModal = useCallback((initialMode = 'login', redirectPath = null) => {
    setMode(initialMode);
    setReturnTo(redirectPath);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    setReturnTo(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      returnTo,
      setMode,
      openAuthModal,
      closeAuthModal,
    }),
    [isOpen, mode, returnTo, openAuthModal, closeAuthModal],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
