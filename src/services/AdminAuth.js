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
    const token = localStorage.getItem('jwtToken');
    const response = await connector.post("/Account/logout", {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

export const useAuthLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('participanteId');

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
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('roles', JSON.stringify(data.roles));
            console.log("Login de Administrador bem-sucedido:", data);

            if (data.roles.includes('Admin')) {
                navigate('/admin-dashboard');
            } else {
                console.error("Usuário não possui permissões de administrador");
            }

            window.location.reload();
        },
        onError: (error) => {
            console.error("Erro ao fazer o login do administrador", error);
        },
        ...options
    });
};
