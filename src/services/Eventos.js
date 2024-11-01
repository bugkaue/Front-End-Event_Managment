
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Função para buscar eventos
const fetchEventos = async (token) => {
    const response = await axios.get("https://localhost:7062/Eventos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Função para criar um novo evento
const createEvento = async ({ token, data }) => {
    const response = await axios.post("https://localhost:7062/Eventos", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const deleteEvento = async ({ token, id }) => {
    const response = await axios.delete(`https://localhost:7062/Eventos/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Função para atualizar um evento
const updateEvento = async ({ token, id, data }) => {
    const response = await axios.put(`https://localhost:7062/Eventos/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};




const fetchFinalizadosCount = async (token) => {
    const response = await axios.get('https://localhost:7062/Eventos/count/finalizados', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// função para fazer atividade recente
const fetchRecentes = async (token) => { 
    const response = await axios.get('https://localhost:7062/Atividades', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// hhook para fazer atividade recente
export const useFetchRecentes = (token) => {
    return useQuery({
        queryKey: ["recentes", token],
        queryFn: () => fetchRecentes(token),
        enabled: !!token, // Garante que a consulta só seja habilitada se o token estiver presente
    });
};

// Hook para buscar eventos finalizados
export const useFetchFinalizadosCount = (token) => {
    return useQuery({
        queryKey: ["finalizadosCount", token],
        queryFn: () => fetchFinalizadosCount(token),
        enabled: !!token, // Garante que a consulta só seja habilitada se o token estiver presente
    });
};


// hook para deletar evento
export const useDeleteEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEvento,
        onSuccess: () => {
            queryClient.invalidateQueries("eventos");
        },
    });
};

// Hook para atualizar eventos
export const useUpdateEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEvento,
        onSuccess: () => {
            queryClient.invalidateQueries("eventos"); // Atualiza a lista de eventos após atualização
        },
    });
};

// Hook para buscar eventos
export const useFetchEventos = (token, options = {}) => {
    return useQuery({
        queryKey: ["eventos", token],
        queryFn: () => fetchEventos(token),
        enabled: !!token,
        ...options,
    });
};

// Hook para criar eventos com `mutationFn` explicitamente definido
export const useCreateEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvento, // Definindo a função de mutação explicitamente
        onSuccess: () => {
            queryClient.invalidateQueries("eventos"); // Atualiza a lista de eventos após criação
        },
    });
};
