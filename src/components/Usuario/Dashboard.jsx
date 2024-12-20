import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { useFetchEventos } from '../../services/Eventos';
import { useFetchInscricoes, useSubscribeEventos } from '../../services/Inscricao';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import '../../styles/Admin/AdminNavigation.css';

const isEventoLotado = (numeroInscricoes, capacidadeMaxima) => numeroInscricoes >= capacidadeMaxima;
const isEventoFinalizado = (dataHora) => new Date(dataHora) < new Date();

const Dashboard = () => {
  const { token, participante } = useAuth();
  const { data: eventos } = useFetchEventos(token);
  const { data: inscricoes, refetch: refetchInscricoes } = useFetchInscricoes(token, participante?.id);
  const [localInscricoes, setLocalInscricoes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const inscricoesCombinadas = [...(inscricoes || []), ...localInscricoes];

  const filteredEventos = eventos?.filter((evento) => {
    const matchSearchTerm = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatusFilter = (statusFilter === 'all') ||
      (statusFilter === 'available' && !isEventoFinalizado(evento.dataHora) && !isEventoLotado(evento.numeroInscricoes, evento.capacidadeMaxima)) ||
      (statusFilter === 'finished' && isEventoFinalizado(evento.dataHora)) ||
      (statusFilter === 'full' && isEventoLotado(evento.numeroInscricoes, evento.capacidadeMaxima));
    return matchSearchTerm && matchStatusFilter;
  });

  const isInscrito = (id) => {
    return inscricoesCombinadas.some((inscricao) => inscricao.id === id);
  };

  const { mutate: inscreverEvento } = useSubscribeEventos({
    onSuccess: (newInscricao) => {
      setLocalInscricoes((prevInscricoes) => {
        const updatedInscricoes = [...prevInscricoes, newInscricao];
        localStorage.setItem('inscricoes', JSON.stringify(updatedInscricoes));
        return updatedInscricoes;
      });
      refetchInscricoes();
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

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  useEffect(() => {
    const inscricoesSalvas = JSON.parse(localStorage.getItem('inscricoes')) || [];
    setLocalInscricoes(inscricoesSalvas);
  }, []);

  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8">Eventos Disponíveis</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="mr-4">Filtrar por:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="finished">Encerrados</option>
            <option value="full">Lotados</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEventos?.slice(0, visibleCount).map((evento) => (
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
                  disabled={isInscrito(evento.id) || isEventoFinalizado(evento.dataHora) || isEventoLotado(evento.numeroInscricoes, evento.capacidadeMaxima)}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${isEventoFinalizado(evento.dataHora)
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : isInscrito(evento.id)
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : isEventoLotado(evento.numeroInscricoes, evento.capacidadeMaxima)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  {isEventoFinalizado(evento.dataHora)
                    ? 'Encerrado'
                    : isInscrito(evento.id)
                      ? 'Inscrito'
                      : isEventoLotado(evento.numeroInscricoes, evento.capacidadeMaxima)
                        ? 'Evento Lotado'
                        : 'Inscrever-se'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEventos && filteredEventos.length > visibleCount && (
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