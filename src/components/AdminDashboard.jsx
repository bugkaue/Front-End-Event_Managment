import React from 'react';
import { Users, Calendar, CheckSquare, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchUserCount } from '../services/Usuarios.js';
import { useFetchEventosCount } from '../services/Usuarios.js';
import { useFetchInscricaoCount } from '../services/Inscricao.js';
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
    <button className="details-button" onClick={onButtonClick}>
      <span>{buttonText}</span>
      <span className="details-arrow">&#x25B6;</span>
    </button>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const { data: userCount, isLoading: isUserLoading, error: userError } = useFetchUserCount(token);
  const { data: eventosCount, isLoading: isEventosLoading, error: eventosError } = useFetchEventosCount(token);
  const { data: inscricaoCount, isLoading: isInscricaoLoading, error: inscricaoError } = useFetchInscricaoCount(token);
  const { data: finalizadosCount, isLoading: isFinalizadosLoading, error: finalizadosError } = useFetchFinalizadosCount(token);
  const { data: atividadesRecentes = [], isLoading: isAtividadesLoading, error: atividadesError } = useFetchRecentes(token);

  if (isUserLoading || isEventosLoading || isInscricaoLoading || isFinalizadosLoading || isAtividadesLoading) 
    return <p>Carregando contagem...</p>;

  if (userError || eventosError || inscricaoError || finalizadosError || atividadesError)
    return <p>Erro ao carregar dados do dashboard</p>;

  const stats = [
    { 
      icon: Users, 
      title: 'Total de Usuários', 
      value: userCount,
      buttonText: 'Show details',
      onButtonClick: () => navigate('/usuarios')
    },
    { 
      icon: Calendar, 
      title: 'Eventos Disponíveis', 
      value: eventosCount,
      buttonText: 'Show details',
      onButtonClick: () => navigate('/gerencia-eventos')
    },
    { 
      icon: CheckSquare, 
      title: 'Inscrições', 
      value: inscricaoCount,
      buttonText: 'Show details',
      onButtonClick: () => console.log('Details for Inscrições')
    },
    { 
      icon: Flag, 
      title: 'Eventos Finalizados', 
      value: finalizadosCount,
      buttonText: 'Show details',
      onButtonClick: () => console.log('Details for Eventos Finalizados')
    },
  ];

  const formatRelativeTime = (dataHora) => moment(dataHora).fromNow();

  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Inscrições',
        data: [65, 59, 80, 81, 56, 55], 
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
      {
        label: 'Eventos',
        data: [28, 48, 40, 19, 86, 27], 
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.4,
      },
    ],
  };

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Mensal</h2>
        <Line options={chartOptions} data={chartData} />
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {atividadesRecentes.length > 0 ? (
            atividadesRecentes
              .slice()
              .reverse()
              .map((atividade, index) => (
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
                  <span className="text-sm text-gray-500">por {atividade.usuarioId}</span>
                </div>
              ))
          ) : (
            <p className="text-gray-500">Nenhuma atividade recente encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;