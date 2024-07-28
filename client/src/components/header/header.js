import React from "react";
import { Link } from 'react-router-dom';
import "./header.css";
import logo from "../../assets/img/header-logo.png"

const Header = () => {
    return(
        <header className="header">
            <div className="header-content">
                <Link to="/">
                    <img src={logo} alt="GasketGenius" className="header-logo"/>
                </Link>
                <div className="header-links">
                    <Link to="/login" className="header-button">Iniciar sesión</Link>
                    <Link to="/register" className="header-button header-button-register">Regístrate</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;