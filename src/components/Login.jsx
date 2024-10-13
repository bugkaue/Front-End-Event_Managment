import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useLogin } from "../services/Auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useLogin()

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

    login({ email, password })
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
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Hide password"
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Show password"
                  />
                )}
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
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
                <button type="button">
                  <img src={GoogleSvg} alt="Google logo" />
                  Log In with Google
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
