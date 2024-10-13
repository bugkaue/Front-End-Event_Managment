import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';

const subscribeEvento = async ({
  participanteId,
  eventoId
}) => {
  const response = await axios.post('https://localhost:7062/Inscricao', {
    eventoId,
    participanteId,
  });

  return response.data
};

const fetchInscricoes = async (token, participanteId) => {
  const response = await axios.get(`https://localhost:7062/Inscricao/${participanteId}/eventos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const useSubscribeEventos = (options ={}) => {
  return useMutation({
      mutationFn: ({eventoId, participanteId}) => subscribeEvento({
        eventoId,
        participanteId,
      }),

      onSuccess: (data) => {
          console.log("Inscrito no evento! ", data);
      },
      onError: (error) => {
          console.error("Erro ao se inscrever no evento! ", error);
      },
      ...options
  })
}


export const useFetchInscricoes = (token, participanteId, options ={}) => {
  return useQuery({
      queryKey: ["inscricoes", participanteId],
      queryFn: () => fetchInscricoes(token, participanteId),
      enabled: !!token && !!participanteId,
      ...options
  })
}