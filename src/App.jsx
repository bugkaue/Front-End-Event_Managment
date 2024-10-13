// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext.jsx"; // Importando o AuthProvider
import ProtectedRoute from "./ProtectedRoute"; // Importando o ProtectedRoute
import Inscricoes from "./components/Inscricoes.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />, // Usando o ProtectedRoute importado
    },
    {
        path: "/inscricoes",
        element: <ProtectedRoute element={<Inscricoes />} />, // Usando o ProtectedRoute importado
    },
]);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
                <ReactQueryDevtools position="bottom-right" />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
