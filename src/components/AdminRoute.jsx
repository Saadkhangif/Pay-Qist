import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute({ currentUser, isLoading }) {
  // Fetch the admin email from Vite's environment variables
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  // Show a loading state while authentication is being resolved
  if (isLoading) {
    return <div className="p-4 text-center">Loading admin portal...</div>;
  }

  // If there's no user, or the user's email doesn't match the admin email,
  // redirect them to the home page.
  if (!currentUser || currentUser.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  // If they are the admin, allow them through to the nested routes
  return <Outlet />;
}