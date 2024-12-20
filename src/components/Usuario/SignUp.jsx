import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/logoRegister.png";
import Logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRegisterUser } from "../../services/Auth";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState(""); 
  const navigate = useNavigate();

  const { mutate: register } = useRegisterUser();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    setErrorMessage(""); 

    register(
      { nome, sobrenome, email, password, confirmPassword },
      {
        onSuccess: (response) => {
          setIsWaitingForConfirmation(true);
          setConfirmationToken(response.token); 
        },
        onError: () => {
          setErrorMessage("Ocorreu um erro ao registrar.");
        },
      }
    );
  };

  useEffect(() => {
    let interval;
    if (isWaitingForConfirmation && confirmationToken) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`/api/Account/confirm-email`, {
            params: { email, token: confirmationToken },
          });
          if (response.status === 200) {
            clearInterval(interval);
            navigate("/"); 
          }
        } catch (error) {
          console.log("Aguardando confirmação...");
        }
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isWaitingForConfirmation, confirmationToken, email, navigate]);

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Illustration" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Create Account</h2>
            <p>Please fill in your details</p>
            <form onSubmit={handleSignUp}>
              <div className="input-container">
                <input
                  type="text"
                  placeholder=" "
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <label>First Name</label>
                <div className="input-line"></div>
              </div>

              <div className="input-container">
                <input
                  type="text"
                  placeholder=" "
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  required
                />
                <label>Last Name</label>
                <div className="input-line"></div>
              </div>

              <div className="input-container">
                <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email</label>
                <div className="input-line"></div>
              </div>

              <div className="input-container pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
                <div className="input-line"></div>
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

              <div className="input-container pass-input-div">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label>Confirm Password</label>
                <div className="input-line"></div>
                {showConfirmPassword ? (
                  <FaEyeSlash
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <FaEye
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="login-center-buttons">
                <button type="submit">Sign Up</button>
              </div>
            </form>

            {isWaitingForConfirmation && (
              <p className="waiting-confirmation-message">
                Esperando Confirmação de E-mail...
              </p>
            )}
          </div>

          <p className="login-bottom-p">
            Already have an account? <a href="#" onClick={() => navigate('/')}>Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;