import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const subscribeEvento = async ({ participanteId, eventoId, token }) => {
  const response = await axios.post(
    'https://localhost:7062/Inscricao',
    {
      eventoId,
      participanteId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const fetchInscricoes = async (token, participanteId) => {
  const response = await axios.get(`https://localhost:7062/Inscricao/${participanteId}/eventos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchInscricoes2 = async (token) => {
  const response = await axios.get(`https://localhost:7062/Inscricao`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


const removeInscricao = async ({ participanteId, eventoId, token }) => {
  const response = await axios.delete(`https://localhost:7062/Inscricao/${participanteId}/evento/${eventoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchInscricaoCount = async () => {
  const response = await axios.get('https://localhost:7062/Inscricao/count');
  return response.data;
}


export const useFetchInscricaoCount = () => {
  return useQuery({
    queryKey: ["inscricaoCount"],
    queryFn: fetchInscricaoCount,
  });
}

export const useSubscribeEventos = (options = {}) => {
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ eventoId, participanteId }) => subscribeEvento({ eventoId, participanteId, token }),
    onSuccess: (data) => {
      console.log("Inscrito no evento!", data);
    },
    onError: (error) => {
      console.error("Erro ao se inscrever no evento!", error);
    },
    ...options,
  });
};

export const useFetchInscricoes = (token, participanteId, options = {}) => {
  return useQuery({
    queryKey: ["inscricoes", participanteId],
    queryFn: () => fetchInscricoes(token, participanteId),
    enabled: !!token,
    retry: 0,
    ...options,
  });
};

export const useFetchInscricoesAdmin = (token, options = {}) => {
  return useQuery({
    queryKey: ["inscricoes"],
    queryFn: (token) => fetchInscricoes2(token),
    ...options,
  })
}

export const useRemoveInscricao = (options = {}) => {
  const queryClient = useQueryClient(); 
  const { token } = useAuth()

  return useMutation({
    mutationFn: ({ eventoId, participanteId }) => removeInscricao({ eventoId, participanteId, token }),
    onMutate: async (data) => {
      await queryClient.cancelQueries(['inscricoes', data.participanteId]);

      const previousInscricoes = queryClient.getQueryData(['inscricoes', data.participanteId]);

      queryClient.setQueryData(['inscricoes', data.participanteId], (old) => {
        return old.filter((inscricao) => inscricao.eventoId !== data.eventoId);
      });

      return { previousInscricoes };
    },
    onError: (error) => {
      console.error("Erro ao cancelar a inscrição!", error);
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries(['inscricoes', variables.participanteId]);
    },
    ...options,
  });
};

const gerarRelatorio = async (eventoId, token) => {
  try {
    const response = await axios.get(`https://localhost:7062/Relatorio/gerar/${eventoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_evento_${eventoId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    Swal.fire('Erro!', 'Não foi possível gerar o relatório.', 'error');
  }
};

export const useGerarRelatorio = () => {
  return {
    gerarRelatorio,
  };
};
