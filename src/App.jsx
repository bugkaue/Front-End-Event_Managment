import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Usuarios from "./components/AdminUsuarios.jsx";
import GerenciarEventos from "./components/AdminEventos.jsx"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "../src/ProtectedRoute.jsx";
import ProtectedAdminRoute from "../src/ProtectedAdminRoute.jsx";
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
        element: <AdminLogin />, 
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
        path: "/",  // Adicione um caminho comum para rotas do admin
        element: <LayoutAdmin />,
        children: [
            {
                path: "admin-dashboard",
                element: <ProtectedAdminRoute roles={['Admin']} element={<AdminDashboard />} />,
            },
            {
                path: "usuarios", 
                element: <ProtectedAdminRoute roles={['Admin']} element={<Usuarios />} />, 
            },
            {
                path: "gerencia-eventos",  
                element: <ProtectedAdminRoute roles={['Admin']} element={<GerenciarEventos />} />,
            }
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