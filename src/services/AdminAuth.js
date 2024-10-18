import { useMutation } from '@tanstack/react-query';
import connector from '../lib/axiosConnector';
import { useNavigate } from 'react-router-dom';

const loginAdmin = async ({ email, password }) => {
    const response = await connector.post('/Account/login', {
        email,
        password
    });

    console.log(response.data);
    return response.data;
};

const logoutAdmin = async () => {
    const response = await connector.post("/Account/logout");
    return response.data;
};

export const useAuthLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            // Remove os dados do localStorage
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('participanteId');
            
            // Redireciona para a página de login
            navigate('/admin-login');
            console.log("Logout realizado com sucesso.");
        },
        onError: (error) => {
            console.error("Erro ao fazer logout:", error);
        }
    });
};

export const useAdminLogin = (options = {}) => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ email, password }) => loginAdmin({ email, password }),
        onSuccess: (data) => {
            // Armazena o token JWT no localStorage
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('roles', JSON.stringify(data.roles)); // Armazena as roles do usuário

            console.log("Login de Administrador bem-sucedido:", data);

            // Verifica se a role do usuário é "Admin" e redireciona para a página do AdminDashboard
            if (data.roles.includes('Admin')) {
                navigate('/admin-dashboard');
            } else {
                console.error("Usuário não possui permissões de administrador");
            }

            window.location.reload(); // Recarrega a página
        },
        onError: (error) => {
            console.error("Erro ao fazer o login do administrador", error);
        },
        ...options
    });
};
