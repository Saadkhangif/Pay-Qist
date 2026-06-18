import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import AuthModal from './AuthModal';

export default function AuthModalHost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { isOpen, openAuthModal } = useAuthModal();
  const hasAutoOpenedOnLoad = useRef(false);

  useEffect(() => {
    if (!location.state?.openAuth) return;

    openAuthModal(location.state.openAuth, location.state.returnTo || null);
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate, openAuthModal]);

  useEffect(() => {
    if (isLoading || hasAutoOpenedOnLoad.current || user) return;

    openAuthModal('login');
    hasAutoOpenedOnLoad.current = true;
  }, [isLoading, user, openAuthModal]);

  if (isLoading || !isOpen) return null;
  return <AuthModal />;
}
