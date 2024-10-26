import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Função para excluir um usuário com base no e-mail
const deleteUsuario = async ({ email, token }) => {
  console.log("Deletando usuário com email:", email, "e token:", token);
  const response = await axios.delete(`https://localhost:7062/api/Account/delete-user/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Hook para excluir um usuário
export const useDeleteUsuario = (options = {}) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ email }) => {
      if (!email) {
        throw new Error("O email é obrigatório para excluir o usuário.");
      }
      return deleteUsuario({ email, token });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries("usuarios");
      const previousUsuarios = queryClient.getQueryData("usuarios");

      if (previousUsuarios) {
        queryClient.setQueryData("usuarios", (old) =>
          old.filter((usuario) => usuario.email !== data.email)
        );
      }
      return { previousUsuarios };
    },
    onError: (error, _, context) => {
      if (context?.previousUsuarios) {
        queryClient.setQueryData("usuarios", context.previousUsuarios);
      }
      console.error("Erro ao excluir o usuário!", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries("usuarios");
    },
    ...options,
  });
};

