import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ isLoading }) {
  const { user, isAdmin } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-center">Loading admin portal...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/home" replace state={{ openAuth: 'login' }} />;
  }

  // If they are the admin, allow them through to the nested routes
  return <Outlet />;
}