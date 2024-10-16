import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchEventos } from '../services/Eventos';
import { useSubscribeEventos } from '../services/Inscricao';
import { useFetchInscricoes } from '../services/Inscricao';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2'; // Importação do SweetAlert2
import Navigation from '../components/Navigation';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { token, participante } = useAuth();
  const { data: eventos } = useFetchEventos(token);
  const { data: inscricoes, refetch: refetchInscricoes } = useFetchInscricoes(token, participante?.id); // Mantém a função refetch para atualizações
  const [localInscricoes, setLocalInscricoes] = useState([]);

  const [visibleEvents, setVisibleEvents] = useState(6);
  const { mutate: inscreverEvento } = useSubscribeEventos({
    onSuccess: (newInscricao) => {
      // Atualiza as inscrições localmente para refletir a mudança imediata
      setLocalInscricoes((prevInscricoes) => [...prevInscricoes, newInscricao]);
    },
  });

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  // Combina as inscrições locais e do servidor para verificar se o usuário já está inscrito
  const inscricoesCombinadas = [...(inscricoes || []), ...localInscricoes];

  const isInscrito = (eventoId) => {
    return inscricoesCombinadas.some((inscricao) => inscricao.eventoId === eventoId);
  };

  const handleInscrever = (eventoId) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Deseja se inscrever neste evento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, inscrever!',
      cancelButtonText: 'Não, voltar!',
      customClass: {
        popup: 'custom-modal', // Adiciona a classe personalizada ao modal
      },
    }).then((result) => {
      if (result.isConfirmed) {
        inscreverEvento({
          eventoId: eventoId,
          participanteId: participante.id,
        });
        Swal.fire(
          'Inscrito!',
          'Você se inscreveu no evento com sucesso.',
          'success',
          {
            customClass: {
              popup: 'custom-modal', // Também pode aplicar ao modal de sucesso
            },
          }
        );
      }
    });
  };

  return (
    <div>
      <Navigation />
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
                    <button
                      onClick={() => handleInscrever(evento.id)} // Chama a função de confirmação ao clicar
                      disabled={isInscrito(evento.id)} // Desabilita o botão se o usuário já estiver inscrito
                      className={isInscrito(evento.id) ? 'inscrito-button' : 'inscricao-button'} // Use a classe correta
                    >
                      {isInscrito(evento.id) ? 'Inscrito' : 'Inscrever-se'}
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
