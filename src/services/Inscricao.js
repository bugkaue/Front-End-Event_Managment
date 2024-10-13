import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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