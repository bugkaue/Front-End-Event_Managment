import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchEventos } from '../services/Eventos';
import { useSubscribeEventos } from '../services/Inscricao';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/Auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, participante } = useAuth();
  const { data: eventos, error: erroEventos } = useFetchEventos(token);
  
  const [visibleEvents, setVisibleEvents] = useState(6); // Estado para controlar a quantidade de eventos visíveis

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

  const { mutate: inscreverEvento } = useSubscribeEventos();

  // Função para carregar mais eventos
  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

   return (
    <div>
      <div className="navigation">
        <h1>Dashboard</h1>
        <div>
          <button className="inscricoes-button" onClick={() => navigate('/inscricoes')}>
            Inscrições
          </button>
          <p>Bem-vindo, {participante?.email}!</p>
          <button className="logout-button" onClick={() => logoutFn()}>Logout</button>
        </div>
      </div>

      <div className="eventos-container">
        <h2 className="eventos-titulo">Eventos Disponíveis</h2>
        {eventos?.length > 0 ? (
          <>
            <div className="event-list">
              {eventos.slice(0, visibleEvents).map((evento) => ( // Limita os eventos visíveis
                <div key={evento.id} className="event-item">
                  <h3>{evento.titulo}</h3>
                  <p><strong>Descrição:</strong> {evento.descricao}</p>
                  <p><strong>Data e Hora:</strong> {new Date(evento.dataHora).toLocaleString()}</p>
                  <p><strong>Local:</strong> {evento.local}</p>
                  <p><strong>Capacidade Máxima:</strong> {evento.capacidadeMaxima}</p>

                  {participante?.id && (
                    <button onClick={() => inscreverEvento({
                      eventoId: evento.id,
                      participanteId: participante.id
                    })}>
                      Inscrever-se
                    </button>
                  )}
                </div>
              ))}
            </div>
            {visibleEvents < eventos.length && ( // Verifica se há mais eventos para mostrar
              <button className="load-more-button" onClick={loadMoreEvents}>
                Carregar mais eventos
              </button>
            )}
          </>
        ) : (
          <p>Nenhum evento disponível.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
