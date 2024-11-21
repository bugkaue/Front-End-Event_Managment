import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const roles = localStorage.getItem('roles');
  const isAdmin = roles && roles.includes('Admin'); // Verifica se "Admin" está entre os roles

  // Verifica se o usuário tem um token válido e é Admin
  if (!token || !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return element;
};

export default ProtectedAdminRoute;
