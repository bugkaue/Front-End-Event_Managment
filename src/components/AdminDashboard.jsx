// AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o hook useNavigate do React Router
import '../styles/adminDashboard.css';
import { useFetchUserCount } from '../services/Usuarios.js';
import { useFetchEventosCount } from '../services/Usuarios.js';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Inicializa o hook useNavigate para navegação
  const { data: userCount, isLoading: isUserLoading, error: userError } = useFetchUserCount();
  const { data: eventosCount, isLoading: isEventosLoading, error: eventosError } = useFetchEventosCount();

  if (isUserLoading || isEventosLoading) return <p>Carregando contagem...</p>;
  if (userError) return <p>Erro ao carregar contagem de usuários: {userError.message}</p>;
  if (eventosError) return <p>Erro ao carregar contagem de eventos: {eventosError.message}</p>;

  return (
    <div className="dashboardAdm-container">
      <main className="content">
        <h1>Dashboard</h1>
        <div className="card-container">
          <div className="card">
            <div className="card-content">
              <FaUser className="user-avatar" /> {/* Ícone de usuário */}
              <h3>Total de Usuários: {userCount}</h3>
            </div>
            <hr className="card-divider" />
            <button 
              className="details-button" 
              onClick={() => navigate('/usuarios')} // Redireciona para a página de usuários
            >
              <span>Show details</span>
              <span className="details-arrow">&#x25B6;</span> {/* Setinha separada */}
            </button>
          </div>
          <div className="card">
            <div className="card-content">
              <FaCalendarAlt className="event-icon" /> {/* Ícone de evento */}
              <h3>Total de Eventos Cadastrados: {eventosCount}</h3>
            </div>
            <hr className="card-divider" />
            <button 
            className="details-button"
            onClick={() => navigate('/gerencia-eventos')} >
              <span>Show details</span>
              <span className="details-arrow">&#x25B6;</span> {/* Setinha separada */}
            </button>
          </div>
          <div className="card">
            <div className="card-content">
              <FaUser className="user-avatar" /> {/* Ícone de usuário */}
              <h3>Card 3</h3>
            </div>
            <hr className="card-divider" />
            <button className="details-button">
              <span>Show details</span>
              <span className="details-arrow">&#x25B6;</span> {/* Setinha separada */}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
