
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchEventos = async (token) => {
    const response = await axios.get("https://localhost:7062/Eventos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

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

const fetchRecentes = async (token) => { 
    const response = await axios.get('https://localhost:7062/Atividades', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const useFetchRecentes = (token) => {
    return useQuery({
        queryKey: ["recentes", token],
        queryFn: () => fetchRecentes(token),
        enabled: !!token, 
    });
};

export const useFetchFinalizadosCount = (token) => {
    return useQuery({
        queryKey: ["finalizadosCount", token],
        queryFn: () => fetchFinalizadosCount(token),
        enabled: !!token, 
    });
};

export const useDeleteEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEvento,
        onSuccess: () => {
            queryClient.invalidateQueries("eventos");
        },
    });
};

export const useUpdateEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEvento,
        onSuccess: () => {
            queryClient.invalidateQueries("eventos"); 
        },
    });
};

export const useFetchEventos = (token, options = {}) => {
    return useQuery({
        queryKey: ["eventos", token],
        queryFn: () => fetchEventos(token),
        enabled: !!token,
        ...options,
    });
};

export const useCreateEvento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvento, 
        onSuccess: () => {
            queryClient.invalidateQueries("eventos"); 
        },
    });
};
