// AdminNavigation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import '../styles/AdminNavigation.css';
import logoImage from '../assets/logo.png';
import { useAuthLogout } from '../services/AdminAuth'; 

const AdminNavigation = () => {
  const navigate = useNavigate(); // Hook para navegação
  const { mutate: logoutFn } = useAuthLogout();   
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logoImage} alt="Logo" />
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#" onClick={() => navigate('/admin-dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => navigate('/usuarios')}>Usuários</a></li>
          <li><a href="#" onClick={() => navigate('/gerencia-eventos')}>Gerenciar Eventos</a></li>
          <li><a href="#">Configurações</a></li>
          <li><a href="#" onClick={() => logoutFn()}>Sair</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminNavigation;
