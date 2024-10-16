import React, { useState } from 'react';
import { useAdminLogin } from '../services/AdminAuth'; // Importa a função de login de admin
import '../styles/adminLogin.css'; // Importa o arquivo de estilo CSS

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: adminLogin } = useAdminLogin();

    const handleAdminLogin = (e) => {
        e.preventDefault();
        adminLogin({ email, password });
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Admin Login</h2>
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
