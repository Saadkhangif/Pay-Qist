import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, requireProfile = false }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ openAuth: 'login', returnTo: location.pathname }}
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (requireProfile && user.role !== 'admin' && !user.profileComplete) {
    return (
      <Navigate
        to={`/complete-profile?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}
