import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import '../Dashboard.css';
import './administrarJuntasM.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarJuntasMAdmin = () => {
    const { juntagId } = useParams();
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar y dropdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Estados para mostrar las juntas m compatibles
    const [juntasm, setJuntasm] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para eliminar junta g */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [juntamToDelete, setJuntamToDelete] = useState('');
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    /* Para agregar junta g */
    const [showAddModal, setShowAddModal] = useState(false);
    const [newJuntamId, setNewJuntamId] = useState('');
    const [newJuntamMarcaRefac, setNewJuntamMarcaRefac] = useState('');
    const [newJuntamUrlMarca, setNewJuntamUrlMarca] = useState('');
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState('');

    /* Para editar junat g */
    const [showEditModal, setShowEditModal] = useState(false);
    const [juntamToEdit, setJuntamToEdit] = useState('');
    const [editJuntamId, setEditJuntamId] = useState('');
    const [editJuntamMarcaRefac, setEditJuntamMarcaRefac] = useState('');
    const [editJuntamUrlMarca, setEditJuntamUrlMarca] = useState('');
    const [editJuntamJuntag, setEditJuntamJuntag] = useState('');
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

    // Mostrar mensajes de éxito o error al eliminar
    useEffect(() => {
        if (successDeleteMessage || errorDeleteMessage) {
            const timer = setTimeout(() => {
                setSuccessDeleteMessage('');
                setErrorDeleteMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successDeleteMessage, errorDeleteMessage]);

    // Mostrar mensajes de éxito o error al agregar
    useEffect(() => {
        if (successAddMessage || errorAddMessage) {
            const timer = setTimeout(() => {
                setSuccessAddMessage('');
                setErrorAddMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successAddMessage, errorAddMessage]);

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

    /* ------- Para mostrar las Juntas de Cabeza */
    const fetchJuntasm = async (juntagId) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/shared/juntas-ms/${juntagId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Ordenar las juntas g alfabéticamente por 'id_cod_marca
                const sortedJuntasm = data.data.sort((a , b) => a.id_cod_marca.localeCompare(b.id_cod_marca));
                setJuntasm(sortedJuntasm);
                setSuccessMessage(`Juntas de Cabeza para ${juntagId} recuperadas con éxito.`);
            } else {
                setErrorMessage(`No se encontraron Juntas de Cabeza para ${juntagId}.`);
            }
        } catch (error) {
            setErrorMessage(`No hay juntas compatibles para ${juntagId}`);
        }
    };

    // Obtener la lista de juntas m compatibles al cargar la página
    useEffect(() => {
        fetchJuntasm(juntagId);
    }, [juntagId]);

    /* ------- Para eliminar Junta de Cabeza */
    const openDeleteModal = (juntamId) => {
        setJuntamToDelete(juntamId);
        setShowDeleteModal(true);
    };

    // Cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => {
        setJuntamToDelete('');
        setShowDeleteModal(false);
    };

    // Función para eliminar Junta de Cabeza
    const handleDelete = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/admin/juntas-m/${juntamToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setSuccessDeleteMessage(`Junta de Cabeza ${juntamToDelete} eliminada con éxito.`);
                setJuntasm(juntasm.filter(juntam => juntam.id !== juntamToDelete));
                setJuntamToDelete('');
                fetchJuntasm(juntagId);
            } else {
                setErrorDeleteMessage(`Error el eliminar ${juntamToDelete}`);
            }
        } catch (error) {
            setErrorDeleteMessage(`Error el eliminar ${juntamToDelete}`);
        } finally {
            setJuntamToDelete('');
            setShowDeleteModal(false);
        }
    };

    // ------- Para agregar Junta de Cabeza
    const openAddModal = () => {
        setShowAddModal(true);
    };
    
    // Función para agregar Junta de Cabeza
    const handleAddJuntam = async (event, juntagId) => {
        event.preventDefault();
        
        const newErrors = {};
    
        // Validaciones
        if (!newJuntamId || newJuntamId.length > 40) {
            newErrors.id_cod_marca = "El código de la marca es obligatorio y no debe exceder 40 caracteres.";
        }
    
        if (!newJuntamMarcaRefac || newJuntamMarcaRefac.length > 15) {
            newErrors.marca_refac = "La marca es obligatoria y no debe exceder 15 caracteres.";
        }
    
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$|^No tiene$/;
        if (!newJuntamUrlMarca || !urlPattern.test(newJuntamUrlMarca) || newJuntamUrlMarca.length > 500) {
            newErrors.url_marca = "La URL es obligatoria, debe ser válida y no debe exceder 500 caracteres.";
        }
    
        // Si hay errores, no enviar la petición y mostrar los mensajes
        if (Object.keys(newErrors).length > 0) {
            setErrorAddMessage(newErrors);
            return;
        }
    
        // Limpiar errores si no hay
        setErrorAddMessage({});
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/juntas-m/${juntagId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_cod_marca: newJuntamId, 
                    marca_refac: newJuntamMarcaRefac,
                    url_marca: newJuntamUrlMarca
                })
            });
            
            if (response.ok) {
                setSuccessAddMessage(`Junta de Cabeza creada correctamente.`);
                fetchJuntasm(juntagId);
                closeAddModal();
            } else {
                setErrorAddMessage('Error al agregar Junta de Cabeza.');
            }
        } catch (error) {
            setErrorAddMessage('Error al conectar con el servidor.');
        }
    };


    // Funciones para agregar Junta de Cabeza 
    const handleNewJuntamIdChange = (e) => {
        setNewJuntamId(e.target.value);
    };

    const handleNewJuntamMarcaRefacChange = (e) => {
        setNewJuntamMarcaRefac(e.target.value);
    };

    const handleNewJuntamUrlMarcaChange = (e) => {
        setNewJuntamUrlMarca(e.target.value);
    };

    // Cerrar el modal de agregar Junta de Cabeza
    const closeAddModal = () => {
        setNewJuntamId('');
        setNewJuntamMarcaRefac('');
        setNewJuntamUrlMarca('');
        setSuccessAddMessage('');
        setErrorAddMessage('');
        setShowAddModal(false);
    };
    
    // ------- Para editar Junta de Cabeza
    const openEditModal = (juntamId) => { 
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        /* Función para la petición de la información de la Junta de Cabeza a editar */
        const fetchJuntamData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/juntas-m/${juntamId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const juntamData = data.data;
                    setJuntamToEdit(juntamData);
                    setEditJuntamId(juntamData.id_cod_marca);
                    setEditJuntamMarcaRefac(juntamData.marca_refac);
                    setEditJuntamUrlMarca(juntamData.url_marca);
                    setEditJuntamJuntag(juntamData.junta_id);
                    setSuccessEditMessage('Información de la Junta de Cabeza obtenida con éxito.');

                    setShowEditModal(true);
                } else {
                    setErrorEditMessage('Error al obtener la información de la Junta de Cabeza seleccionada.');
                }
            } catch (error) {
                setErrorEditMessage('No se pudo obtener la información de la Junta de Cabeza seleccionada.');
            }
        };

        fetchJuntamData(juntamId);
    };

    // Función para editar la junta g
    const handleEditJuntam = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validaciones
        if (!editJuntamId || editJuntamId.length > 40) {
            newErrors.id_cod_marca = "El código de la marca es obligatorio y no debe exceder 40 caracteres.";
        }
    
        if (!editJuntamMarcaRefac || editJuntamMarcaRefac.length > 15) {
            newErrors.marca_refac = "La marca es obligatoria y no debe exceder 15 caracteres.";
        }
    
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$|^No tiene$/;
        if (!editJuntamUrlMarca || !urlPattern.test(editJuntamUrlMarca) || editJuntamUrlMarca.length > 255) {
            newErrors.url_marca = "La URL es obligatoria, debe ser válida y no debe exceder 500 caracteres.";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrorEditMessage(newErrors);
            return;
        }
    
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/juntas-m/${juntamToEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_cod_marca: editJuntamId,
                    marca_refac: editJuntamMarcaRefac,
                    url_marca: editJuntamUrlMarca,
                    junta_id: editJuntamJuntag
                })
            });
    
            if (response.ok) {
                const updatedJuntam = {
                    id: juntamToEdit.id,
                    id_cod_marca: editJuntamId,
                    marca_refac: editJuntamMarcaRefac,
                    url_marca: editJuntamUrlMarca,
                    junta_id: editJuntamJuntag
                };
    
                if (editJuntamJuntag !== juntagId) {
                    // Si el junta_id cambió, removemos la junta de la lista
                    setJuntasm(prevJuntasm => prevJuntasm.filter(juntam => juntam.id !== updatedJuntam.id));
                    setSuccessEditMessage('Junta de Cabeza movida a otra lista.');
                } else {
                    // Si no cambió el junta_id, actualizamos la junta
                    setJuntasm(prevJuntasm => 
                        prevJuntasm.map(juntam => 
                            juntam.id === updatedJuntam.id ? updatedJuntam : juntam
                        )
                    );
                    setSuccessEditMessage('Junta de Cabeza editada con éxito.');
                }
    
                closeEditModal();
            } else {
                setErrorEditMessage('Error al editar la Junta de Cabeza.');
            }
        } catch (error) {
            setErrorEditMessage('Error al conectar con el servidor.');
        }
    };

    // Cerrar el modal de editar junta g
    const closeEditModal = () => {
        setEditJuntamId('');
        setEditJuntamMarcaRefac('');
        setEditJuntamUrlMarca('');
        setEditJuntamJuntag('');
        setShowEditModal(false);
    };

    // Funciones para editar Junta de Cabeza 
    const handleEditJuntamIdChange = (e) => {
        setEditJuntamId(e.target.value);
    };

    const handleEditJuntamMarcaRefacChange = (e) => {
        setEditJuntamMarcaRefac(e.target.value);
    };

    const handleEditJuntamUrlMarcaChange = (e) => {
        setEditJuntamUrlMarca(e.target.value);
    };

    const handleEditJuntamJuntag = (e) => {
        setEditJuntamJuntag(e.target.value);
    };


    /* ------- Componente para administrar Juntas de Cabeza */
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
                    <h1>Administrar Juntas de Cabeza</h1>

                    <div className="entity-management">
                        <div className="entity-header">
                          <h1>Juntas de Cabeza de {juntagId}</h1>
                          <div className="entity-actions">
                            <button className="add-entity-button" onClick={openAddModal}>Agregar nueva Junta de Cabeza</button>
                          </div>
                        </div>

                        {successMessage && <div className="get-success-message-juntag">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-juntag">{errorMessage}</div>}

                        {successDeleteMessage && <div className="delete-success-message-juntag">{successDeleteMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-juntag">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successAddMessage && <div className="add-success-message-juntag">{successAddMessage}</div>}
                        {Object.keys(errorAddMessage).length > 0 && (
                            <div className="add-error-message-juntag">
                                {Object.keys(errorAddMessage).map((key) => (
                                    <span key={key}>{errorAddMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successEditMessage && <div className="edit-success-message-juntag">{successEditMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-juntag">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        <table className="entity-table">
                          <thead>
                            <tr>
                              <th>Identificador en marca</th>
                              <th>Marca</th>
                              <th>Ficha técnica</th>
                              <th>GasketGenius</th>
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {juntasm.map((juntam) => (
                              <tr key={juntam.id}>
                                <td>{juntam.id_cod_marca}</td>
                                <td>{juntam.marca_refac}</td>
                                <td>{juntam.url_marca}</td>
                                <td>{juntam.junta_id}</td>
                                <td className="entity-options-cell">
                                  <button
                                    className="table-edit-button"
                                    onClick={() => openEditModal(juntam.id)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="table-delete-button"
                                    onClick={() => openDeleteModal(juntam.id)}
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
                        <p>¿Estás seguro de que deseas eliminar "{juntasm.find(juntam => juntam.id === juntamToDelete)?.id_cod_marca}"?</p>
                        <div className="confirm-delete-modal-actions">
                            <button className="confirm-delete-modal-button cancel" onClick={closeDeleteModal}>Cancelar</button>
                            <button className="confirm-delete-modal-button confirm" onClick={handleDelete}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="add-juntam-modal-overlay">
                    <div className="add-juntam-modal-content">
                        <h2>Agregar Junta de Cabeza</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador de la Junta de Cabeza" 
                            value={newJuntamId} 
                            onChange={handleNewJuntamIdChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Marca de la Junta de Cabeza" 
                            value={newJuntamMarcaRefac} 
                            onChange={handleNewJuntamMarcaRefacChange}
                        />
                        <input 
                            type="text" 
                            placeholder="URL de la ficha técnica" 
                            value={newJuntamUrlMarca} 
                            onChange={handleNewJuntamUrlMarcaChange}
                        />
                        <input 
                            className="input-gasketGenius"
                            type="text" 
                            placeholder="GasketGenius" 
                            value={juntagId}
                            readOnly
                        />

                        <div className="add-juntam-modal-actions">
                            <button className="add-juntam-modal-button cancel" onClick={closeAddModal}>Cancelar</button>
                            <button className="add-juntam-modal-button confirm" onClick={(e) => handleAddJuntam(e, juntagId)}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-juntam-modal-overlay">
                    <div className="edit-juntam-modal-content">
                        <h2>Editar {juntamToEdit?.id_cod_marca}</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador de la Junta de Cabeza" 
                            value={editJuntamId} 
                            onChange={handleEditJuntamIdChange}
                        />
                        <input 
                            type="text" 
                            placeholder="Marca de la Junta de Cabeza" 
                            value={editJuntamMarcaRefac} 
                            onChange={handleEditJuntamMarcaRefacChange}
                        />
                        <input 
                            type="text" 
                            placeholder="URL de la ficha técnica" 
                            value={editJuntamUrlMarca} 
                            onChange={handleEditJuntamUrlMarcaChange}
                        />
                        <input 
                            type="text" 
                            placeholder="GasketGenius" 
                            value={editJuntamJuntag} 
                            onChange={handleEditJuntamJuntag}
                        />

                        <div className="edit-juntam-modal-actions">
                            <button className="edit-juntam-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                            <button className="edit-juntam-modal-button confirm" onClick={handleEditJuntam}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarJuntasMAdmin;