// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('jwtToken'); // Verifica se o token está presente

  return token ? element : <Navigate to="/" />; // Se o token existir, renderiza o elemento, caso contrário redireciona
};

export default ProtectedRoute;