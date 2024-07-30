import React, { useState } from "react";
import "./login.css";
import motorImage from '../../assets/img/motor-image.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Aquí va la lógica de validación
        if (!email || !password) {
            setErrorMessage('Correo o contraseña incorrectos.');
        } else {
            setErrorMessage('');
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
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit" className="login-button">Iniciar sesión</button>
                    </form>
                    <div className="login-links">
                        <a href="#forgot-password">Olvidé mi contraseña</a>
                        <a href="#register">¿No tienes cuenta?</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
