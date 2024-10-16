import React from 'react';
import '../styles/adminDashboard.css';
import logoImage from '../assets/logo.png'; // Corrigindo a importação da imagem

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logoImage} alt="Logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Gerenciar Eventos</a></li>
            <li><a href="#">Usuários</a></li>
            <li><a href="#">Configurações</a></li>
            <li><a href="#">Sair</a></li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <h1>Admin Dashboard</h1>
        <p>Bem-vindo, administrador! Você pode gerenciar eventos e usuários aqui.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
