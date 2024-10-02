import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarAutos.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarAutosAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [autos, setAutos] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para agregar auto */
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAutoId, setNewAutoId] = useState('');
    const [newAutoSubmarca, setNewAutoSubmarca] = useState('');
    const [newAutoModelo, setNewAutoModelo] = useState('');
    const [newAutoLitros, setNewAutoLitros] = useState('');
    const [newAutoMarca, setNewAutoMarca] = useState([]);
    const [selectedNewMarcaId, setSelectedNewMarcaId] = useState('');
    const [selectedEditMarcaId, setSelectedEditMarcaId] = useState('');
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState('');

    /* Para eliminar auto */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [autoToDelete, setAutoToDelete] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    /* Para editar auto */
    const [showEditModal, setShowEditModal] = useState(false);
    const [autoToEdit, setAutoToEdit] = useState(null);
    const [editAutoId, setEditAutoId] = useState('');
    const [editAutoSubmarca, setEditAutoSubmarca] = useState('');
    const [editAutoModelo, setEditAutoModelo] = useState('');
    const [editAutoLitros, setEditAutoLitros] = useState('');
    const [editAutoMarca, setEditAutoMarca] = useState([]);
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    /* Para mostrar los autos*/
    const fetchAutos = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/autos', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAutos(data.data);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay autos para mostrar');
        }
    };

    useEffect(() => {
        fetchAutos();
    }, []);

    /* Para eliminar auto */
    const openDeleteModal = (id) => {
        setAutoToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAutoToDelete(null);
    };

    const handleDelete = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!autoToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/autos/${autoToDelete}`, {
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
                setAutos(autos.filter(auto => auto.id_auto !== autoToDelete));
                setAutoToDelete(null);
                fetchAutos(); // Fetch the updated list of autos
            } else {
                setErrorDeleteMessage(data.msj);
            }
        } catch (error) {
            setErrorDeleteMessage('Error deleting brand');
        } finally {
            setShowDeleteModal(false);
            setAutoToDelete(null);
        }
    };

    /* Para agregar auto */
    const openAddModal = () => {
        const fetchMarcasAdd = async () => {
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
                    // Ordenar las marcas alfabéticamente por el campo "marca"
                    const sortedMarcas = data.data.sort((a, b) => a.marca.localeCompare(b.marca));
                    
                    setNewAutoMarca(sortedMarcas); // Guarda las marcas ordenadas en el estado
                } else {
                    setErrorAddMessage(data.msj);
                }
            } catch (error) {
                setErrorAddMessage('Error fetching marcas');
            }
        };
        
        fetchMarcasAdd();
        
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setNewAutoId('');
        setNewAutoSubmarca('');
        setNewAutoModelo('');
        setNewAutoLitros('');
        setNewAutoMarca([]);
        setSelectedNewMarcaId('');
        setShowAddModal(false);
    };

    const handleNewAutoIdChange = (e) => {
        setNewAutoId(e.target.value);
    };
    
    const handleNewAutoSubmarcaChange = (e) => {
        setNewAutoSubmarca(e.target.value);
    };
    
    const handleNewAutoModeloChange = (e) => {
        setNewAutoModelo(e.target.value);
    };
    
    const handleNewAutoLitrosChange = (e) => {
        setNewAutoLitros(e.target.value);
    };

    const handleNewAutoMarcaChange = (e) => {
        setSelectedNewMarcaId(e.target.value)
    };

    const handleAddAuto = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Auto (VARCHAR(30), obligatorio) 
        if (newAutoId.trim() === '' || newAutoId.length > 30) {
            newErrors.newAutoId = 'El Identificador del auto no puede estar vacío ni exceder los 30 caracteres.';
        }
    
        // Validar Marca (VARCHAR(50), obligatorio)
        if (!selectedNewMarcaId) {
            newErrors.selectedNewMarcaId = 'Debe seleccionar una marca.';
        }
    
        // Validar Submarca (VARCHAR(20), obligatorio)
        if (newAutoSubmarca.trim() === '' || newAutoSubmarca.length > 20) {
            newErrors.newAutoSubmarca = 'La submarca no puede estar vacía ni exceder los 20 caracteres.';
        }
    
        // Validar Modelo (VARCHAR(4), obligatorio) 
        if (newAutoModelo.trim() === '' || newAutoModelo.length !== 4 || isNaN(newAutoModelo)) {
            newErrors.newAutoModelo = 'El modelo debe tener exactamente 4 dígitos numéricos.';
        }
    
        // Validar NumeroLitros (FLOAT, obligatorio)
        if (!newAutoLitros || isNaN(newAutoLitros) || newAutoLitros <= 0) {
            newErrors.newAutoLitros = 'El número de litros debe ser un valor numérico mayor que 0.';
        }
    
        // Si hay errores, los mostramos en el div
        if (Object.keys(newErrors).length > 0) {
            setErrorAddMessage(newErrors); // Almacenar los errores en el estado
            return; // Salir si hay errores
        }
    
        // Limpiar los errores y enviar los datos si no hay errores
        setErrorAddMessage({});
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch('http://localhost:3000/admin/autos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_auto: newAutoId,
                    submarca: newAutoSubmarca,
                    modelo: newAutoModelo,
                    litros: newAutoLitros,
                    marca_id: parseInt(selectedNewMarcaId)
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessAddMessage(data.msg);
                fetchAutos(); // Refresca la lista de autos
                closeAddModal();
            } else {
                setErrorAddMessage({ form: data.msg || 'Error al agregar auto.' });
            }
        } catch (error) {
            setErrorAddMessage({ form: 'Error al conectar con el servidor.' });
        }
    };

    /* Para editar la auto */
    const openEditModal = (auto) => {
        const fetchMarcasEdit = async () => {
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
                    // Ordenar las marcas alfabéticamente por el campo "marca"
                    const sortedMarcas = data.data.sort((a, b) => a.marca.localeCompare(b.marca));
                    
                    setEditAutoMarca(sortedMarcas); // Guarda las marcas ordenadas en el estado
                } else {
                    setErrorEditMessage(data.msj);
                }
            } catch (error) {
                setErrorEditMessage('Error fetching marcas');
            }
        };
    
        fetchMarcasEdit();
    
        // Configura los valores del auto a editar
        setAutoToEdit(auto);
        setEditAutoId(auto.id_auto);
        setEditAutoSubmarca(auto.submarca);
        setEditAutoModelo(String(auto.modelo));
        setEditAutoLitros(auto.litros);
        setSelectedEditMarcaId(auto.marca_id);  // Aquí inicializas el ID de la marca
        setShowEditModal(true);
    };
    
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditAutoId('');
        setAutoToEdit(null);
    };

    const handleEditAutoIdChange = (e) => {
        setEditAutoId(e.target.value);
    };
    
    const handleEditAutoSubmarcaChange = (e) => {
        setEditAutoSubmarca(e.target.value);
    };
    
    const handleEditAutoModeloChange = (e) => {
        setEditAutoModelo(e.target.value);
    };
    
    const handleEditAutoLitrosChange = (e) => {
        setEditAutoLitros(e.target.value);
    };

    const handleEditAuto = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Auto (VARCHAR(30), obligatorio) 
        if (editAutoId.trim() === '' || editAutoId.length > 30) {
            newErrors.editAutoId = 'El Identificador del auto no puede estar vacío ni exceder los 30 caracteres.';
        }
    
        // Validar Marca (VARCHAR(50), obligatorio)
        if (!selectedEditMarcaId) {
            newErrors.selectedEditMarcaId = 'Debe seleccionar una marca.';
        }
    
        // Validar Submarca (VARCHAR(20), obligatorio)
        if (editAutoSubmarca.trim() === '' || editAutoSubmarca.length > 20) {
            newErrors.editAutoSubmarca = 'La submarca no puede estar vacía ni exceder los 20 caracteres.';
        }
    
        // Validar Modelo (VARCHAR(4), obligatorio) 
        if (editAutoModelo.trim() === '' || editAutoModelo.length !== 4 || isNaN(editAutoModelo)) {
            newErrors.editAutoModelo = 'El modelo debe tener exactamente 4 dígitos numéricos.';
        }
    
        // Validar NumeroLitros (FLOAT, obligatorio)
        if (!editAutoLitros || isNaN(editAutoLitros) || editAutoLitros <= 0) {
            newErrors.editAutoLitros = 'El número de litros debe ser un valor numérico mayor que 0.';
        }
    
        // Si hay errores, los mostramos en el div
        if (Object.keys(newErrors).length > 0) {
            setErrorEditMessage(newErrors); // Almacenar los errores en el estado
            return; // Salir si hay errores
        }
    
        // Limpiar los errores y enviar los datos si no hay errores
        setErrorEditMessage({});
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/autos/${autoToEdit.id_auto}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_auto: editAutoId,
                    submarca: editAutoSubmarca,
                    modelo: editAutoModelo,
                    litros: editAutoLitros,
                    marca_id: parseInt(selectedEditMarcaId)
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessEditMessage(data.msj);
                setAutos(autos.map(auto => auto.id_auto === autoToEdit.id_auto ? { 
                    ...auto, 
                    id_auto: editAutoId,
                    submarca: editAutoSubmarca,
                    modelo: editAutoModelo,
                    litros: editAutoLitros,
                    marca_id: selectedEditMarcaId } : auto));
                fetchAutos(); // Fetch the updated list of autos
                closeEditModal();
            } else {
                setErrorEditMessage(data.msj);
            }
        } catch (error) {
            setErrorEditMessage('Error editing brand');
        }
    };

    /* Componente de administrar autos */
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
                    <h1>Administrar autos</h1>

                    <div className="auto-management">
                        <div className="auto-header">
                          <h1>Autos</h1>
                          <div className="auto-actions">
                            <input type="text" placeholder="Búsqueda por nombre" className="auto-search-bar" />
                            <button className="add-auto-button" onClick={openAddModal}>Agregar auto</button>
                          </div>
                        </div>

                        {successMessage && <div className="get-success-message-auto">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-auto">{errorMessage}</div>}

                        {successDeleteMessage && <div className="delete-success-message-auto">{successDeleteMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-auto">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successAddMessage && <div className="add-success-message-auto">{successAddMessage}</div>}
                        {Object.keys(errorAddMessage).length > 0 && (
                            <div className="add-error-message-auto">
                                {Object.keys(errorAddMessage).map((key) => (
                                    <span key={key}>{errorAddMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successEditMessage && <div className="edit-success-message-auto">{successEditMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-auto">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}


                        <table className="auto-table">
                          <thead>
                            <tr>
                              <th>Identificador</th>
                              <th>Submarca</th>
                              <th>Modelo</th>
                              <th>Litros</th>
                              <th>Marca</th>
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {autos.map((auto) => (
                                <tr key={auto.id_auto}>
                                  <td>{auto.id_auto}</td>
                                  <td>{auto.submarca}</td>
                                  <td>{auto.modelo}</td>
                                  <td>{auto.litros}</td>
                                  {/* Verificar que auto.marca no sea null o undefined */}
                                  <td>{auto.marca ? auto.marca.marca : 'Sin marca'}</td>
                                  <td className="auto-options-cell">
                                    <button 
                                      className="auto-edit-button"
                                      onClick={() => openEditModal(auto)}
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      className="auto-delete-button" 
                                      onClick={() => openDeleteModal(auto.id_auto)}
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
                        <p>¿Estás seguro de que deseas eliminar "{autos.find(auto => auto.id_auto === autoToDelete)?.id_auto}"?</p>
                        <div className="confirm-delete-modal-actions">
                            <button className="confirm-delete-modal-button cancel" onClick={closeDeleteModal}>Cancelar</button>
                            <button className="confirm-delete-modal-button confirm" onClick={handleDelete}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="add-auto-modal-overlay">
                    <div className="add-auto-modal-content">
                        <h2>Agregar Auto</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador del auto" 
                            value={newAutoId} 
                            onChange={handleNewAutoIdChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Submarca del auto" 
                            value={newAutoSubmarca} 
                            onChange={handleNewAutoSubmarcaChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Modelo del auto" 
                            value={newAutoModelo} 
                            onChange={handleNewAutoModeloChange}
                        />
                        <input 
                            type="float" 
                            placeholder="Litros del auto" 
                            value={newAutoLitros} 
                            onChange={handleNewAutoLitrosChange}
                        />
                        <select
                            value={selectedNewMarcaId}  // Establece el valor del select como el id seleccionado
                            onChange={handleNewAutoMarcaChange}  // Captura el id seleccionado
                        >
                            <option value="">Seleccione una marca</option>  {/* Opción por defecto */}
                            {newAutoMarca.map((marca) => (
                                <option key={marca.id} value={marca.id}>
                                    {marca.marca}
                                </option>
                            ))}
                        </select>

                        <div className="add-auto-modal-actions">
                            <button className="add-auto-modal-button cancel" onClick={closeAddModal}>Cancelar</button>
                            <button className="add-auto-modal-button confirm" onClick={handleAddAuto}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-auto-modal-overlay">
                    <div className="edit-auto-modal-content">
                        <h2>Editar {autoToEdit?.id_auto}</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador del auto" 
                            value={editAutoId} 
                            onChange={handleEditAutoIdChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Submarca del auto" 
                            value={editAutoSubmarca} 
                            onChange={handleEditAutoSubmarcaChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Modelo del auto" 
                            value={editAutoModelo} 
                            onChange={handleEditAutoModeloChange}
                        />
                        <input 
                            type="float" 
                            placeholder="Litros del auto" 
                            value={editAutoLitros} 
                            onChange={handleEditAutoLitrosChange}
                        />
                        <select
                            value={selectedEditMarcaId}  // Establece el valor del select como el id seleccionado
                            onChange={(e) => setSelectedEditMarcaId(e.target.value)}  // Captura el id seleccionado
                        >
                            <option value="">Seleccione una marca</option>  {/* Opción por defecto */}
                            {editAutoMarca.map((marca) => (
                                <option key={marca.id} value={marca.id}>
                                    {marca.marca}
                                </option>
                            ))}
                        </select>
                        <div className="edit-auto-modal-actions">
                            <button className="edit-auto-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                            <button className="edit-auto-modal-button confirm" onClick={handleEditAuto}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarAutosAdmin;