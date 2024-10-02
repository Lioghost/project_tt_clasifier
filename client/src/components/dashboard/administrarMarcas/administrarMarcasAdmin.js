import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarMarcas.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarMarcasAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [brands, setBrands] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState(null);
    const [editBrandName, setEditBrandName] = useState(''); // Inicializa con una cadena vacía
    const [successEditMessage, setSuccessEditMessage] = useState('');
    const [errorEditMessage, setErrorEditMessage] = useState('');

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

    useEffect(() => {
        if (successDeleteMessage || errorDeleteMessage) {
            const timer = setTimeout(() => {
                setSuccessDeleteMessage('');
                setErrorDeleteMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successDeleteMessage, errorDeleteMessage]);

    useEffect(() => {
        if (successAddMessage || errorAddMessage) {
            const timer = setTimeout(() => {
                setSuccessAddMessage('');
                setErrorAddMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successAddMessage, errorAddMessage]);

    useEffect(() => {
        if (successEditMessage || errorEditMessage) {
            const timer = setTimeout(() => {
                setSuccessEditMessage('');
                setErrorEditMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successEditMessage, errorEditMessage]);

    /* Para mostrar las marcas*/
    const fetchBrands = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/marcas', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setBrands(data.data);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay marcas para mostrar');
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    /* Para eliminar marca */
    const openDeleteModal = (id) => {
        setBrandToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!brandToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/marcas/${brandToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessDeleteMessage(data.msj);
                setBrands(brands.filter(brand => brand.id !== brandToDelete));
                setBrandToDelete(null);
                fetchBrands(); // Fetch the updated list of brands
            } else {
                setErrorDeleteMessage(data.msj);
            }
        } catch (error) {
            setErrorDeleteMessage('Error deleting brand');
        } finally {
            setShowDeleteModal(false);
            setBrandToDelete(null);
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBrandToDelete(null);
    };

    /* Para agregar marca */
    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setNewBrandName('');
        setShowAddModal(false);
    };

    const handleNewBrandChange = (e) => {
        setNewBrandName(e.target.value);
    };

    const handleAddBrand = async () => {
        if (newBrandName.trim() === '' || newBrandName.length > 50) {
            setErrorAddMessage('El nombre de la marca no puede estar vacío ni tener más de 50 caracteres.');
            return;
        }

        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/marcas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...user,
                    marca: newBrandName
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessAddMessage(data.msg);
                fetchBrands(); // Fetch the updated list of brands
                closeAddModal();
            } else {
                setErrorAddMessage(data.msg);
            }
        } catch (error) {
            setErrorAddMessage('Error adding brand');
        }
    };

    /* Para editar la marca */
    const openEditModal = (brand) => {
        setBrandToEdit(brand);
        setEditBrandName(brand.marca);
        setShowEditModal(true);
    };
    
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditBrandName('');
        setBrandToEdit(null);
    };

    const handleEditBrand = async () => {
        if (editBrandName.trim() === '' || editBrandName.length > 50) {
            setErrorEditMessage('El nombre de la marca no puede estar vacío ni tener más de 50 caracteres.');
            return;
        }
    
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/marcas/${brandToEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    marca: editBrandName
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessEditMessage(data.msj);
                setBrands(brands.map(brand => brand.id === brandToEdit.id ? { ...brand, marca: editBrandName } : brand));
                fetchBrands(); // Fetch the updated list of brands
                closeEditModal();
            } else {
                if (data.msj === "El nombre de la marca ya existe") {
                    setErrorEditMessage("El nombre de la marca ya existe. Por favor, elige un nombre diferente.");
                } else {
                    setErrorEditMessage(data.msj);
                }
            }
        } catch (error) {
            setErrorEditMessage('Error editing brand');
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
                        <li><NavLink to="/admin/dashboard">Inicio</NavLink></li> 
                        <li><NavLink to="/admin/catalogo">Catálogo</NavLink></li>
                        <li><NavLink to="/admin/identificador">Identificador</NavLink></li>
                        <li><NavLink to="/admin/cuenta">Administrar cuenta</NavLink></li>
                        <li><NavLink to="/admin/juntasg">Administrar juntas G</NavLink></li>
                        <li><NavLink to="/admin/juntasm">Administrar juntas M</NavLink></li>
                        <li><NavLink to="/admin/motores">Administrar motores</NavLink></li>
                        <li><NavLink to="/admin/autos">Administrar autos</NavLink></li>
                        <li><NavLink to="/admin/marcas">Administrar marcas</NavLink></li>
                        <li><NavLink to="/admin/usuarios">Administrar usuarios</NavLink></li>
                    </ul>
                </nav>
            </aside>

            <main className={`main-content-dashboard ${isSidebarOpen ? 'sidebar-active' : ''}`}>
                <section className="welcome-message">
                    <h1>Administrar marcas</h1>

                    <div className="brand-management">
                        <div className="brand-header">
                          <h1>Marcas</h1>
                          <div className="brand-actions">
                            <input type="text" placeholder="Búsqueda por nombre" className="brand-search-bar" />
                            <button className="add-brand-button" onClick={openAddModal}>Agregar marca</button>
                          </div>
                        </div>

                        {successMessage && <div className="get-success-message-brand">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-brand">{errorMessage}</div>}

                        {successDeleteMessage && <div className="delete-success-message-brand">{successDeleteMessage}</div>}
                        {errorDeleteMessage && <div className="delete-error-message-brand">{errorDeleteMessage}</div>}

                        {successAddMessage && <div className="add-success-message-brand">{successAddMessage}</div>}
                        {errorAddMessage && <div className="add-error-message-brand">{errorAddMessage}</div>}

                        {successEditMessage && <div className="edit-success-message-brand">{successEditMessage}</div>}
                        {errorEditMessage && <div className="edit-error-message-brand">{errorEditMessage}</div>}

                        <table className="brand-table">
                          <thead>
                            <tr>
                              <th>Marca</th>
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {brands.map((brand) => (
                              <tr key={brand.id}>
                                <td>{brand.marca}</td>
                                <td className="brand-options-cell">
                                  <button 
                                    className="brand-edit-button"
                                    onClick={() => openEditModal(brand)}
                                  >
                                    Editar
                                  </button>
                                  <button 
                                    className="brand-delete-button" 
                                    onClick={() => openDeleteModal(brand.id)}
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    </div>

                </section>
            </main>

            {showDeleteModal && (
                <div className="confirm-delete-modal-overlay">
                    <div className="confirm-delete-modal-content">
                        <h2>Confirmación</h2>
                        <p>¿Estás seguro de que deseas eliminar "{brands.find(brand => brand.id === brandToDelete)?.marca}"?</p>
                        <div className="confirm-delete-modal-actions">
                            <button className="confirm-delete-modal-button cancel" onClick={closeDeleteModal}>Cancelar</button>
                            <button className="confirm-delete-modal-button confirm" onClick={handleDelete}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="add-brand-modal-overlay">
                    <div className="add-brand-modal-content">
                        <h2>Agregar Marca</h2>
                        <input 
                            type="text" 
                            placeholder="Nombre de la marca" 
                            value={newBrandName} 
                            onChange={handleNewBrandChange} 
                        />
                        <div className="add-brand-modal-actions">
                            <button className="add-brand-modal-button cancel" onClick={closeAddModal}>Cancelar</button>
                            <button className="add-brand-modal-button confirm" onClick={handleAddBrand}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-brand-modal-overlay">
                    <div className="edit-brand-modal-content">
                        <h2>Editar {brandToEdit?.marca}</h2>
                        <input 
                            type="text" 
                            placeholder="Nombre de la marca" 
                            value={editBrandName || ''} // Asegúrate de que el valor siempre sea una cadena
                            onChange={(e) => setEditBrandName(e.target.value)} 
                        />
                        <div className="edit-brand-modal-actions">
                            <button className="edit-brand-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                            <button className="edit-brand-modal-button confirm" onClick={handleEditBrand}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarMarcasAdmin;