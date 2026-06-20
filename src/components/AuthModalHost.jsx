import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import AuthModal from './AuthModal';

export default function AuthModalHost() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, openAuthModal } = useAuthModal();

  useEffect(() => {
    if (!location.state?.openAuth) return;

    if (location.state.openAuth === 'signup') {
      navigate('/signup', { replace: true, state: null });
      return;
    }

    openAuthModal('login', location.state.returnTo || null);
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate, openAuthModal]);

  if (!isOpen) return null;
  return <AuthModal />;
}
