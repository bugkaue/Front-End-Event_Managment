import React from 'react';
import { useFetchEventos } from '../services/Eventos'; // Importe o hook
import { useAuth } from '../context/AuthContext'; // Para obter o token de autenticação
import '../styles/AdminEventos.css'; // Estilos para o componente

const Eventos = () => {
    const { token } = useAuth(); // Obtenha o token de autenticação
    const { data: eventos, isLoading, error } = useFetchEventos(token); // Use o hook para buscar eventos

    // Verifique se está carregando ou se houve um erro
    if (isLoading) {
        return <p>Carregando eventos...</p>;
    }

    if (error) {
        return <p>Erro ao carregar eventos: {error.message}</p>;
    }

    return (
        <div className="eventosContainer">
            <h1>Lista de Eventos</h1>
            <div className="eventosLista">
                {eventos && eventos.map((evento) => (
                    <div key={evento.id} className="eventoItem">
                        <h3>{evento.titulo}</h3>
                        <p><strong>Descrição:</strong> {evento.descricao}</p>
                        <p><strong>Data e Hora:</strong> {new Date(evento.dataHora).toLocaleString()}</p>
                        <p><strong>Local:</strong> {evento.local}</p>
                        <p><strong>Capacidade Máxima:</strong> {evento.capacidadeMaxima}</p>
                        <div className="eventoAcoes">
                            <button className="editButton">Editar</button>
                            <button className="deleteButton">Deletar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Eventos;
