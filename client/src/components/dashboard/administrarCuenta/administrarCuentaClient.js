import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarCuenta.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarCuentaClient = () => {
    const { isAuthenticated, user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id : user?.id || 0,
        name: user?.name || '',
        lastname: user?.lastname || '',
        username: user?.username || '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        updateUser(user?.id);
    }, [isAuthenticated, navigate, updateUser, user?.id]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

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

        if (formData.name.length < 4 || formData.name.length > 20) {
            newErrors.name = 'El nombre debe tener entre 4 y 20 caracteres';
        }

        if (formData.lastname.length < 4 || formData.lastname.length > 20) {
            newErrors.lastname = 'Los apellidos deben tener entre 4 y 20 caracteres';
        }

        if (formData.username === "Usuario" || formData.username.length < 4 || formData.username.length > 20) {
            newErrors.username = 'El nombre de usuario debe tener entre 4 y 20 caracteres válidos, y diferente a Usuario';
        }

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

    const handleSave = async () => {
        if (validateForm()) {
            setIsSaving(true);
            setMessage('');

            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');

            try {
                const payload = {
                    name: formData.name,
                    lastname: formData.lastname,
                    username: formData.username
                };

                if (formData.password) {
                    payload.password = formData.password;
                }

                const response = await fetch(`http://localhost:3000/shared/cuenta/${formData.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    console.log("Datos guardados:", formData);
                    setIsEditing(false);
                    setMessage('Datos guardados exitosamente');
                } else {
                    const data = await response.json();
                    console.log("Errores de validación del servidor:", data);
                    setMessage('Error al guardar los datos');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                setMessage('Error al conectar con el servidor');
            } finally {
                setIsSaving(false);
            }
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
                        <li><a href="/client/dashboard">Inicio</a></li>
                        <li><a href="/client/catalogo">Catálogo</a></li>
                        <li><a href="/client/identificador">Identificador</a></li>
                        <li><NavLink to="/client/cuenta">Administrar cuenta</NavLink></li>
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

                <section className="welcome-message">
                    <h1>Administrar cuenta</h1>

                    <div className='account-management'>
                        <div className="account-details">
                            <div className="account-left">
                                <h2>General</h2>
                                <img src={profile} alt="Perfil del usuario" className="user-avatar" />
                            </div>

                            <form className="account-center" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div className="account-info">
                                    <label>Nombre</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.name && <p className="error-message-admin-account">{errors.name}</p>}
                                </div>
                                <div className="account-info">
                                    <label>Apellidos</label>
                                    <input 
                                        type="text" 
                                        name="lastname" 
                                        value={formData.lastname} 
                                        onChange={handleChange} 
                                        disabled={!isEditing}
                                    />
                                    {errors.lastname && <p className="error-message">{errors.lastname}</p>}
                                </div>
                                <div className="account-info">
                                    <label>Usuario</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
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
                            </form>

                            <div className="account-right">
                                <button type='button' className="edit-button" onClick={handleEdit} disabled={isEditing}>Editar</button>
                            </div>
                        </div>

                        <button 
                            className={`save-button ${isEditing ? 'active' : ''}`} 
                            onClick={handleSave} 
                            disabled={!isEditing || isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        {message && <p className="error-message">{message}</p>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdministrarCuentaClient;