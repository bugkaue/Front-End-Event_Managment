import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/image.png";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useLogin } from "../../services/Auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setErrorMessage(""); // Limpa qualquer mensagem de erro anterior

    login({ email, password });
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Background" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <input
                  type="text"
                  id="email"
                  placeholder=" " // Placeholder vazio para que o label funcione
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">E-mail</label>
                <div className="input-line"></div>
              </div>

              <div className="input-container pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" " // Placeholder vazio para que o label funcione
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Senha</label>
                <div className="input-line"></div>

                {/* Ícone de olho para mostrar/ocultar senha */}
                {showPassword ? (
                  <FaEyeSlash
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember-Me</label>
                </div>
                <a
                  href="#"
                  className="forgot-pass-link"
                  onClick={() => navigate('/reset-password')}
                >
                  Forgot password?
                </a>
              </div>

              <div className="login-center-buttons">
                <button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Log In"}
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
