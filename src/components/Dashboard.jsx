import React, { useState } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { useFetchEventos } from '../services/Eventos';
import { useFetchInscricoes, useSubscribeEventos } from '../services/Inscricao';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import '../styles/AdminNavigation.css';

const Dashboard = () => {
  const { token, participante } = useAuth();
  const { data: eventos } = useFetchEventos(token);
  const { data: inscricoes, refetch: refetchInscricoes } = useFetchInscricoes(token, participante?.id);
  const [localInscricoes, setLocalInscricoes] = useState([]); // Estado local para inscrições
  const [visibleCount, setVisibleCount] = useState(6); // Contador de eventos visíveis

  // Combina as inscrições locais e do servidor para verificar se o usuário já está inscrito
  const inscricoesCombinadas = [...(inscricoes || []), ...localInscricoes];

  const isInscrito = (eventoId) => {
    return inscricoesCombinadas.some((inscricao) => inscricao.eventoId === eventoId);
  };

  const { mutate: inscreverEvento } = useSubscribeEventos({
    onSuccess: (newInscricao) => {
      // Atualiza as inscrições localmente para refletir a mudança imediata
      setLocalInscricoes((prevInscricoes) => [...prevInscricoes, newInscricao]);
      refetchInscricoes(); // Refetch para garantir que as inscrições estão atualizadas
    },
  });

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
    }).then((result) => {
      if (result.isConfirmed) {
        inscreverEvento({
          eventoId: eventoId,
          participanteId: participante.id,
        });
        Swal.fire(
          'Inscrito!',
          'Você se inscreveu no evento com sucesso.',
          'success'
        );
      }
    });
  };

  // Manipulador para carregar mais eventos
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="flex"> {/* Use flexbox para alinhar a sidebar e o conteúdo */}
      <main className="flex-1 p-6"> {/* O conteúdo principal */}
        <h1 className="text-3xl font-bold mb-8">Eventos Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos?.slice(0, visibleCount).map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-12">
                <h3 className="text-xl font-semibold mb-2">{evento.titulo}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{evento.local}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(evento.dataHora).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{evento.numeroInscricoes}/{evento.capacidadeMaxima} participantes</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{evento.descricao}</p>
                <button
                  onClick={() => handleInscrever(evento.id)}
                  disabled={isInscrito(evento.id)}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    isInscrito(evento.id)
                      ? 'bg-red-500 text-white cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isInscrito(evento.id) ? 'Inscrito' : 'Inscrever-se'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botão para carregar mais eventos */}
        {eventos && eventos.length > visibleCount && (
          <div className="mt-6 text-center">
            <button 
              onClick={loadMore}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Carregar mais eventos
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
