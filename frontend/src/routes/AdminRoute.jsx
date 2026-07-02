import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

// Admin-only guard: user must be authenticated AND have role === 'admin'.
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader message="Checking permissions..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
