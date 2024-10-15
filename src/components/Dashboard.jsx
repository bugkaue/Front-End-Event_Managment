// Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchEventos } from '../services/Eventos';
import { useSubscribeEventos } from '../services/Inscricao';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation'; // Importa o componente Navigation
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { token, participante } = useAuth();
  const { data: eventos } = useFetchEventos(token);
  
  const [visibleEvents, setVisibleEvents] = useState(6);

  const { mutate: inscreverEvento } = useSubscribeEventos();

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  console.log(participante);
  return (
    <div>
      <div className="eventos-container">
        <h2 className="eventos-titulo">Eventos Disponíveis</h2>
        {eventos?.length > 0 ? (
          <>
            <div className="event-list">
              {eventos.slice(0, visibleEvents).map((evento) => (
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
            {visibleEvents < eventos.length && (
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
};

export default Dashboard;