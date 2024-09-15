import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import "./login.css";
import motorImage from '../../assets/img/motor-image.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage('Correo o contraseña incorrectos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            const { role } = data;

            if (response.ok) {
                login(data);
                if (role === 'Client') {
                    navigate('/client/dashboard');
                } else if (role === 'Admin') {
                    navigate('/admin/dashboard');
                }
            } else {
                setErrorMessage(data.msg || 'Error al iniciar sesión.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="login-view">
            <div className="login-content">
                <img src={motorImage} alt="Motor ilustrativo" className="login-image" />
                <div className="login-form">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Correo:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder="Ingresa tu correo aquí"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                placeholder="Ingresa tu contraseña aquí"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <Link to="/forgot-password" className="forgot-password-link">¿Olvidaste tu contraseña?</Link>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" className="login-button">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;