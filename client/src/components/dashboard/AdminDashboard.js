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
import meetingsImg from "../../assets/img/meetings.png";  // Nueva imagen para administrar juntas
import motorsImg from "../../assets/img/motors.png";  // Nueva imagen para administrar motores
import carsImg from "../../assets/img/cars.png";  // Nueva imagen para administrar autos
import brandsImg from "../../assets/img/brands.png";  // Nueva imagen para administrar marcas

const AdminDashboard = () => {
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
            <li><NavLink to="/admin/dashboard">Inicio</NavLink></li> 
            <li><a href="/admin/catalogo">Catálogo</a></li>
            <li><a href="/admin/identificador">Identificador</a></li>
            <li><NavLink to="/admin/cuenta">Administrar cuenta</NavLink></li>
            <li><a href="/admin/juntas">Administrar juntas</a></li>
            <li><a href="/admin/motores">Administrar motores</a></li>
            <li><a href="/admin/autos">Administrar autos</a></li>
            <li><a href="/admin/marcas">Administrar marcas</a></li>
            <li><a href="/admin/usuarios">Administrar usuarios</a></li>
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
            <span>{user?.username || "Nombre de usuario del administrador"}</span>
            <img src={profile} alt="Usuario administrador" className="img-profile" />

            {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-content">
                    <img src={profile} alt="Usuario administrador" className="img-profile-dropdown" />
                    <div className="profile-dropdown-text">
                      <p className="profile-name">{user?.name || "Nombre del administrador"}</p>
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
          <h1>¡Bienvenido al panel de administración!</h1>
        </section>

        <section className="cards">
          <a className="card" href="/admin/catalogo">
            <img src={catalogImg} alt="Catálogo" />
            <span>Catálogo</span>
          </a>
          <a className="card" href="/admin/identificador">
            <img src={identifierImg} alt="Identificador" />
            <span>Identificador</span>
          </a>
          <NavLink className="card" to="/admin/cuenta">
            <img src={accountImg} alt="Administrar cuenta" />
            <span>Administrar cuenta</span>
          </NavLink>
          <a className="card" href="/admin/juntas">
            <img src={meetingsImg} alt="Administrar juntas" />
            <span>Administrar juntas</span>
          </a>
          <a className="card" href="/admin/motores">
            <img src={motorsImg} alt="Administrar motores" />
            <span>Administrar motores</span>
          </a>
          <a className="card" href="/admin/autos">
            <img src={carsImg} alt="Administrar autos" />
            <span >Administrar autos</span>
          </a>
          <a className="card" href="/admin/marcas">
            <img src={brandsImg} alt="Administrar marcas" />
            <span>Administrar marcas</span>
          </a>
          <a className="card" href="/admin/usuarios">
            <img src={accountImg} alt="Administrar usuarios" />
            <span>Administrar usuarios</span>
          </a>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;