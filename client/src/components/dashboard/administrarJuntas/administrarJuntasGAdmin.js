import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './administrarJuntas.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarJuntasGAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [motores, setMotores] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para agregar motor */
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMotorId, setNewMotorId] = useState('');
    const [newMotorLitros, setNewMotorLitros] = useState('');
    const [newMotorArbol, setNewMotorArbol] = useState('');
    const [newMotorValvulas, setNewMotorValvulas] = useState('');
    const [newMotorPosicionPistones, setNewMotorPosicionPistones] = useState('');
    const [newMotorNoPistones, setNewMotorNoPistones] = useState('');
    const [newMotorInfoAdicional, setNewMotorInfoAdicional] = useState([]);
    const [newMotorRangeYearI, setNewMotorRangeYearI] = useState('');
    const [newMotorRangeYearF, setNewMotorRangeYearF] = useState('');
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState('');

    /* Para eliminar motor */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [motorToDelete, setMotorToDelete] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    /* Para editar motor */
    const [showEditModal, setShowEditModal] = useState(false);
    const [motorToEdit, setMotorToEdit] = useState(null);
    const [editMotorId, setEditMotorId] = useState('');
    const [editMotorLitros, setEditMotorLitros] = useState('');
    const [editMotorArbol, setEditMotorArbol] = useState('');
    const [editMotorValvulas, setEditMotorValvulas] = useState('');
    const [editMotorPosicionPistones, setEditMotorPosicionPistones] = useState('');
    const [editMotorNoPistones, setEditMotorNoPistones] = useState('');
    const [editMotorInfoAdicional, setEditMotorInfoAdicional] = useState([]);
    const [editMotorRangeYearI, setEditMotorRangeYearI] = useState('');
    const [editMotorRangeYearF, setEditMotorRangeYearF] = useState('');
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

    /* Para mostrar los motores*/
    const fetchMotores = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/motor', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMotores(data.data);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay motores para mostrar');
        }
    };

    useEffect(() => {
        fetchMotores();
    }, []);

    /* Para eliminar motor */
    const openDeleteModal = (id) => {
        setMotorToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!motorToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/admin/motor/${motorToDelete}`, {
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
                setMotores(motores.filter(motor => motor.id_motor !== motorToDelete));
                setMotorToDelete(null);
                fetchMotores(); // Fetch the updated list of motores
            } else {
                setErrorDeleteMessage(data.msj);
            }
        } catch (error) {
            setErrorDeleteMessage('Error deleting brand');
        } finally {
            setShowDeleteModal(false);
            setMotorToDelete(null);
        }
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setMotorToDelete(null);
    };

    /* Para agregar motor */
    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setNewMotorId('');
        setNewMotorLitros('');
        setNewMotorArbol('');
        setNewMotorValvulas('');
        setNewMotorPosicionPistones('');
        setNewMotorNoPistones('');
        setNewMotorInfoAdicional([]);
        setNewMotorRangeYearI('');
        setNewMotorRangeYearF('');
        setShowAddModal(false);
    };

    const handleNewMotorIdChange = (e) => {
        setNewMotorId(e.target.value);
    };
    
    const handleNewMotorLitrosChange = (e) => {
        setNewMotorLitros(e.target.value);
    };
    
    const handleNewMotorArbolChange = (e) => {
        setNewMotorArbol(e.target.value);
    };

    const handleNewMotorValvulasChange = (e) => {
        setNewMotorValvulas(e.target.value);
    };
    
    const handleNewMotorPosicionPistonesChange = (e) => {
        setNewMotorPosicionPistones(e.target.value);
    };

    const handleNewMotorNoPistonesChange = (e) => {
        setNewMotorNoPistones(e.target.value);
    };

    const handleNewMotorInfoAdicionalChange = (event) => {
        const value = event.target.value;
        // Convertir la cadena separada por comas en un array y eliminar espacios adicionales
        const infoAdicionalArray = value.split(',').map(item => item.trim());
        setNewMotorInfoAdicional(infoAdicionalArray);
    };
         
    const handleNewMotorRangeYearIChange = (e) => {
        setNewMotorRangeYearI(e.target.value);
    };

    const handleNewMotorRangeYearFChange = (e) => {
        setNewMotorRangeYearF(e.target.value);
    };

    const handleAddMotor = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Motor (VARCHAR(100), obligatorio)
        if (newMotorId.trim() === '' || newMotorId.length > 100) {
            newErrors.newMotorId = 'El Identificador del motor no puede estar vacío ni exceder los 100 caracteres.';
        }

        // Validar NumeroLitros (FLOAT, obligatorio, entre 1.0 y 20.0)
        if (!newMotorLitros || isNaN(newMotorLitros) || newMotorLitros < 1.0 || newMotorLitros > 20.0) {
            newErrors.newMotorLitros = 'El número de litros debe ser un valor numérico entre 1.0 y 20.0.';
        }

        // Validar Tipo de Árbol (VARCHAR(4), obligatorio, solo puede ser OHV, SOHC, DOHC, SV)
        const validTiposArbol = ['OHV', 'SOHC', 'DOHC', 'SV'];
        if (!newMotorArbol || !validTiposArbol.includes(newMotorArbol.trim().toUpperCase())) {
            newErrors.newMotorArbol = 'El tipo de árbol debe ser OHV, SOHC, DOHC, o SV.';
        }

        // Validar NumeroValvulas (INT, obligatorio, solo puede ser 4, 8, 12, 16, 24)
        const validNumeroValvulas = [4, 8, 12, 16, 24];
        if (!newMotorValvulas || !validNumeroValvulas.includes(parseInt(newMotorValvulas))) {
            newErrors.newMotorValvulas = 'El número de válvulas debe ser 4, 8, 12, 16, o 24.';
        }

        // Validar PosiciónPistones (VARCHAR(1), obligatorio, solo puede ser L o V)
        const validPosicionesPistones = ['L', 'V'];
        if (!newMotorPosicionPistones || !validPosicionesPistones.includes(newMotorPosicionPistones.trim().toUpperCase())) {
            newErrors.newMotorPosicionPistones = 'La posición de los pistones debe ser L o V.';
        }

        // Validar NumeroPistones (INT, obligatorio, solo puede ser 3, 4, 5, 6, 8)
        const validNumeroPistones = [3, 4, 5, 6, 8];
        if (!newMotorNoPistones || !validNumeroPistones.includes(parseInt(newMotorNoPistones))) {
            newErrors.newMotorNoPistones = 'El número de pistones debe ser 3, 4, 5, 6, o 8.';
        }

        // Validar Información Adicional (Debe ser un array y no debe exceder los 255 caracteres en total)
        if (newMotorInfoAdicional.length === 0 || newMotorInfoAdicional.join(', ').length > 255) {
            newErrors.newMotorInfoAdicional = 'La información adicional no puede estar vacía ni exceder los 255 caracteres en total.';
        }

        // Validar el Rango de años (formato válido de año, "YYYY-YYYY")
        const yearRangeRegex = /^\d{4}$/;
        if (!yearRangeRegex.test(newMotorRangeYearI) || !yearRangeRegex.test(newMotorRangeYearF)) {
            newErrors.newMotorRangeYear = 'Los años deben tener 4 dígitos numéricos (Ej. 2007, 2013).';
        }

        // Si hay errores, los mostramos
        if (Object.keys(newErrors).length > 0) {
            setErrorAddMessage(newErrors); // Almacenar los errores en el estado
            return; // Salir si hay errores
        }

        // Si no hay errores, proceder con el envío de datos
        setErrorAddMessage({});
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch('http://localhost:3000/admin/motor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_motor: newMotorId,
                    numero_litros: newMotorLitros, 
                    tipo_arbol: newMotorArbol, 
                    numero_valvulas: newMotorValvulas, 
                    posicion_pistones: newMotorPosicionPistones,
                    numero_pistones: newMotorNoPistones,
                    info_adicional: newMotorInfoAdicional, 
                    range_year_i: newMotorRangeYearI, 
                    range_year_f: newMotorRangeYearF
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessAddMessage(data.msg);
                fetchMotores(); // Refresca la lista de motores
                closeAddModal();
            } else {
                setErrorAddMessage({ form: data.msg || 'Error al agregar motor.' });
            }
        } catch (error) {
            setErrorAddMessage({ form: 'Error al conectar con el servidor.' });
        }
    };

    /* Para editar motor */
    const openEditModal = (motor) => {
        setMotorToEdit(motor);
        setEditMotorId(motor.id_motor);
        setEditMotorLitros(motor.numero_litros);
        setEditMotorArbol(motor.tipo_arbol);
        setEditMotorValvulas(motor.numero_valvulas);
        setEditMotorPosicionPistones(motor.posicion_pistones);
        setEditMotorNoPistones(motor.numero_pistones);
        setEditMotorInfoAdicional(motor.info_adicional);
        setEditMotorRangeYearI(motor.range_year_i);
        setEditMotorRangeYearF(motor.range_year_f);

        setShowEditModal(true);
    };
    
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditMotorId('');
        setMotorToEdit(null);
    };

    const handleEditMotorIdChange = (e) => {
        setEditMotorId(e.target.value);
    };
    
    const handleEditMotorLitrosChange = (e) => {
        setEditMotorLitros(e.target.value);
    };
    
    const handleEditMotorArbolChange = (e) => {
        setEditMotorArbol(e.target.value);
    };
    
    const handleEditMotorValvulasChange = (e) => {
        setEditMotorValvulas(e.target.value);
    };
    
    const handleEditMotorPosicionPistonesChange = (e) => {
        setEditMotorPosicionPistones(e.target.value);
    };
    
    const handleEditMotorNoPistonesChange = (e) => {
        setEditMotorNoPistones(e.target.value);
    };
    
    const handleEditMotorInfoAdicionalChange = (e) => {
        const value = e.target.value.split(','); // Convierte la cadena en un array
        setEditMotorInfoAdicional(value);
    };
    
    const handleEditMotorRangeYearIChange = (e) => {
        setEditMotorRangeYearI(e.target.value);
    };
    
    const handleEditMotorRangeYearFChange = (e) => {
        setEditMotorRangeYearF(e.target.value);
    };

    const handleEditAuto = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Motor (VARCHAR(100), obligatorio)
        if (editMotorId.trim() === '' || editMotorId.length > 100) {
            newErrors.editMotorId = 'El Identificador del motor no puede estar vacío ni exceder los 100 caracteres.';
        }

        // Validar NumeroLitros (FLOAT, obligatorio, entre 1.0 y 20.0)
        if (!editMotorLitros || isNaN(editMotorLitros) || editMotorLitros < 1.0 || editMotorLitros > 20.0) {
            newErrors.editMotorLitros = 'El número de litros debe ser un valor numérico entre 1.0 y 20.0.';
        }

        // Validar Tipo de Árbol (VARCHAR(4), obligatorio, solo puede ser OHV, SOHC, DOHC, SV)
        const validTiposArbol = ['OHV', 'SOHC', 'DOHC', 'SV'];
        if (!editMotorArbol || !validTiposArbol.includes(editMotorArbol.trim().toUpperCase())) {
            newErrors.editMotorArbol = 'El tipo de árbol debe ser OHV, SOHC, DOHC, o SV.';
        }

        // Validar NumeroValvulas (INT, obligatorio, solo puede ser 4, 8, 12, 16, 24)
        const validNumeroValvulas = [4, 8, 12, 16, 24];
        if (!editMotorValvulas || !validNumeroValvulas.includes(parseInt(editMotorValvulas))) {
            newErrors.editMotorValvulas = 'El número de válvulas debe ser 4, 8, 12, 16, o 24.';
        }

        // Validar PosiciónPistones (VARCHAR(1), obligatorio, solo puede ser L o V)
        const validPosicionesPistones = ['L', 'V'];
        if (!editMotorPosicionPistones || !validPosicionesPistones.includes(editMotorPosicionPistones.trim().toUpperCase())) {
            newErrors.editMotorPosicionPistones = 'La posición de los pistones debe ser L o V.';
        }

        // Validar NumeroPistones (INT, obligatorio, solo puede ser 3, 4, 5, 6, 8)
        const validNumeroPistones = [3, 4, 5, 6, 8];
        if (!editMotorNoPistones || !validNumeroPistones.includes(parseInt(editMotorNoPistones))) {
            newErrors.editMotorNoPistones = 'El número de pistones debe ser 3, 4, 5, 6, o 8.';
        }

        // Validar Información Adicional (Debe ser un array y no debe exceder los 255 caracteres en total)
        if (editMotorInfoAdicional.length === 0 || editMotorInfoAdicional.join(', ').length > 255) {
            newErrors.editMotorInfoAdicional = 'La información adicional no puede estar vacía ni exceder los 255 caracteres en total.';
        }

        // Validar el Rango de años (formato válido de año, "YYYY-YYYY")
        const yearRangeRegex = /^\d{4}$/;
        if (!yearRangeRegex.test(editMotorRangeYearI) || !yearRangeRegex.test(editMotorRangeYearF)) {
            newErrors.editMotorRangeYear = 'Los años deben tener 4 dígitos numéricos (Ej. 2007, 2013).';
        }

        // Si hay errores, los mostramos
        if (Object.keys(newErrors).length > 0) {
            setErrorAddMessage(newErrors); // Almacenar los errores en el estado
            return; // Salir si hay errores
        }
    
        // Limpiar los errores y enviar los datos si no hay errores
        setErrorEditMessage({});
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`http://localhost:3000/admin/motor/${motorToEdit.id_motor}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_motor: editMotorId,
                    numero_litros: editMotorLitros, 
                    tipo_arbol: editMotorArbol, 
                    numero_valvulas: editMotorValvulas, 
                    posicion_pistones: editMotorPosicionPistones,
                    numero_pistones: editMotorNoPistones,
                    info_adicional: editMotorInfoAdicional, 
                    range_year_i: editMotorRangeYearI, 
                    range_year_f: editMotorRangeYearF
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessEditMessage(data.msj);
                setMotores(motores.map(motor => motor.id_motor === motorToEdit.id_motor ? { 
                    ...motor, 
                    id_motor: editMotorId,
                    numero_litros: editMotorLitros, 
                    tipo_arbol: editMotorArbol, 
                    numero_valvulas: editMotorValvulas, 
                    posicion_pistones: editMotorPosicionPistones,
                    numero_pistones: editMotorNoPistones,
                    info_adicional: editMotorInfoAdicional, 
                    range_year_i: editMotorRangeYearI, 
                    range_year_f: editMotorRangeYearF } : motor));
                fetchMotores(); // Fetch the updated list of autos
                closeEditModal();
            } else {
                setErrorEditMessage(data.msj);
            }
        } catch (error) {
            setErrorEditMessage('Error editing brand');
        }
    };

    /* Componente para administrar motores */
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
                    <h1>Administrar motores</h1>

                    <div className="motor-management">
                        <div className="motor-header">
                          <h1>Motores</h1>
                          <div className="motor-actions">
                            <input type="text" placeholder="Búsqueda por nombre" className="motor-search-bar" />
                            <button className="add-motor-button" onClick={openAddModal}>Agregar motor</button>
                          </div>
                        </div>

                        {successMessage && <div className="get-success-message-motor">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-motor">{errorMessage}</div>}

                        {successDeleteMessage && <div className="delete-success-message-motor">{successDeleteMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-motor">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successAddMessage && <div className="add-success-message-motor">{successAddMessage}</div>}
                        {Object.keys(errorAddMessage).length > 0 && (
                            <div className="add-error-message-motor">
                                {Object.keys(errorAddMessage).map((key) => (
                                    <span key={key}>{errorAddMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        {successEditMessage && <div className="edit-success-message-motor">{successEditMessage}</div>}
                        {Object.keys(errorEditMessage).length > 0 && (
                            <div className="edit-error-message-motor">
                                {Object.keys(errorEditMessage).map((key) => (
                                    <span key={key}>{errorEditMessage[key]}</span> // Muestra cada error
                                ))}
                            </div>
                        )}

                        <table className="motor-table">
                          <thead>
                            <tr>
                              <th>Identificador</th>
                              <th>Litros</th>
                              <th>Tipo de Árbol</th>
                              <th>No. Válvulas</th>
                              <th>Pistones y Posición</th>
                              <th>Información adicional</th>
                              <th>Rango de años</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {motores.map((motor) => (
                              <tr key={motor.id_motor}>
                                <td>{motor.id_motor}</td>
                                <td>{motor.numero_litros}</td>
                                <td>{motor.tipo_arbol}</td>
                                <td>{motor.numero_valvulas}</td>
                                <td>{motor.numero_pistones} {motor.posicion_pistones}</td>
                                <td>{Array.isArray(motor.info_adicional) ? motor.info_adicional.join(", ") : motor.info_adicional}</td>
                                <td>{`${motor.range_year_i} - ${motor.range_year_f}`}</td>
                                <td className="motor-options-cell">
                                  <button
                                    className="motor-edit-button"
                                    onClick={() => openEditModal(motor)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="motor-delete-button"
                                    onClick={() => openDeleteModal(motor.id_motor)}
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
                        <p>¿Estás seguro de que deseas eliminar "{motores.find(motor => motor.id_motor === motorToDelete)?.id_motor}"?</p>
                        <div className="confirm-delete-modal-actions">
                            <button className="confirm-delete-modal-button cancel" onClick={closeDeleteModal}>Cancelar</button>
                            <button className="confirm-delete-modal-button confirm" onClick={handleDelete}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="add-motor-modal-overlay">
                    <div className="add-motor-modal-content">
                      <h2>Agregar Motor</h2>
                      <input 
                        type="text" 
                        placeholder="Identificador del motor" 
                        value={newMotorId} 
                        onChange={handleNewMotorIdChange}
                      />
                      <input 
                        type="float" 
                        placeholder="Litros del motor" 
                        value={newMotorLitros} 
                        onChange={handleNewMotorLitrosChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Tipo de árbol de levas" 
                        value={newMotorArbol} 
                        onChange={handleNewMotorArbolChange}
                      />
                      <input 
                        type="number" 
                        placeholder="Número de válvulas" 
                        value={newMotorValvulas} 
                        onChange={handleNewMotorValvulasChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Posición de los pistones" 
                        value={newMotorPosicionPistones} 
                        onChange={handleNewMotorPosicionPistonesChange}
                      />
                      <input 
                        type="number" 
                        placeholder="Número de pistones" 
                        value={newMotorNoPistones} 
                        onChange={handleNewMotorNoPistonesChange}
                      />

                      {/* Input para información adicional, separado por comas */}
                      <input 
                        type="text" 
                        placeholder="Información adicional (separado por comas)" 
                        value={newMotorInfoAdicional} 
                        onChange={handleNewMotorInfoAdicionalChange}
                      />

                      <input 
                        type="text" 
                        placeholder="Año inicial" 
                        value={newMotorRangeYearI} 
                        onChange={handleNewMotorRangeYearIChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Año final" 
                        value={newMotorRangeYearF} 
                        onChange={handleNewMotorRangeYearFChange}
                      />

                      <div className="add-motor-modal-actions">
                        <button className="add-motor-modal-button cancel" onClick={closeAddModal}>Cancelar</button>
                        <button className="add-motor-modal-button confirm" onClick={handleAddMotor}>Confirmar</button>
                      </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="edit-motor-modal-overlay">
                    <div className="edit-motor-modal-content">
                      <h2>Editar motor</h2>
                      <input 
                        type="text" 
                        placeholder="Identificador del motor" 
                        value={editMotorId} 
                        onChange={handleEditMotorIdChange}
                      />
                      <input 
                        type="float" 
                        placeholder="Litros del motor" 
                        value={editMotorLitros} 
                        onChange={handleEditMotorLitrosChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Tipo de árbol de levas" 
                        value={editMotorArbol} 
                        onChange={handleEditMotorArbolChange}
                      />
                      <input 
                        type="number" 
                        placeholder="Número de válvulas" 
                        value={editMotorValvulas} 
                        onChange={handleEditMotorValvulasChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Posición de los pistones" 
                        value={editMotorPosicionPistones} 
                        onChange={handleEditMotorPosicionPistonesChange}
                      />
                      <input 
                        type="number" 
                        placeholder="Número de pistones" 
                        value={editMotorNoPistones} 
                        onChange={handleEditMotorNoPistonesChange}
                      />

                      {/* Input para información adicional, separado por comas */}
                      <input 
                        type="text" 
                        placeholder="Información adicional (separado por comas)" 
                        value={editMotorInfoAdicional} 
                        onChange={handleEditMotorInfoAdicionalChange}
                      />

                      <input 
                        type="text" 
                        placeholder="Año inicial" 
                        value={editMotorRangeYearI} 
                        onChange={handleEditMotorRangeYearIChange}
                      />
                      <input 
                        type="text" 
                        placeholder="Año final" 
                        value={editMotorRangeYearF} 
                        onChange={handleEditMotorRangeYearFChange}
                      />

                      <div className="add-motor-modal-actions">
                        <button className="add-motor-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                        <button className="add-motor-modal-button confirm" onClick={handleEditAuto}>Confirmar</button>
                      </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarJuntasGAdmin;