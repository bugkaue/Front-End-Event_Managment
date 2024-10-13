// src/components/SignUp.js
import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { useRegisterUser } from "../services/Auth";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const {mutate: register} = useRegisterUser()

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Validações
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

        // Resetar a mensagem de erro se todas as validações passarem
        setErrorMessage("");

        register({nome, sobrenome, email, password, confirmPassword});

    };
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
                            <input
                                type="text"
                                placeholder="First Name"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={sobrenome}
                                onChange={(e) => setSobrenome(e.target.value)}
                                required
                            />
                            <input
                                type="email"
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
                                    <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                                ) : (
                                    <FaEye onClick={() => setShowPassword(!showPassword)} />
                                )}
                            </div>
                            <div className="pass-input-div">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {showConfirmPassword ? (
                                    <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                ) : (
                                    <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                )}
                            </div>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div className="login-center-buttons">
                                <button type="submit">Sign Up</button>
                                <button type="button">
                                    <img src={GoogleSvg} alt="Google" />
                                    Sign Up with Google
                                </button>
                            </div>
                        </form>
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
