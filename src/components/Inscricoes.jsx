import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchInscricoes } from '../services/Inscricao';
import { useRemoveInscricao } from '../services/Inscricao'; // Importa o hook para remover inscrição

const Inscricoes = () => {
  const { token, participante } = useAuth();
  const { data: inscricoes, error: erroInscricoes, isLoading } = useFetchInscricoes(token, participante?.id);
  const { mutate: removerInscricao } = useRemoveInscricao(); // Hook para cancelar inscrição

  console.log("Inscrições carregadas: ", inscricoes);

  // Verifica se a requisição está carregando
  if (isLoading) return <p>Carregando inscrições...</p>;

  // Verifica se houve um erro na requisição
  if (erroInscricoes) return <p>Erro ao carregar as inscrições: {erroInscricoes.message}</p>;

  // Garante que 'inscricoes' é um array
  const eventos = Array.isArray(inscricoes) ? inscricoes : [];

  return (
    <div className="inscricoes-container">
      <h2>Eventos em que você está inscrito</h2>

      <div className="eventos-list">
        {eventos?.length > 0 ? (
          eventos?.map((evento, index) => (
            <div key={index} className="event-item">
              <h3>{evento.titulo}</h3>
              <p>{evento.descricao}</p>
              <p>Data e Hora: {new Date(evento.dataHora).toLocaleString()}</p>
              <p>Local: {evento.local}</p>
              <p>Capacidade Máxima: {evento.capacidadeMaxima}</p>
              <p>Evento ID: {evento.eventoId}</p>

              <button onClick={() => removerInscricao({
                eventoId: evento.eventoId, 
                participanteId: participante.id
              })}>
                Cancelar Inscrição
              </button>
            </div>
          ))
        ) : (
          <p>Você ainda não está inscrito em nenhum evento.</p>
        )}
      </div>
    </div>
  );
}

export default Inscricoes;
