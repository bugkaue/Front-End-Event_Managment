// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Usuarios from "./components/Usuarios"; // Importe o novo componente de Usuários
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "../src/ProtectedRoute.jsx";
import ProtectedAdminRout from "../src/ProtectedAdminRoute.jsx";
import Inscricoes from "./components/Inscricoes.jsx";
import Layout from "./Layout.jsx";
import LayoutAdmin from "./LayoutAdm.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/admin-login",
        element: <AdminLogin />, // Página de login para administradores
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "dashboard",
                element: <ProtectedRoute roles={['User']} element={<Dashboard />} />,
            },
            {
                path: "inscricoes",
                element: <ProtectedRoute roles={['User']} element={<Inscricoes />} />,
            },
        ],
    },
    {
        path: "/",
        element: <LayoutAdmin />,
        children: [
            {
                path: "/admin-dashboard",
                element: <ProtectedAdminRout roles={['Admin']} element={<AdminDashboard />} />,
            },
            {
                path: "/usuarios", // Nova rota para a página de usuários
                element: <ProtectedAdminRout roles={['Admin']} element={<Usuarios />} />, // Protegendo a rota para administradores
            },
        ],
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
