// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [participante, setParticipante] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            setToken(token)
            setIsAuthenticated(true);
            
        }
    }, []);

    useEffect(() => {
        async function fetchParticipante() {
            const participanteId = localStorage.getItem("participanteId")
            try {
                const response = await axios.get(`https://localhost:7062/Participante/${participanteId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setParticipante(response.data);
            } catch (error) {
                console.error("Error fetching participante data:", error);
            }
        }

        if (token) {
            fetchParticipante()
        }
    }, [token])

    const value = {
        token,
        isAuthenticated,
        participante,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
};