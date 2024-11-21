import React, { useMemo, useState } from 'react';
import { Users, Calendar, CheckSquare, Flag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchUserCount, useFetchEventosCount } from '../services/Usuarios.js';
import { useFetchInscricaoCount, useFetchInscricoesAdmin } from '../services/Inscricao.js';
import { useFetchFinalizadosCount, useFetchRecentes } from '../services/Eventos.js';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10; // Número de itens por página

const StatCard = ({ icon: Icon, title, value, buttonText, onButtonClick }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-indigo-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
    <hr className="my-4" />
    <button
      className="details-button flex items-center justify-between w-full text-left focus:outline-none"
      onClick={onButtonClick}
    >
      <span>{buttonText}</span>
      <ChevronRight className="w-5 h-5 text-indigo-600 transition-transform duration-200 transform group-hover:translate-x-1" />
    </button>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data: inscricoes } = useFetchInscricoesAdmin(token);
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página atual

  const toggleRecentActivity = () => setIsRecentActivityOpen(!isRecentActivityOpen);

  const chartData = useMemo(() => {
    if (!inscricoes) return { labels: [], datasets: [] };

    const monthCounts = inscricoes.reduce((acc, inscricao) => {
      const month = moment(inscricao.dataInscricao).month();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const labels = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMM'));
    const data = labels.map((label, index) => monthCounts[index] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Inscrições por Mês',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };
  }, [inscricoes]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Atividade Mensal',
      },
    },
  };

  const { data: userCount, isLoading: isUserLoading, error: userError } = useFetchUserCount(token);
  const { data: eventosCount, isLoading: isEventosLoading, error: eventosError } = useFetchEventosCount(token);
  const { data: inscricaoCount, isLoading: isInscricaoLoading, error: inscricaoError } = useFetchInscricaoCount(token);
  const { data: finalizadosCount, isLoading: isFinalizadosLoading, error: finalizadosError } = useFetchFinalizadosCount(token);
  const { data: atividadesRecentes = [], isLoading: isAtividadesLoading, error: atividadesError } = useFetchRecentes(token);

  const stats = [
    {
      icon: Users,
      title: 'Total de Usuários',
      value: userCount,
      buttonText: 'Show details',
      onButtonClick: () => navigate('/usuarios'),
    },
    {
      icon: Calendar,
      title: 'Eventos Disponíveis',
      value: eventosCount,
      buttonText: 'Show details',
      onButtonClick: () => navigate('/gerencia-eventos'),
    },
    {
      icon: CheckSquare,
      title: 'Inscrições',
      value: inscricaoCount,
      buttonText: 'Show details',
      onButtonClick: () => console.log('Details for Inscrições'),
    },
    {
      icon: Flag,
      title: 'Eventos Finalizados',
      value: finalizadosCount,
      buttonText: 'Show details',
      onButtonClick: () => console.log('Details for Eventos Finalizados'),
    },
  ];

  const formatRelativeTime = (dataHora) => moment(dataHora).fromNow();

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return atividadesRecentes.slice(startIndex, endIndex);
  }, [atividadesRecentes, currentPage]);

  const totalPages = Math.ceil(atividadesRecentes.length / ITEMS_PER_PAGE);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
      </div>

      {/* Mensagens de Carregamento */}
      {(isUserLoading || isEventosLoading || isInscricaoLoading || isFinalizadosLoading || isAtividadesLoading) && (
        <p>Carregando contagem...</p>
      )}

      {/* Mensagens de Erro */}
      {(userError || eventosError || inscricaoError || finalizadosError || atividadesError) && (
        <p>Erro ao carregar dados do dashboard</p>
      )}

      {/* Dados do Dashboard */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isUserLoading || isEventosLoading || isInscricaoLoading || isFinalizadosLoading || isAtividadesLoading ? 'hidden' : ''}`}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Gráfico de Atividade Mensal */}
      {!isUserLoading && !isEventosLoading && !isInscricaoLoading && !isFinalizadosLoading && !isAtividadesLoading && (
        <div className="w-full flex justify-center">
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Mensal</h2>
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      )}

      {/* Atividade Recente */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleRecentActivity}>
          <h2 className="text-xl font-bold text-gray-800">Atividade Recente</h2>
          <span className="text-gray-500 text-lg">{isRecentActivityOpen ? '-' : '+'}</span>
        </div>
        {isRecentActivityOpen && (
          <div className="space-y-4 mt-4">
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((atividade, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">{atividade.descricao}</p>
                      <p className="text-sm text-gray-500">{formatRelativeTime(atividade.dataHora)}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">por Admin user</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma atividade recente encontrada.</p>
            )}
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-full ${
                      currentPage === index + 1
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;