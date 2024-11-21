import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const roles = localStorage.getItem('roles');
  const isAdmin = roles && roles.includes('Admin'); 

  if (!token || !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return element;
};

export default ProtectedAdminRoute;
