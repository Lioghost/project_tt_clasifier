import React from "react";
import "./login.css";
import motorImage from '../../assets/img/motor-image.png';

const Login = () => {
    return(
        <div className="login-view">
            <div className="login-content">
                <img src={motorImage} alt="Motor ilustrativo" className="login-image" />
                <div className="login-form">

                    <form className="form">
                        <div className="form-group">
                            <label htmlFor="email">Correo:</label>
                            <input type="email" id="email" name="email" required placeholder="Ingresa tu correo aquí"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" id="password" name="password" required placeholder="Ingresa tu contraseña aquí"/>
                        </div>
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