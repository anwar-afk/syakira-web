import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RoleMiddleware = ({ children, requiredRole }) => {
  const { role, authLoading, isAuthenticated } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Memverifikasi sesi...</p>
      </div>
    );
  }

  // Role hanya dari state hasil validasi /api/auth/me (bukan localStorage)
  if (!isAuthenticated || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleMiddleware;
