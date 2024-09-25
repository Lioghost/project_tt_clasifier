import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
          <header className="header-dashboard">
              <div className="hamburger-menu" onClick={toggleSidebar} aria-expanded={isSidebarOpen ? "true" : "false"}>
                <div></div>
                <div></div>
                <div></div>
              </div>
    
              <div className={`profile ${isDropdownOpen ? 'isDropdownOpen' : ''}`} onClick={handleClick}>
                <span>{user?.username || "Nombre de usuario del cliente"}</span>
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

          <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
            <nav className="sidebar-nav">
              <ul>
                <li className="sidebar-header"><img src={logo} alt="GasketGenius" className="header-logo-dashboard" /></li>
                <li><NavLink to="/client/dashboard">Inicio</NavLink></li> 
                <li><NavLink to="/client/catalogo">Catálogo</NavLink></li>
                <li><NavLink to="/client/identificador">Identificador</NavLink></li>
                <li><NavLink to="/client/cuenta">Administrar cuenta</NavLink></li>
              </ul>
            </nav>
          </aside>
    
          <main className={`main-content-dashboard ${isSidebarOpen ? 'sidebar-active' : ''}`}>
            <section className="welcome-message">
              <h1>¡Bienvenido al panel cliente!</h1>
            </section>
    
            <section className="cards">
              <NavLink className="card" to="/client/catalogo">
                <img src={catalogImg} alt="Catálogo" />
                <span>Catálogo</span>
              </NavLink>
              <NavLink className="card" to="/client/identificador">
                <img src={identifierImg} alt="Identificador" />
                <span>Identificador</span>
              </NavLink>
              <NavLink className="card" to="/client/cuenta">
                <img src={accountImg} alt="Administrar cuenta" />
                <span >Administrar cuenta</span>
              </NavLink>
            </section>
          </main>
        </div>
      );
    };

export default ClientDashboard;