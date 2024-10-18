import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip'; // Cambia esta línea
import '../Dashboard.css';
import './administrarAutos.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarAutosAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Estados para mostrar los autos
    const [autos, setAutos] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para eliminar auto */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [autoToDelete, setAutoToDelete] = useState('');
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

    /* Para agregar auto */
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAutoId, setNewAutoId] = useState(''); 
    const [newAutoSubmarca, setNewAutoSubmarca] = useState('');
    const [newAutoModelo, setNewAutoModelo] = useState('');
    const [newAutoLitros, setNewAutoLitros] = useState('');
    const [newAutoMarca, setNewAutoMarca] = useState([]);
    const [selectedNewMarca, setSelectedNewMarca] = useState('');  // Para guardar el nombre de la marca seleccionada
    const [selectedNewMarcaId, setSelectedNewMarcaId] = useState('');  // Para guardar el id de la marca seleccionada
    const [successAddMessage, setSuccessAddMessage] = useState('');
    const [errorAddMessage, setErrorAddMessage] = useState({});

    /* Para editar auto */
    const [showEditModal, setShowEditModal] = useState(false);
    const [autoToEdit, setAutoToEdit] = useState('');
    const [editAutoId, setEditAutoId] = useState('');
    const [editAutoSubmarca, setEditAutoSubmarca] = useState('');
    const [editAutoModelo, setEditAutoModelo] = useState('');
    const [editAutoLitros, setEditAutoLitros] = useState('');
    const [editAutoMarca, setEditAutoMarca] = useState([]);
    const [selectedEditMarca, setSelectedEditMarca] = useState('');  // Para almacenar el nombre de la marca
    const [selectedEditMarcaId, setSelectedEditMarcaId] = useState('');  // Para almacenar el id de la marca
    const [successEditMessage, setSuccessEditMessage] = useState('');
    const [errorEditMessage, setErrorEditMessage] = useState({});

    /* Para asignarle al auto sus motores */
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [autoToAssign, setAutoToAssign] = useState('');
    const [assignAutoId, setAssignAutoId] = useState('');
    const [assignAutoSubmarca, setAssignAutoSubmarca] = useState('');
    const [assignAutoModelo, setAssignAutoModelo] = useState('');
    const [assignAutoLitros, setAssignAutoLitros] = useState('');
    const [selectedAssignMarca, setSelectedAssignMarca] = useState('');  // Para almacenar el nombre de la marca
    const [selectedAssignMarcaId, setSelectedAssignMarcaId] = useState('');  // Para almacenar el id de la marca
    const [assignAutoMotores, setAssignAutoMotores] = useState([]); // Para mostrar los motores disponibles
    const [selectedMotors, setSelectedMotors] = useState([]); // Para mostrar los motores seleccionados
    const [successAssignMessage, setSuccessAssignMessage] = useState('');
    const [errorAssignMessage, setErrorAssignMessage] = useState({});

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

    // Mostrar mensajes de éxito o error al asignarle al auto sus motores
    useEffect(() => {
        if (successAssignMessage || errorAssignMessage) {
            const timer = setTimeout(() => {
                setSuccessAssignMessage('');
                setErrorAssignMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successAssignMessage, errorAssignMessage]);

    // Funciones para el sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Funciones para el dropdown del perfil de usuario
    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    /* ------- Para mostrar los autos */
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
                // Ordenar los autos alfabéticamente por 'id_auto'
                const sortedAutos = data.data.sort((a, b) => a.id_auto.localeCompare(b.id_auto));
                setAutos(sortedAutos);  // Guardar los autos ordenados
                setSuccessMessage(data.msj);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay autos para mostrar');
        }
    };

    // Obtener la lista de autos al cargar la página
    useEffect(() => {
        fetchAutos();
    }, []);

    /* ------- Para eliminar auto */
    const openDeleteModal = (AutoId) => {
        setAutoToDelete(AutoId);
        setShowDeleteModal(true);
    };

    // Cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAutoToDelete('');
    };

    // Función para eliminar auto
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
                setAutos(autos.filter(auto => auto.id !== autoToDelete));
                setAutoToDelete('');
                fetchAutos(); // Fetch the updated list of autos
            } else {
                setErrorDeleteMessage(data.msj);
            }
        } catch (error) {
            setErrorDeleteMessage('Error al eliminar auto');
        } finally {
            setShowDeleteModal(false);
            setAutoToDelete('');
        }
    };

    /* ------- Para agregar auto */
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
                setErrorAddMessage('Error al obtener marcas');
            }
        };
        
        fetchMarcasAdd();
        setShowAddModal(true);
    };

    // Cerrar el modal de agregar auto
    const closeAddModal = () => {
        setNewAutoId('');
        setNewAutoSubmarca('');
        setNewAutoModelo('');
        setNewAutoLitros('');
        setNewAutoMarca([]);
        setSelectedNewMarca('');  
        setSelectedNewMarcaId('');  
        setShowAddModal(false);
    };

    // Funciones para agregar auto
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
        const marcaSeleccionada = e.target.value;  // Obtiene el nombre de la marca
        setSelectedNewMarca(marcaSeleccionada);
    
        // Busca el id de la marca seleccionada y guárdalo
        const marcaEncontrada = newAutoMarca.find((marca) => marca.marca === marcaSeleccionada);
        if (marcaEncontrada) {
            setSelectedNewMarcaId(marcaEncontrada.id);
        } else {
            setSelectedNewMarcaId('');  // En caso de que no se encuentre una coincidencia
        }
    };

    // Función para agregar auto
    const handleAddAuto = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Auto (VARCHAR(30), obligatorio) 
        if (newAutoId.trim() === '' || newAutoId.length > 30) {
            newErrors.newAutoId = 'El Identificador del auto no puede estar vacío ni exceder los 30 caracteres.';
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

        // Validar Marca (VARCHAR(50), obligatorio)
        if (!selectedNewMarcaId) {
            newErrors.selectedNewMarcaId = 'Debe seleccionar una marca.';
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
                    modelo: parseInt(newAutoModelo),
                    litros: parseFloat(newAutoLitros),
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

    /* ------- Para editar el auto */
    const openEditModal = (autoId) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        /* Función para la petición de marcas */
        const fetchMarcasEdit = async () => {
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
                setErrorEditMessage('Error al obtener marcas');
            }
        };
    
        /* Función para la petición de la información del auto a editar */
        const fetchAutoData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/autos/${autoId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const autoData = data.data;
                    setAutoToEdit(autoData);
                    setEditAutoId(autoData.id_auto);
                    setEditAutoSubmarca(autoData.submarca);
                    setEditAutoModelo(autoData.modelo);
                    setEditAutoLitros(autoData.litros);
                    setSelectedEditMarcaId(autoData.marca_id);
                    setSelectedEditMarca(autoData.marca.marca);

                    setShowEditModal(true);
                } else {
                    setErrorEditMessage(data.msj);
                }
            } catch (error) {
                setErrorEditMessage('No se pudo obtener la información del auto seleccionado.');
            }
        };
    
        fetchMarcasEdit();
        fetchAutoData(autoId);
    };
    
    // Cerrar el modal de editar auto
    const closeEditModal = () => { 
        setAutoToEdit('');
        setEditAutoId('');
        setEditAutoSubmarca('');
        setEditAutoModelo('');
        setEditAutoLitros('');
        setSelectedEditMarca('');  // Para almacenar el nombre de la marca
        setSelectedEditMarcaId('');  // Para almacenar el id de la marca
        setAutoToEdit('');
        setShowEditModal(false);
    };

    // Funciones para editar auto
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

    const handleEditAutoMarcaChange = (e) => {
        const marcaSeleccionada = e.target.value;  // Obtiene el nombre de la marca seleccionada
        setSelectedEditMarca(marcaSeleccionada);
    
        // Busca el id de la marca seleccionada y guárdalo
        const marcaEncontrada = editAutoMarca.find((marca) => marca.marca === marcaSeleccionada);
        if (marcaEncontrada) {
            setSelectedEditMarcaId(marcaEncontrada.id);
        } else {
            setSelectedEditMarcaId('');  // En caso de que no se encuentre una coincidencia
        }
    };

    // Función para editar auto
    const handleEditAuto = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        // Validar ID_Auto (VARCHAR(30), obligatorio) 
        if (editAutoId.trim() === '' || editAutoId.length > 30) {
            newErrors.editAutoId = 'El Identificador del auto no puede estar vacío ni exceder los 30 caracteres.';
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
        if (!editAutoLitros || isNaN(editAutoLitros) || editAutoLitros <= 1.0 || editAutoLitros > 20) {
            newErrors.editAutoLitros = 'El número de litros debe ser un valor numérico entre 1.0 y 20.0.';
        }

        // Validar Marca (VARCHAR(50), obligatorio)
        if (!selectedEditMarcaId) {
            newErrors.selectedEditMarcaId = 'Debe seleccionar una marca.';
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
            const response = await fetch(`http://localhost:3000/admin/autos/${autoToEdit.id}`, {
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
                    litros: parseFloat(editAutoLitros),
                    marca_id: parseInt(selectedEditMarcaId)
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessEditMessage(data.msg);
                fetchAutos(); // Fetch the updated list of autos
                closeEditModal();
            } else {
                setErrorEditMessage(data.msg);
            }
        } catch (error) {
            setErrorEditMessage('Error al editar auto');
        }
    };

    /* ------- Para asignarle al auto sus motores */
    const openAssignModal = (autoId) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        /* Función para traer solo los motores con la cantidad de litros del auto */
        const fetchFilteredMotors = async (litros) => {
            try {
                const response = await fetch(`http://localhost:3000/admin/motor`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    // Filtrar los motores que coinciden con el numero_litros del auto seleccionado
                    const filteredMotors = data.data.filter(motor => motor.numero_litros === litros);
                    setAssignAutoMotores(filteredMotors); // Asignamos los motores filtrados
                } else {
                    setErrorAssignMessage(data.msj);
                }
            } catch (error) {
                setErrorAssignMessage('Error al obtener los motores.');
            }
        };
    
        /* Función para la petición de la información del auto a asignar motores */
        const fetchAutoData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/autos/${autoId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const autoData = data.data;
                    setAutoToAssign(autoData);
                    setAssignAutoId(autoData.id_auto);
                    setAssignAutoSubmarca(autoData.submarca);
                    setAssignAutoModelo(autoData.modelo);
                    setAssignAutoLitros(autoData.litros);
                    setSelectedAssignMarcaId(autoData.marca_id);
                    setSelectedAssignMarca(autoData.marca.marca);
    
                    // Asignar los motores seleccionados
                    const selectedMotorIds = autoData.motores.map(motor => motor.id_motor);
                    setSelectedMotors(selectedMotorIds); // Aquí guardamos los motores asignados
    
                    setSuccessAssignMessage(data.msj);
                    fetchFilteredMotors(autoData.litros); // Filtrar los motores con la cantidad de litros del auto
                    setShowAssignModal(true);
                } else {
                    setErrorAssignMessage(data.msj);
                }
            } catch (error) {
                setErrorAssignMessage('No se pudo obtener la información del auto seleccionado');
            }
        };
    
        fetchAutoData(autoId);
    };
    
    // Función para asignarle al auto sus motores
    const handleAssignAuto = async (event) => {
        event.preventDefault();
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        // Verificar si hay motores seleccionados
        const motorIdsToSend = selectedMotors.length > 0 ? selectedMotors : [""]; // Enviar [""] si no hay motores seleccionados
    
        try {
            const response = await fetch(`http://localhost:3000/admin/autos/${autoToAssign.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_auto: assignAutoId,
                    submarca: assignAutoSubmarca,
                    modelo: assignAutoModelo,
                    litros: parseFloat(assignAutoLitros),
                    marca_id: parseInt(selectedAssignMarcaId),
                    motor_ids: motorIdsToSend  // Aquí enviamos [""] si no hay motores seleccionados
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccessAssignMessage(data.msj);
                fetchAutos(); // Fetch the updated list of autos
                closeAssignModal();
            } else {
                setErrorAssignMessage(data.msj);
            }
        } catch (error) {
            setErrorAssignMessage('Error al editar auto');
        }
    };

    // Función para seleccionar los motores
    const handleMotorSelect = (selectedOptions) => {
        const selectedMotorIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedMotors(selectedMotorIds);
    };

    // Función para optener los motores disponibles para opción
    const getMotorOptions = () => {
        return assignAutoMotores.map(motor => ({
            value: motor.id_motor,
            label: `Motor ID: ${motor.id_motor}`,
            dataTooltip: `Litros: ${motor.numero_litros}, Árbol: ${motor.tipo_arbol}, Válvulas: ${motor.numero_valvulas}, Pistones: ${motor.numero_pistones}, Info Adicional: ${motor.info_adicional.join(', ')}`
        }));
    };

    // Cerrar el modal para asignarle al auto sus motores
    const closeAssignModal = () => { 
        setAutoToAssign('');
        setAssignAutoId('');
        setAssignAutoSubmarca('');
        setAssignAutoModelo('');
        setAssignAutoLitros('');
        setSelectedAssignMarca('');  // Para almacenar el nombre de la marca
        setSelectedAssignMarcaId('');  // Para almacenar el id de la marca
        setAssignAutoMotores([]);
        setSelectedMotors([]);
        setShowAssignModal(false);
    };

    /* ------- Componente de administrar autos */
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
                        <li><NavLink to="/admin/juntasg">Administrar GasketGenius</NavLink></li>
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
                        {Object.keys(errorEditMessage || {}).length > 0 && (
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

                        {successAssignMessage && <div className="assign-success-message-auto">{successAssignMessage}</div>}
                        {Object.keys(errorAssignMessage || {}).length > 0 && (
                            <div className="assign-error-message-auto">
                                {Object.keys(errorAssignMessage).map((key) => (
                                    <span key={key}>{errorAssignMessage[key]}</span> // Muestra cada error
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
                                <tr key={auto.id}>
                                  <td>{auto.id_auto}</td>
                                  <td>{auto.submarca}</td>
                                  <td>{auto.modelo}</td>
                                  <td>{auto.litros}</td>
                                  {/* Verificar que auto.marca no sea null o undefined */}
                                  <td>{auto.marca ? auto.marca.marca : 'Sin marca'}</td>
                                  <td className="auto-options-cell">
                                    <button 
                                      className="auto-edit-button"
                                      onClick={() => openEditModal(auto.id)}
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      className="auto-assign-button"
                                      onClick={() => openAssignModal(auto.id)}
                                    >
                                      Motores
                                    </button>
                                    <button 
                                      className="auto-delete-button" 
                                      onClick={() => openDeleteModal(auto.id)}
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
                        <p>¿Estás seguro de que deseas eliminar "{autos.find(auto => auto.id === autoToDelete)?.id_auto}"?</p>
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
                            type="number" 
                            placeholder="Modelo del auto" 
                            value={newAutoModelo} 
                            onChange={handleNewAutoModeloChange}
                        />
                        <input 
                            type="number" 
                            placeholder="Litros del auto" 
                            value={newAutoLitros} 
                            onChange={handleNewAutoLitrosChange}
                        />

                        <input 
                            list="marcas" 
                            placeholder="Seleccione una marca" 
                            value={selectedNewMarca}  // Muestra el valor de la marca seleccionada
                            onChange={handleNewAutoMarcaChange}  // Actualiza cuando se selecciona una marca
                        />
                        <datalist id="marcas">
                            {newAutoMarca.map((marca) => (
                                <option key={marca.id} value={marca.marca}>
                                    {/* Mostramos solo el nombre de la marca */}
                                </option>
                            ))}
                        </datalist>
                        
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
                            type="number" 
                            placeholder="Litros del auto" 
                            value={editAutoLitros} 
                            onChange={handleEditAutoLitrosChange}
                        />
            
                        <input 
                            list="edit-marcas" 
                            placeholder="Seleccione una marca" 
                            value={selectedEditMarca}  // Muestra el nombre de la marca seleccionada
                            onChange={handleEditAutoMarcaChange}  // Actualiza cuando se selecciona una marca
                        />
                        <datalist id="edit-marcas">
                            {editAutoMarca.map((marca) => (
                                <option key={marca.id} value={marca.marca}>
                                    {/* Mostramos solo el nombre de la marca */}
                                </option>
                            ))}
                        </datalist>
                        
                        <div className="edit-auto-modal-actions">
                            <button className="edit-auto-modal-button cancel" onClick={closeEditModal}>Cancelar</button>
                            <button className="edit-auto-modal-button confirm" onClick={handleEditAuto}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignModal && (
                <div className="assign-auto-modal-overlay">
                    <div className="assign-auto-modal-content">
                        <h2>Motores para {autoToAssign?.id_auto}</h2>
            
                        {/* Detalles del auto */}
                        <div className="assign-auto-detail">
                            <label>Identificador:</label>
                            <span className="assign-auto-value">{assignAutoId}</span>
                        </div>
                        <div className="assign-auto-detail">
                            <label>Submarca del auto:</label>
                            <span className="assign-auto-value">{assignAutoSubmarca}</span>
                        </div>
                        <div className="assign-auto-detail">
                            <label>Modelo del auto:</label>
                            <span className="assign-auto-value">{assignAutoModelo}</span>
                        </div>
                        <div className="assign-auto-detail">
                            <label>Litros del auto:</label>
                            <span className="assign-auto-value">{assignAutoLitros}</span>
                        </div>
                        <div className="assign-auto-detail">
                            <label>Marca del auto:</label>
                            <span className="assign-auto-value">{selectedAssignMarca}</span>
                        </div>
            
                        {/* React Select para elegir motores */}
                        <Select
                            className="select-motores"
                            classNamePrefix="select-motores"
                            isMulti
                            value={getMotorOptions().filter(option => selectedMotors.includes(option.value))}
                            options={getMotorOptions()}
                            onChange={handleMotorSelect}
                            placeholder="Seleccionar motores"
                            formatOptionLabel={(motorOption) => (
                                <div>
                                    <span data-tooltip-id={`motor-${motorOption.value}`}>
                                        {motorOption.label}
                                    </span>
                                    <Tooltip id={`motor-${motorOption.value}`} effect="solid">
                                        {motorOption.dataTooltip}
                                    </Tooltip>
                                </div>
                            )}
                        />
                            
                        {/* Mostrar los motores seleccionados */}
                        <div className="assign-auto-detail">
                            <label>Motores seleccionados:</label>
                            <input
                                type="text"
                                value={selectedMotors.join(', ')}
                                readOnly
                            />
                        </div>
                            
                        {/* Acciones del modal */}
                        <div className="assign-auto-modal-actions">
                            <button className="assign-auto-modal-button cancel" onClick={closeAssignModal}>Cancelar</button>
                            <button className="assign-auto-modal-button confirm" onClick={handleAssignAuto}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarAutosAdmin;                           