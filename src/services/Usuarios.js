import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// Função para buscar usuários com autenticação
const fetchUsuarios = async (token) => {
  const response = await axios.get('https://localhost:7062/Participante', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Retorna os dados dos usuários
};

// Função para buscar contagem de usuários com autenticação
const fetchUserCount = async (token) => {
  const response = await axios.get('https://localhost:7062/Participante/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Função para buscar contagem de eventos com autenticação
const fetchEventosCount = async (token) => {
  const response = await axios.get('https://localhost:7062/Eventos/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Função para buscar contagem de inscrições com autenticação
const fetchInscricaoCount = async (token) => { 
  const response = await axios.get('https://localhost:7062/Inscricao/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Hook para buscar a contagem de usuários
export const useFetchUserCount = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["userCount"],
    queryFn: () => fetchUserCount(token),
    enabled: !!token,
    onError: (error) => {
      console.error("Erro ao buscar contagem de usuários:", error);
    },
  });
};

// Hook para buscar a contagem de eventos
export const useFetchEventosCount = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["eventosCount"],
    queryFn: () => fetchEventosCount(token),
    enabled: !!token,
    onError: (error) => {
      console.error("Erro ao buscar contagem de eventos:", error);
    },
  });
};

// Hook para buscar a contagem de inscrições
export const useFetchInscricaoCount = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["inscricaoCount"],
    queryFn: () => fetchInscricaoCount(token),
    enabled: !!token,
    onError: (error) => {
      console.error("Erro ao buscar contagem de inscrições:", error);
    },
  });
};

// Hook para buscar usuários
export const useFetchUsuarios = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () => fetchUsuarios(token),
    enabled: !!token,
    onError: (error) => {
      console.error("Erro ao buscar usuários:", error);
    },
  });
};
