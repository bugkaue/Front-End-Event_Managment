import React, { useState } from 'react';
import { useAdminLogin } from '../../services/AdminAuth';
import '../../styles/Admin/AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const { mutate: adminLogin } = useAdminLogin({
        onError: (error) => {
            setErrorMessage("Erro ao fazer login: Usuário ou senha incorretos ou sem permissões administrativas."); 
        }
    });

    const handleAdminLogin = (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        adminLogin({ email, password }, {
            onSuccess: (data) => {
                if (!data.roles.includes('Admin')) {
                    setErrorMessage('Este perfil não possui permissões de administrador.');
                }
            }
        });
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Admin Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleAdminLogin}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
