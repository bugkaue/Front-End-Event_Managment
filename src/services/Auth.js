import { useMutation } from '@tanstack/react-query';
import connector from '../lib/axiosConnector';
import { useNavigate } from 'react-router-dom';

const registerUser = async ({
    nome,
    sobrenome,
    email,
    password,
    confirmPassword
}) => {
    const response = await connector.post('/Account/register', {
        nome,
        sobrenome,
        email,
        password,
        confirmPassword
    });
    return response.data;
};

const loginUser = async ({
    email,
    password
}) => {
    const response = await connector.post('/Account/login', {
        email,
        password
    });

    console.log(response.data)
    return response.data;
};

const confirmEmail = async (token, email) => {
    const response = await connector.get(`/Account/confirm-email?token=${token}&email=${email}`);
    return response.data;
};

export const logout = async () => {
    const token = localStorage.getItem('jwtToken');
    const response = await connector.post("/Account/logout", {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}



export const useRegisterUser = (options = {}) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({
            nome,
            sobrenome,
            email,
            password,
            confirmPassword
        }) => registerUser({
            nome,
            sobrenome,
            email,
            password,
            confirmPassword
        }),
        onSuccess: (data) => {
            console.log("Usuário registrado com sucesso", data)
            navigate("/")
        },
        onError: (error) => {
            console.error("Erro ao registrar usuário", error);
        },
        ...options
    })
}

export const useLogin = (options = {}) => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: ({
            email,
            password
        }) => loginUser({
            email, password
        }),
        onSuccess: (data) => {
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem("participanteId", data.participanteId)

            console.log("Login bem-sucedido:", data);

                navigate("/dashboard");
            window.location.reload();  // Recarrega a página
        },
        onError: (error) => {
            console.error("Erro ao fazer o login", error);
        },
        ...options
    })
}