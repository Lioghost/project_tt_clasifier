import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import LogoutButton from '../logout/LogoutButton';
import { AuthContext } from '../../context/AuthContext';
import logo from "../../assets/img/header-logo.png";
import profile from "../../assets/img/profile.png";
import catalogImg from "../../assets/img/catalog.png";  // Nueva imagen para catálogo
import identifierImg from "../../assets/img/identifier.png";  // Nueva imagen para identificador
import accountImg from "../../assets/img/account.png";  // Nueva imagen para administrar cuenta

const ClientDashboard = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
    
    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen); // Alternar el dropdown con clic
    };

    return (
        <div className="dashboard">
          <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
            <nav className="sidebar-nav">
              <ul>
                <li className="sidebar-header"><img src={logo} alt="GasketGenius" className="header-logo-dashboard" /></li>
                <li><a href="/client/dashboard">Inicio</a></li>
                <li><a href="/client/catalogo">Catálogo</a></li>
                <li><a href="/client/identificador">Identificador</a></li>
                <li><a href="/client/administrar_cuenta">Administrar cuenta</a></li>
              </ul>
            </nav>
          </aside>
    
          <main className={`main-content-dashboard ${isSidebarOpen ? 'sidebar-active' : ''}`}>
            <header className="header-dashboard">
              <div className="hamburger-menu" onClick={toggleSidebar} aria-expanded={isSidebarOpen ? "true" : "false"}>
                <div></div>
                <div></div>
                <div></div>
              </div>
    
              <div className={`profile ${isDropdownOpen ? 'isDropdownOpen' : ''}`} onClick={handleClick}>
                <span>{user?.name || "Nombre del cliente"}</span>
                <img src={profile} alt="Usuario cliente" className="img-profile" />
    
                {isDropdownOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-content">
                        <img src={profile} alt="Usuario cliente" className="img-profile-dropdown" />
                        <div className="profile-dropdown-text">
                          <p className="profile-name">{user?.name || "Nombre del cliente"}</p>
                          <p className="profile-email">{user?.email || "Correo del usuario"}</p>
                        </div>
                      </div>
                      <div className="logout-button">
                        <LogoutButton />
                      </div>
                    </div>
                )}
    
              </div>
            </header>
    
            <section className="welcome-message">
              <h1>¡Bienvenido al panel cliente!</h1>
            </section>
    
            <section className="cards">
              <div className="card">
                <img src={catalogImg} alt="Catálogo" />
                <a href="/client/catalogo">Catálogo</a>
              </div>
              <div className="card">
                <img src={identifierImg} alt="Identificador" />
                <a href="/client/identificador">Identificador</a>
              </div>
              <div className="card">
                <img src={accountImg} alt="Administrar cuenta" />
                <a href="/client/cuenta">Administrar cuenta</a>
              </div>
            </section>
          </main>
        </div>
      );
    };

export default ClientDashboard;