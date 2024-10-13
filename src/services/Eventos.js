import { useQuery } from "@tanstack/react-query"

import axios from "axios"

const fetchEventos = async (token) => {
    const response = await axios.get("https://localhost:7062/Eventos", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
    })

    return response.data
}

export const useFetchEventos = (token, options ={}) => {
    return useQuery({
        queryKey: ["eventos", token],
        queryFn: () => fetchEventos(token),
        enabled: !!token,
        ...options
    })
}