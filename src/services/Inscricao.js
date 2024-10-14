import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Função para se inscrever em um evento
const subscribeEvento = async ({ participanteId, eventoId }) => {
  const response = await axios.post('https://localhost:7062/Inscricao', {
    eventoId,
    participanteId,
  });
  return response.data;
};

// Função para buscar inscrições
const fetchInscricoes = async (token, participanteId) => {
  const response = await axios.get(`https://localhost:7062/Eventos/participante/${participanteId}/inscricoes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Função para remover inscrição
const removeInscricao = async ({ participanteId, eventoId, token }) => {
  const response = await axios.delete(`https://localhost:7062/Inscricao/${participanteId}/evento/${eventoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; 
};

// Hook para se inscrever em eventos
export const useSubscribeEventos = (options = {}) => {
  return useMutation({
    mutationFn: ({ eventoId, participanteId }) => subscribeEvento({ eventoId, participanteId }),
    onSuccess: (data) => {
      console.log("Inscrito no evento!", data);
    },
    onError: (error) => {
      console.error("Erro ao se inscrever no evento!", error);
    },
    ...options,
  });
};

// Hook para buscar inscrições
export const useFetchInscricoes = (token, participanteId, options = {}) => {
  return useQuery({
    queryKey: ["inscricoes", participanteId],
    queryFn: () => fetchInscricoes(token, participanteId),
    enabled: !!token && !!participanteId,
    ...options,
  });
};

// Hook para remover inscrição
export const useRemoveInscricao = (options = {}) => {
  const queryClient = useQueryClient(); // Obtendo a instância do queryClient

  return useMutation({
    mutationFn: ({ eventoId, participanteId, token }) => removeInscricao({ eventoId, participanteId, token }),
    onSuccess: (data) => {
      console.log("Inscrição cancelada com sucesso!", data);
      queryClient.invalidateQueries(['inscricoes']); // Chamada correta
    },
    onError: (error, { eventoId, participanteId }) => {
      console.log("Valores recebidos:", { eventoId, participanteId });
      console.error("Erro ao cancelar a inscrição!", error);
    },
    ...options,
  });
};
