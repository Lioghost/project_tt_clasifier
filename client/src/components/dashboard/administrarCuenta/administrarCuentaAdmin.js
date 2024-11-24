import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarCuenta.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarCuentaAdmin = () => {
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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
        if (isEditing) {
            if (validateForm()) {
                setIsSaving(true);
                setSuccessMessage('');
                setErrorMessage('');

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
                        setSuccessMessage('Datos guardados exitosamente');
                        setErrorMessage('');
                        updateUser(formData.id); // Actualizar el contexto después de guardar
                    } else {
                        const data = await response.json();
                        console.log("Errores de validación del servidor:", data);
                        setSuccessMessage('');
                        setErrorMessage('Error al guardar los datos');
                    }
                } catch (error) {
                    console.error('Error al conectar con el servidor:', error);
                    setErrorMessage('Error al conectar con el servidor');
                } finally {
                    setIsSaving(false);
                }
            } else {
                console.log("Errores de validación:", errors);
            }
        } else {
            setIsEditing(true);
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
                                    {errors.name && <p className="error-message-account">{errors.name}</p>}
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
                                    {errors.lastname && <p className="error-message-account">{errors.lastname}</p>}
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
                                    {errors.username && <p className="error-message-account">{errors.username}</p>}
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
                                    {errors.password && <p className="error-message-account">{errors.password}</p>}
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
                                        {errors.confirmPassword && <p className="error-message-account">{errors.confirmPassword}</p>}
                                    </div>
                                )}
                            </form>

                            <button 
                                className={`save-button ${isEditing ? 'active' : ''}`} 
                                onClick={handleSave} 
                                disabled={isSaving}
                            >
                                {isSaving ? 'Guardando...' : isEditing ? 'Guardar' : 'Editar'}
                            </button>

                        </div>

                        {errorMessage && <div className="send-error-message-account">{errorMessage}</div>}
                        {successMessage && <div className="send-success-message-account">{successMessage}</div>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdministrarCuentaAdmin;