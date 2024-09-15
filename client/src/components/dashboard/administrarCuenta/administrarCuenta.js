import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarCuenta.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarCuenta = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación para el nombre: mayor a 4 y menor a 20 caracteres
        if (formData.name.length < 4 || formData.name.length > 20) {
            newErrors.name = 'El nombre debe tener entre 4 y 20 caracteres';
        }

        // Validación para los apellidos: mayor a 4 y menor a 20 caracteres
        if (formData.lastName.length < 4 || formData.lastName.length > 20) {
            newErrors.lastName = 'Los apellidos deben tener entre 4 y 20 caracteres';
        }

        // Validar que el nombre de usuario no sea "Usuario" y tenga entre 4 y 20 caracteres válidos
        if (formData.username === "Usuario" || formData.username.length < 4 || formData.username.length > 20) {
            newErrors.username = 'El nombre de usuario debe tener entre 4 y 20 caracteres válidos, y diferente a Usuario';
        }

        // Validación para la contraseña: entre 12 y 25 caracteres
        if (formData.password && (formData.password.length < 12 || formData.password.length > 25)) {
            newErrors.password = 'La contraseña debe tener entre 12 y 25 caracteres';
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (formData.password && !formData.confirmPassword) {
            newErrors.confirmPassword = 'Debe confirmar la contraseña';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            // Aquí podrías hacer una llamada a la API para guardar los cambios
            console.log("Datos guardados:", formData);
            setIsEditing(false); // Después de guardar, vuelve a desactivar la edición
        } else {
            console.log("Errores de validación:", errors);
        }
    };

    return (
        <div className="dashboard">
            <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-header"><img src={logo} alt="GasketGenius" className="header-logo-dashboard" /></li>
                        <li><a href="/admin/dashboard">Inicio</a></li>
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
                        <span>{user?.name || "Nombre del administrador"}</span>
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
                    <h1>Administrar cuenta</h1>

                    <div className='account-management'>
                        <div className="account-details">
                            <div className="account-left">
                                <h2>General</h2>
                                <img src={profile} alt="Perfil del usuario" className="user-avatar" />
                            </div>

                            <div className="account-center">
                                <div className="account-info">
                                    <label>Nombre</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder={formData.name || 'Nombre'} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.name && <p className="error-message-admin-account">{errors.name}</p>}
                                </div>
                                <div className="account-info">
                                    <label>Apellidos</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        placeholder={formData.lastName || 'Apellido'} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                                </div>
                                <div className="account-info">
                                    <label>Usuario</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        placeholder={formData.username || 'Usuario'} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.username && <p className="error-message">{errors.username}</p>}
                                </div>
                                <div className="account-info">
                                    <label>Contraseña</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder={formData.password || '************'} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.password && <p className="error-message">{errors.password}</p>}
                                </div>
                                {isEditing && (
                                    <div className="account-info">
                                        <label>Confirmar Contraseña</label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            placeholder="Confirmar contraseña"
                                            onChange={handleChange} 
                                            disabled={!isEditing}
                                        />
                                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="account-right">
                                <button className="edit-button" onClick={handleEdit} disabled={isEditing}>Editar</button>
                            </div>
                        </div>

                        <button 
                            className={`save-button ${isEditing ? 'active' : ''}`} 
                            onClick={handleSave} 
                            disabled={!isEditing}
                        >
                            Guardar
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdministrarCuenta;

