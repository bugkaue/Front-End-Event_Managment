import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetchInscricoes } from '../services/Inscricao';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Inscricoes = () => {
  const { token, participante } = useAuth();
  const { data: inscricoes, error: erroInscricoes } = useFetchInscricoes(token, participante?.id);

  return (
    <div className="inscricoes-container">
      <h2>Eventos em que você está inscrito</h2>

      <div className="eventos-list">
        {erroInscricoes && <p>Erro ao carregar as inscrições: {erroInscricoes.message}</p>}
        {inscricoes?.length > 0 ? (
          inscricoes.map((evento, index) => (
            <div key={index} className="event-item">
              <h3>{evento.titulo}</h3>
              <p>{evento.descricao}</p>
              <p>Data e Hora: {new Date(evento.dataHora).toLocaleString()}</p>
              <p>Local: {evento.local}</p>
              <p>Capacidade Máxima: {evento.capacidadeMaxima}</p>
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
