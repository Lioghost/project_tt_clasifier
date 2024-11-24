import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import '../Dashboard.css';
import './administrarJuntasG.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarJuntasGAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar y dropdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Estados para mostrar las juntas g
    const [juntasg, setJuntasg] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para eliminar junta g */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [juntagToDelete, setJuntagToDelete] = useState('');
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    /* Para agregar junta g */
    const [showAddModal, setShowAddModal] = useState(false);
    const [newJuntagId, setNewJuntagId] = useState('');
    const [newJuntagIdImage, setNewJuntagIdImage] = useState('');
    const [selectedNewJuntagImagePreview, setSelectedNewJuntagImagePreview] = useState(null); // Estado para la vista previa de la imagen
    const [selectedNewJuntagImageFile, setSelectedNewJuntagImageFile] = useState(null); // Estado para el archivo real que se enviará
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState('');

    /* Para editar junta g */
    const [showEditModal, setShowEditModal] = useState(false);
    const [juntagToEdit, setJuntagToEdit] = useState('');
    const [editJuntagId, setEditJuntagId] = useState('');
    const [editJuntagIdImage, setEditJuntagIdImage] = useState('');
    const [selectedEditJuntagImagePreview, setSelectedEditJuntagImagePreview] = useState(null); // Estado para la vista previa de la imagen
    const [selectedEditJuntagImageFile, setSelectedEditJuntagImageFile] = useState(null); // Estado para el archivo real que se enviará
    const [successEditMessage, setSuccessEditMessage] = useState('');
    const [errorEditMessage, setErrorEditMessage] = useState('');

    /* Para ir a las Juntas M compatibles con GasketGenius */
    const openCompatibleView = (juntagId) => {
        navigate(`/admin/juntasm/${juntagId}`);
    };

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

    // /* ------- Para mostrar las juntas g */
    const fetchJuntasg = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/juntas-g', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Ordenar las juntas g alfabéticamente por 'id_junta'
                const sortedJuntasg = data.data.sort((a , b) => a.id_junta.localeCompare(b.id_junta));
                setJuntasg(sortedJuntasg);
                setSuccessMessage(data.msj);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay juntas GasketGenius para mostrar');
        }
    };

    // Obtener la lista de juntas g al cargar la página
    useEffect(() => {
        fetchJuntasg();
    }, []);

    /* ------- Para eliminar junta g */
    const openDeleteModal = (JuntagId) => {
        setJuntagToDelete(JuntagId);
        setShowDeleteModal(true);
    };

    // Cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => {
        setJuntagToDelete('');
        setShowDeleteModal(false);
    };

    // Función para eliminar junta g
    const handleDelete = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!juntagToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/juntas-g/${juntagToDelete}`, {
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
                setJuntasg(juntasg.filter(juntag => juntag.id_junta !== juntagToDelete));
                setJuntagToDelete('');
                fetchJuntasg(); // Fetch the updated list of junta g
            } else {
                setErrorDeleteMessage(data.mj);
            }
        } catch (error) {
            setErrorDeleteMessage('Error el eliminar junta gasketgenius');
        } finally {
            setShowDeleteModal(false);
            setJuntagToDelete('');
        }
    };

    /* ------- Para agregar junta g */
    const openAddModal = () => {
        setShowAddModal(true);
        fetchJuntagId();  // Llamar a la función para obtener el ID
    };

    // Para generar el ID de la nueva junta g
    const fetchJuntagId = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch('http://localhost:3000/admin/juntas-g-id', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setNewJuntagId(data.junta_id); // Establecer el ID en el estado
                setNewJuntagIdImage(`${data.junta_id}.jpg`);  // Establecer el ID de la imagen con la extensión .jpg
            } else {
                console.error("Error al obtener el ID de la junta");
            }
        } catch (error) {
            console.error("Error al hacer la petición GET", error);
        }
    };

    // Función para manejar el drop de las imágenes
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validMimeTypes.includes(file.type)) {
                console.error('Invalid file type');
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setSelectedNewJuntagImagePreview(imageUrl); // Guarda la URL para la vista previa
            setSelectedNewJuntagImageFile(file); // Guarda el archivo real para enviarlo
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': []
        },
        maxFiles: 1
    });
    
    // Función para agregar junta g
    const handleAddJuntag = async (event) => {
        event.preventDefault();
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        // Validación: Asegúrate de que se haya seleccionado una imagen
        if (!selectedNewJuntagImageFile) {
            setErrorAddMessage({ form: 'Por favor, selecciona una imagen antes de enviar el formulario.' });
            return; // Evita que se continúe con la solicitud si no hay imagen
        }
    
        const formData = new FormData();
        formData.append('id_junta', newJuntagId);
        formData.append('imagen', selectedNewJuntagImageFile);
    
        try {
            const response = await fetch('http://localhost:3000/admin/juntas-g', {
                method: 'POST',
                headers: {
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
        
            const data = await response.json();
            if (response.ok) {
                setSuccessAddMessage(data.msg);
                fetchJuntasg(); // Refresca la lista de juntas
                closeAddModal();
            } else {
                setErrorAddMessage({ form: data.msg || 'Error al agregar junta GasketGenius.' });
            }
        } catch (error) {
            setErrorAddMessage({ form: 'Error al conectar con el servidor.' });
        }
    };


     // Funciones para agregar junta g
    const handleNewJuntagIdChange = (e) => {
        setNewJuntagId(e.target.value);
    };
    
    const handleNewJuntagIdImageChange = (e) => {
        setNewJuntagIdImage(e.target.value);
    };

    // Cerrar el modal de agregar junta g
    const closeAddModal = () => {
        setNewJuntagId('');
        setNewJuntagIdImage('');
        setSelectedNewJuntagImageFile(null);
        setSelectedNewJuntagImagePreview(null);
        setShowAddModal(false);
    };

    /* ------- Para editar junta g */
    const openEditModal = (juntagId, juntagIdImage) => { 
        const IdJunta = juntagId;
        const IdImage = juntagIdImage;
        const ImgURL = `http://localhost:3000/juntas/${IdImage}`

        setJuntagToEdit(IdJunta);
        setEditJuntagId(IdJunta);
        setEditJuntagIdImage(IdImage);
        setSelectedEditJuntagImagePreview(ImgURL);
        setSelectedEditJuntagImageFile();
        setShowEditModal(true);
    };

    // Función para manejar el drop de las imágenes
    const onEditDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validMimeTypes.includes(file.type)) {
                console.error('Invalid file type');
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setSelectedEditJuntagImagePreview(imageUrl); // Guarda la URL para la vista previa
            setSelectedEditJuntagImageFile(file); // Guarda el archivo real para enviarlo
        }
    }, []);

    const { getRootProps: getEditRootProps, getInputProps: getEditInputProps, isDragActive: isEditDragActive } = useDropzone({
        onDrop: onEditDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': []
        },
        maxFiles: 1
    });

    // Función para editar la junta g
    const handleEditJuntag = async (event) => {
        event.preventDefault();
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('id_junta', editJuntagId);
        if (selectedEditJuntagImageFile) {
            formData.append('imagen', selectedEditJuntagImageFile); // Incluir la imagen si existe
        }

        try {
            const response = await fetch(`http://localhost:3000/admin/juntas-g/${juntagToEdit}`, {
                method: 'PATCH',
                headers: {
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessEditMessage(data.msg);
                fetchJuntasg(); // Refresca la lista de juntas
                closeEditModal();
            } else {
                setErrorEditMessage(data.msg || 'Error al editar la junta.');
            }
        } catch (error) {
            setErrorEditMessage('Error al conectar con el servidor.');
        }
    };


    // Cerrar el modal de editar junta g
    const closeEditModal = () => {
        setEditJuntagId('');
        setEditJuntagIdImage('');
        setSelectedEditJuntagImageFile(null);
        setSelectedEditJuntagImagePreview(null);
        setShowEditModal(false);
    };

    /* ------- Componente para administrar GasketGenius */
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
                    <h1>Administrar GasketGenius</h1>

                    <div className="entity-management">
                        <div className="entity-header">
                          <h1>Juntas GasketGenius</h1>
                          <div className="entity-actions">
                            <button className="add-entity-button" onClick={openAddModal}>Agregar junta GasketGenius</button>
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
                              <th>Identificador</th>
                              <th>Imagen</th>
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {juntasg.map((juntag) => (
                              <tr key={juntag.id_junta}>
                                <td>{juntag.id_junta}</td>
                                <td>{juntag.id_image}</td>
                                <td className="entity-options-cell">
                                  <button
                                    className="table-edit-button"
                                    onClick={() => openEditModal(juntag.id_junta, juntag.id_image)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="table-assign-button"
                                    onClick={() => openCompatibleView(juntag.id_junta)}
                                  >
                                    Compatibles
                                  </button>
                                  <button
                                    className="table-delete-button"
                                    onClick={() => openDeleteModal(juntag.id_junta)}
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
                        <p>¿Estás seguro de que deseas eliminar "{juntasg.find(juntag => juntag.id_junta === juntagToDelete)?.id_junta}"?</p>
                        <div className="confirm-delete-modal-actions">
                            <button className="confirm-delete-modal-button cancel" onClick={closeDeleteModal}>Cancelar</button>
                            <button className="confirm-delete-modal-button confirm" onClick={handleDelete}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="add-juntag-modal-overlay">
                    <div className="add-juntag-modal-content">
                        <h2>Agregar Junta GasketGenius</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador de la junta" 
                            value={newJuntagId} 
                            onChange={handleNewJuntagIdChange}
                            readOnly // El ID es generado automáticamente, por lo que no permitimos editarlo
                        />

                        <input 
                            type="text" 
                            placeholder="Identificador de la imagen de la junta" 
                            value={newJuntagIdImage} 
                            onChange={handleNewJuntagIdImageChange}
                            readOnly // El ID es generado automáticamente, por lo que no permitimos editarlo
                        />

                        {/* Zona de arrastre de archivos */}
                        <div {...getRootProps()} className='dropzoneStyle'>
                            <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Suelta la imagen aquí...</p>
                                ) : (
                                    <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionarla.</p>
                            )}

                            {/* Mostrar la imagen seleccionada */}
                            {selectedNewJuntagImagePreview && (
                                <div className="preview">
                                    <img src={selectedNewJuntagImagePreview} alt="Imagen seleccionada" className="previewImage" />
                                </div>
                            )}
                        </div>

                        <div className="add-juntag-modal-actions">
                            <button className="add-juntag-modal-button cancel" onClick={closeAddModal}>Cancelar</button>
                            <button className="add-juntag-modal-button confirm" onClick={handleAddJuntag}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-juntag-modal-overlay">
                    <div className="edit-juntag-modal-content">
                        <h2>Editar {juntagToEdit?.id_image}</h2>
                        <input 
                            type="text" 
                            placeholder="Identificador de la junta" 
                            value={editJuntagId} 
                            readOnly // El ID es generado automáticamente, por lo que no permitimos editarlo
                        />

                        <input 
                            type="text" 
                            placeholder="Identificador de la imagen de la junta" 
                            value={editJuntagIdImage} 
                            readOnly // El ID es generado automáticamente, por lo que no permitimos editarlo
                        />

                        {/* DropZone para cargar una nueva imagen */}
                        <div {...getEditRootProps()} className="dropzoneStyle">
                            <input {...getEditInputProps()} />
                            {isEditDragActive ? (
                                <p>Suelta la imagen aquí...</p>
                            ) : (
                                <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionarla.</p>
                            )}

                            {/* Mostrar la vista previa de la imagen */}
                            {selectedEditJuntagImagePreview && (
                                <div className="preview">
                                    <img src={selectedEditJuntagImagePreview} alt="Imagen seleccionada" className="previewImage" />
                                </div>
                            )}
                        </div>


                        <div className="edit-juntag-modal-actions">
                            <button className="edit-juntag-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                            <button className="edit-juntag-modal-button confirm" onClick={handleEditJuntag}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarJuntasGAdmin;