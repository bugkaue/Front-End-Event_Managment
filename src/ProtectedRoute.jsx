import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedAdminRoute;
