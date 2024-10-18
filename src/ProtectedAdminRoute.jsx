import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  // Verifica se o token existe e se o usuário tem a role de "Admin"
  if (!token || userRole !== 'Admin') {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedAdminRoute;
