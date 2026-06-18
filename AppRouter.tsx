import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import { Role } from '../types/auth';
import { Dashboard } from '../pages/Dashboard';

// Placeholder components for routing demonstration
const Login = () => <div className="p-10 text-center text-xl font-bold">Login Page</div>;
const Unauthorized = () => <div className="p-10 text-center text-red-500 font-bold">403 - Unauthorized Access</div>;
const UsersPage = () => <div className="p-4 font-semibold">Users Management Module</div>;
const ProductsPage = () => <div className="p-4 font-semibold">Products Management Module</div>;
const SettingsPage = () => <div className="p-4 font-semibold">Settings Module</div>;

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Accessible by Editors, Managers, Admins, Super Admins */}
          <Route element={<ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.EDITOR]} />}>
             <Route path="/products" element={<ProductsPage />} />
          </Route>
          
          {/* Strictly restricted to Super Admin and Admin */}
          <Route element={<ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};