import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarUsuarios.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarUsuariosAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar y dropdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Estados para mostrar los usuarios
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Mensajes de edición
    const [successEditMessage, setSuccessEditMessage] = useState('');
    const [errorEditMessage, setErrorEditMessage] = useState('');

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Mostrar mensajes de éxito o error
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    // Mostrar mensajes de éxito o error al editar
    useEffect(() => {
        if (successEditMessage || errorEditMessage) {
            const timer = setTimeout(() => {
                setSuccessEditMessage('');
                setErrorEditMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successEditMessage, errorEditMessage]);

    // Funciones para el sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Funciones para el dropdown del perfil de usuario
    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    /* ------- Para mostrar los usuarios */
    const fetchUsers = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/users', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Ordenar los usuarios alfabéticamente por 'lastname'
                const sortedUsers = data.sort((a , b) => a.lastname.localeCompare(b.lastname));
                setUsers(sortedUsers);
                setSuccessMessage("Usuarios recuperados con éxito.")
            } else {
                setErrorMessage("Hubo un error al obtener los usuarios.");
            }
        } catch (error) {
            setErrorMessage('No hay usuarios para mostrar.');
        }
    };

    // Obtener la lista de los usuarios al cargar la página
    useEffect(() => {
        fetchUsers();
    }, []);

    // Función para manejar el cambio del rol del usuario
    const handleRoleChange = async (userId, newRole) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            if (response.ok) {
                setSuccessEditMessage(`Rol de usuario actualizado a ${newRole}.`);
                fetchUsers(); // Refresca la lista de usuarios
            } else {
                setErrorEditMessage('Hubo un error al actualizar el rol.');
            }
        } catch (error) {
            setErrorEditMessage('Error al actualizar el rol del usuario.');
        }
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
                            <div className="logout-button-container">
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
                        <li><NavLink to="/admin/dashboard">Inicio</NavLink></li> 
                        <li><NavLink to="/admin/catalogo">Catálogo</NavLink></li>
                        <li><NavLink to="/admin/identificador">Identificador</NavLink></li>
                        <li><NavLink to="/admin/cuenta">Administrar cuenta</NavLink></li>
                        <li><NavLink to="/admin/juntasg">Administrar GasketGenius</NavLink></li>
                        <li><NavLink to="/admin/motores">Administrar motores</NavLink></li>
                        <li><NavLink to="/admin/autos">Administrar autos</NavLink></li>
                        <li><NavLink to="/admin/marcas">Administrar marcas</NavLink></li>
                        <li><NavLink to="/admin/usuarios">Administrar usuarios</NavLink></li>
                    </ul>
                </nav>
            </aside>

            <main className={`main-content-dashboard ${isSidebarOpen ? 'sidebar-active' : ''}`}>
                <section className="welcome-message">
                    <h1>Administrar usuarios</h1>

                    <div className="entity-management">
                        <div className="entity-header">
                          <h1>Usuarios</h1>
                        </div>

                        {successMessage && <div className="get-success-message-user">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-user">{errorMessage}</div>}

                        {successEditMessage && <div className="edit-success-message-user">{successEditMessage}</div>}
                        {errorEditMessage && <div className="edit-error-message-user">{errorEditMessage}</div>}

                        <table className="entity-table">
                          <thead>
                            <tr>
                              <th>Apellidos</th>
                              <th>Nombres</th>
                              <th>Correo electrónico</th>
                              <th>Rol</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users
                              .filter((u) => u.username !== user.username) // Excluir el usuario actual
                              .map((user) => (
                                <tr key={user.id}>
                                  <td>{user.lastname}</td>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td className="user-options-cell">
                                    <label className="switch-ios">
                                      <input
                                        type="checkbox"
                                        checked={user.role === "Admin"}
                                        onChange={() => handleRoleChange(user.id, user.role === "Admin" ? "Client" : "Admin")}
                                      />
                                      <span className="slider-ios"></span>
                                    </label>
                                    <span>{user.role === "Admin" ? "Admin" : "Cliente"}</span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>

                        </table>

                    </div>

                </section>
            </main>

        </div>
    );
};

export default AdministrarUsuariosAdmin;