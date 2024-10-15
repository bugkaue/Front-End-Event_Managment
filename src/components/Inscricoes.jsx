import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchInscricoes } from '../services/Inscricao';
import { useRemoveInscricao } from '../services/Inscricao';
import Navigation from '../components/Navigation';

const Inscricoes = () => {
  const { token, participante } = useAuth();
  const { data: inscricoes, error, isLoading } = useFetchInscricoes(token, participante?.id);
  const { mutate: removerInscricao } = useRemoveInscricao();

  if (isLoading) return <p>Carregando inscrições...</p>;

  const hasSubscriptions = !!inscricoes?.length && !error;

  return (
    <div>
      <div className="inscricoes-container">
        <h2>Eventos em que você está inscrito</h2>

        <div className="eventos-list">
          {hasSubscriptions ? (
            inscricoes?.map((inscricao, index) => (
              <div key={index} className="event-item">
                <h3>{inscricao.titulo}</h3>
                <p>{inscricao.descricao}</p>
                <p>Data e Hora: {new Date(inscricao.dataHora).toLocaleString()}</p>
                <p>Local: {inscricao.local}</p>
                <p>Capacidade Máxima: {inscricao.capacidadeMaxima}</p>

                <button onClick={() => removerInscricao({
                  eventoId: inscricao.eventoId, 
                  participanteId: participante.id
                })}>
                  Cancelar Inscrição
                </button>
              </div>
            ))
          ) : (
            <p>Você ainda não está inscrito em nenhum inscricoes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inscricoes;
