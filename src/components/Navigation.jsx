import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/Auth';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';
import logoImage from '../assets/logo.png';

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
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <div className="welcome-message">
        <p>Bem-vindo, {participante?.email}!</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => navigate('/inscricoes')}>Inscrições</a></li>
          <li><a href="#">Configurações</a></li>
          <li><a href="#" onClick={() => logoutFn()}>Logout</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navigation;
