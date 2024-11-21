import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const fetchUsuarios = async (token) => {
  const response = await axios.get('https://localhost:7062/Participante', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; 
};

const fetchUserCount = async (token) => {
  const response = await axios.get('https://localhost:7062/Participante/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchEventosCount = async (token) => {
  const response = await axios.get('https://localhost:7062/Eventos/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchInscricaoCount = async (token) => { 
  const response = await axios.get('https://localhost:7062/Inscricao/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

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
