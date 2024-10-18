// services/Usuarios.js
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Função para buscar usuários
const fetchUsuarios = async () => {
  const response = await axios.get('https://localhost:7062/Participante'); // Ajuste a URL conforme necessário
  return response.data; // Retorna os dados dos usuários
};

// função para buscar cont usuarios
const fetchUserCount = async () => {
  const response = await axios.get('https://localhost:7062/Participante/count'); // Ajuste a URL conforme necessário
  return response.data; // Retorna os dados dos usuários
};

const fetchEventosCount = async () => {
  const response = await axios.get('https://localhost:7062/Eventos/count'); // Ajuste a URL conforme necessário
  return response.data;
};

// Hook para buscar a contagem de eventos
export const useFetchEventosCount = () => {
  return useQuery({
    queryKey: ["eventosCount"], // Chave única para a query
    queryFn: fetchEventosCount, // Função para buscar dados
  });
}

// Hook para buscar usuários
export const useFetchUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"], // Chave única para a query
    queryFn: fetchUsuarios, // Função para buscar dados
    // Adicione outras opções aqui, se necessário
  });
};

// hook para buscar a contagem de usuarios 
export const useFetchUserCount = () => {
  return useQuery({
    queryKey: ["userCount"], // Chave única para a query
    queryFn: fetchUserCount, // Função para buscar dados
  });
}
