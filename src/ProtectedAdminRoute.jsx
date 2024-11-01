import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Ensure `isAdmin` is stored as a boolean string

  // Check for token and admin status
  if (!token && !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return element;
};

export default ProtectedAdminRoute;
