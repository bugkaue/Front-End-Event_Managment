import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  if (!token && userRole !== '1') {
    return <Navigate to="/admin-login" />;
  }

  return element;
};

export default ProtectedAdminRoute;
