import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireOwner = false, requireApprovedOwner = false }) => {
  const { user, isAuthenticated, isAdmin, isOwner, isApprovedOwner } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/hotels" replace />;
  }

  if (requireOwner && !isOwner()) {
    return <Navigate to="/hotels" replace />;
  }

  if (requireApprovedOwner && !isApprovedOwner()) {
    return <Navigate to="/request-owner-access" replace />;
  }

  return children;
};

export default ProtectedRoute;
