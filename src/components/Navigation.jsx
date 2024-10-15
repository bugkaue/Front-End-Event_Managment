// components/Navigation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/Auth';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const { participante } = useAuth();

  const { mutate: logoutFn } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("participanteId");
      navigate("/");
    },
    onError: (error) => {
      console.log("Erro ao fazer logout", error);
    }
  });

  return (
    <div className="navigation">
      <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</h1> {/* Faz o título ser clicável */}
      <div>
        <button className="inscricoes-button" onClick={() => navigate('/inscricoes')}>
          Inscrições
        </button>
        <p>Bem-vindo, {participante?.email}!</p>
        <button className="logout-button" onClick={() => logoutFn()}>Logout</button>
      </div>
    </div>
  );
};

export default Navigation;