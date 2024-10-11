import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip'; // Cambia esta línea
import '../Dashboard.css';
import './administrarMotores.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";

const AdministrarMotoresAdmin = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar y dropdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Estados para mostrar los motores
    const [motores, setMotores] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Para eliminar motor */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [motorToDelete, setMotorToDelete] = useState('');
    const [successDeleteMessage, setSuccessDeleteMessage] = useState('');
    const [errorDeleteMessage, setErrorDeleteMessage] = useState('');

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

    /* Para editar motor */
    const [showEditModal, setShowEditModal] = useState(false);
    const [motorToEdit, setMotorToEdit] = useState('');
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

    /* Para asignarle al motor sus juntas GasketGenius */
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [motorToAssign, setMotorToAssign] = useState('');
    const [assignMotorId, setAssignMotorId] = useState('');
    const [assignMotorLitros, setAssignMotorLitros] = useState('');
    const [assignMotorArbol, setAssignMotorArbol] = useState('');
    const [assignMotorValvulas, setAssignMotorValvulas] = useState('');
    const [assignMotorPosicionPistones, setAssignMotorPosicionPistones] = useState('');
    const [assignMotorNoPistones, setAssignMotorNoPistones] = useState('');
    const [assignMotorInfoAdicional, setAssignMotorInfoAdicional] = useState([]);
    const [assignMotorRangeYearI, setAssignMotorRangeYearI] = useState('');
    const [assignMotorRangeYearF, setAssignMotorRangeYearF] = useState('');
    const [assignMotorJuntasg, setAssignMotorJuntasG] = useState([]); // Para mostrar los motores disponibles
    const [selectedJuntasg, setSelectedJuntasg] = useState([]); // Para mostrar los motores seleccionados
    const [successAssignMessage, setSuccessAssignMessage] = useState('');
    const [errorAssignMessage, setErrorAssignMessage] = useState('');

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

    // Mostrar mensajes de éxito o error al asignarle al motor sus juntas
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

    /* ------- Para mostrar los motores */
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
                // Ordenar los motores alfabéticamente por 'id_motor'
                const sortedMotores = data.data.sort((a , b) => a.id_motor.localeCompare(b.id_motor));
                setMotores(sortedMotores);
                setSuccessMessage(data.msj)
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('No hay motores para mostrar');
        }
    };

    // Obtener la lista de motores al cargar la página
    useEffect(() => {
        fetchMotores();
    }, []);

    /* Para eliminar motor */
    const openDeleteModal = (AutoId) => {
        setMotorToDelete(AutoId);
        setShowDeleteModal(true);
    };

    // Cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setMotorToDelete('');
    };

    // Función para eliminar motor
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
                setSuccessDeleteMessage(data.msg);
                setMotores(motores.filter(motor => motor.id !== motorToDelete));
                setMotorToDelete('');
                fetchMotores(); // Fetch the updated list of motores
            } else {
                setErrorDeleteMessage(data.msj);
                console.log(`No se pudo eliminar el motor con id: ${motorToDelete}`);
            }
        } catch (error) {
            setErrorDeleteMessage('Error el eliminar motor');
        } finally {
            setShowDeleteModal(false);
            setMotorToDelete('');
        }
    };

    /* Para agregar motor */
    const openAddModal = () => {
        setShowAddModal(true);
    };

    // Función para agregar motor
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
    
        // Validar y limpiar Información Adicional (Debe ser un array y no debe exceder los 255 caracteres en total)
        const cleanedInfoAdicional = newMotorInfoAdicional
            .split(',')
            .map(item => item.trim())  // Eliminar espacios extras en cada elemento
            .filter(item => item !== '');  // Eliminar elementos vacíos si los hay
    
        if (cleanedInfoAdicional.length === 0) {
            newErrors.newMotorInfoAdicional = 'La información adicional no puede estar vacía.';
        } else if (newMotorInfoAdicional.endsWith(',')) {
            newErrors.newMotorInfoAdicional = 'La información adicional no debe terminar con una coma.';
        } else if (cleanedInfoAdicional.join(', ').length > 255) {
            newErrors.newMotorInfoAdicional = 'La información adicional no puede exceder los 255 caracteres.';
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
                    numero_litros: parseFloat(newMotorLitros),
                    tipo_arbol: newMotorArbol,
                    numero_valvulas: parseInt(newMotorValvulas),
                    posicion_pistones: newMotorPosicionPistones,
                    numero_pistones: parseInt(newMotorNoPistones),
                    info_adicional: cleanedInfoAdicional,
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
    
    // Funciones para agregar motor
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

    const handleNewMotorInfoAdicionalChange = (e) => {
        setNewMotorInfoAdicional(e.target.value);
    };
    
    const handleNewMotorRangeYearIChange = (e) => {
        setNewMotorRangeYearI(e.target.value);
    };

    const handleNewMotorRangeYearFChange = (e) => {
        setNewMotorRangeYearF(e.target.value);
    };

    // Cerrar el modal de agregar motor
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

    /* Para editar motor */
    const openEditModal = (motorId) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        /* Función para la petición de la información del auto a editar */
        const fetchMotorData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/motor/${motorId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const motorData = data.data;
                    setMotorToEdit(motorData);
                    setEditMotorId(motorData.id_motor);
                    setEditMotorLitros(motorData.numero_litros);
                    setEditMotorArbol(motorData.tipo_arbol);
                    setEditMotorValvulas(motorData.numero_valvulas);
                    setEditMotorPosicionPistones(motorData.posicion_pistones);
                    setEditMotorNoPistones(motorData.numero_pistones);
                    setEditMotorInfoAdicional(motorData.info_adicional.join(", "));
                    setEditMotorRangeYearI(motorData.range_year_i);
                    setEditMotorRangeYearF(motorData.range_year_f);

                    setShowEditModal(true);
                } else {
                    setErrorEditMessage(data.msj);
                }
            } catch (error) {
                setErrorEditMessage('No se pudo obtener la información del motor seleccionado para editar.');
            }
        };

        fetchMotorData(motorId)
    };
    
    // Cerrar el modal de editar motor
    const closeEditModal = () => {
        setEditMotorId('');
        setMotorToEdit('');
        setShowEditModal(false);
    };

    // Funciones para editar motor
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
        setEditMotorInfoAdicional(e.target.value);
    };
    
    const handleEditMotorRangeYearIChange = (e) => {
        setEditMotorRangeYearI(e.target.value);
    };
    
    const handleEditMotorRangeYearFChange = (e) => {
        setEditMotorRangeYearF(e.target.value);
    };

    // Función para editar motor
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
    
        // Validar y limpiar Información Adicional (Debe ser un array y no debe exceder los 255 caracteres en total)
        const cleanedInfoAdicional = editMotorInfoAdicional
            .split(',')
            .map(item => item.trim())  // Eliminar espacios extras en cada elemento
            .filter(item => item !== '');  // Eliminar elementos vacíos si los hay
    
        if (cleanedInfoAdicional.length === 0) {
            newErrors.editMotorInfoAdicional = 'La información adicional no puede estar vacía.';
        } else if (editMotorInfoAdicional.endsWith(',')) {
            newErrors.editMotorInfoAdicional = 'La información adicional no debe terminar con una coma.';
        } else if (cleanedInfoAdicional.join(', ').length > 255) {
            newErrors.editMotorInfoAdicional = 'La información adicional no puede exceder los 255 caracteres.';
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
            const response = await fetch(`http://localhost:3000/admin/motor/${motorToEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_motor: editMotorId,
                    numero_litros: parseFloat(editMotorLitros),
                    tipo_arbol: editMotorArbol,
                    numero_valvulas: parseInt(editMotorValvulas),
                    posicion_pistones: editMotorPosicionPistones,
                    numero_pistones: parseInt(editMotorNoPistones),
                    info_adicional: cleanedInfoAdicional,  // Enviamos el array limpio
                    range_year_i: editMotorRangeYearI,
                    range_year_f: editMotorRangeYearF
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessEditMessage(data.msg);
                fetchMotores(); // Refresca la lista de motores
                closeEditModal();
            } else {
                setErrorEditMessage(data.msg);
            }
        } catch (error) {
            setErrorEditMessage('Error al editar motor');
        }
    };

    /* ------- Para asignarle al motor sus juntas GasketGenius */
    const openAssignModal = (motorId) => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');
    
        /* Función para traer las juntas GasketGenius */
        const fetchJuntasG = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/juntas-g`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    // Filtrar las juntas GasketGenius en orden alfabetico
                    const filteredJuntasG = data.data.sort((a, b) => a.id_junta.localeCompare(b.id_junta));
                    setAssignMotorJuntasG(filteredJuntasG); // Asignamos los motores filtrados
                } else {
                    setErrorAssignMessage(data.msj);
                }
            } catch (error) {
                setErrorAssignMessage('Error al obtener las Juntas GasketGenius.');
            }
        };
    
        /* Función para la petición de la información del motor a asignar juntas GasketGenius */
        const fetchMotorData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/motor/${motorId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Role': role,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const motorData = data.data;
                    setMotorToAssign(motorData);
                    setAssignMotorId(motorData.id_motor);
                    setAssignMotorLitros(motorData.numero_litros);
                    setAssignMotorArbol(motorData.tipo_arbol);
                    setAssignMotorValvulas(motorData.numero_valvulas);
                    setAssignMotorPosicionPistones(motorData.posicion_pistones);
                    setAssignMotorNoPistones(motorData.numero_pistones);
                    setAssignMotorInfoAdicional(motorData.info_adicional.join(", "));
                    setAssignMotorRangeYearI(motorData.range_year_i);
                    setAssignMotorRangeYearF(motorData.range_year_f);

                    /* Asignar las GasketGenius seleccionadas */
                    const selectedJuntasgIds = motorData.juntas.map(juntag => juntag.id_junta);
                    setSelectedJuntasg(selectedJuntasgIds);
    
                    setSuccessAssignMessage(data.msj);
                    fetchJuntasG();
                    setShowAssignModal(true);
                } else {
                    setErrorAssignMessage(data.msj);
                }
            } catch (error) {
                setErrorAssignMessage('No se pudo obtener la información del motor seleccionado para asignar Juntas GasketGenius.');
            }
        };
    
        fetchMotorData(motorId);
    };

    // Función para asignarle al auto sus motores
    const handleAssignMotor = async (event) => {
        event.preventDefault();
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        // Verificar si hay GasketGenius seleccionadas
        const juntasgIdsToSend = selectedJuntasg.length > 0 ? selectedJuntasg : [""]; // Enviar [""] si no hay GasketGenius seleccionadas
        const cleanedInfoAdicional = assignMotorInfoAdicional
            .split(',')
            .map(item => item.trim())  // Eliminar espacios extras en cada elemento
            .filter(item => item !== '');  // Eliminar elementos vacíos si los hay

        try {
            const response = await fetch(`http://localhost:3000/admin/motor/${motorToAssign.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_motor: assignMotorId,
                    numero_litros: parseFloat(assignMotorLitros),
                    tipo_arbol: assignMotorArbol,
                    numero_valvulas: parseInt(assignMotorValvulas),
                    posicion_pistones: assignMotorPosicionPistones,
                    numero_pistones: parseInt(assignMotorNoPistones),
                    info_adicional: cleanedInfoAdicional,
                    range_year_i: assignMotorRangeYearI,
                    range_year_f: assignMotorRangeYearF,
                    junta_ids: juntasgIdsToSend // Aquí enviamos [""] si no hay motores seleccionados
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccessAssignMessage(data.msj);
                fetchMotores(); // Fetch the updated list of autos
                closeAssignModal();
            } else {
                setErrorAssignMessage(data.msj);
            }
        } catch (error) {
            setErrorAssignMessage('Error al editar motor');
        }
    };

    // Función para seleccionar los motores
    const handleJuntagSelect = (selectedOptions) => {
        const selectedJuntagIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedJuntasg(selectedJuntagIds);
    };

    // Función para optener los motores disponibles para opción
    const getJuntasgOptions = () => {
        return assignMotorJuntasg.map(juntag => ({
            value: juntag.id_junta,
            label: `GaskeyGenius ID: ${juntag.id_junta}`,
            dataTooltip: `Imagen: ${juntag.id_image}`
        }));
    };

    // Cerrar el modal para asignarle al auto sus motores
    const closeAssignModal = () => { 
        setMotorToAssign('');
        setAssignMotorId('');
        setAssignMotorLitros('');
        setAssignMotorArbol('');
        setAssignMotorValvulas('');
        setAssignMotorPosicionPistones('');
        setAssignMotorNoPistones('');
        setAssignMotorInfoAdicional([]);
        setAssignMotorRangeYearI('');
        setAssignMotorRangeYearF('');
        setAssignMotorJuntasG([]); // Para mostrar las juntas GasketGenius disponibles
        setSelectedJuntasg([]);
        setShowAssignModal(false);
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

                        {successAssignMessage && <div className="assign-success-message-motor">{successAssignMessage}</div>}
                        {Object.keys(errorAssignMessage || {}).length > 0 && (
                            <div className="assign-error-message-motor">
                                {Object.keys(errorAssignMessage).map((key) => (
                                    <span key={key}>{errorAssignMessage[key]}</span> // Muestra cada error
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
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {motores.map((motor) => (
                              <tr key={motor.id}>
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
                                        onClick={() => openEditModal(motor.id)}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="motor-assign-button"
                                        onClick={() => openAssignModal(motor.id)}
                                    >
                                        GasketGenius
                                    </button>
                                    <button
                                        className="motor-delete-button"
                                        onClick={() => openDeleteModal(motor.id)}
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
                        <p>¿Estás seguro de que deseas eliminar "{motores.find(motor => motor.id === motorToDelete)?.id_motor}"?</p>
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
                        type="number" 
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
                      <h2>Editar {motorToEdit?.id_motor}</h2>
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

            {showAssignModal && (
                <div className="assign-motor-modal-overlay">
                    <div className="assign-motor-modal-content">
                        <h2>Motores para {motorToAssign?.id_motor}</h2>
            
                        {/* Detalles del auto */}
                        <div className="assign-motor-detail">
                            <label>Identificador:</label>
                            <span className="assign-motor-value">{assignMotorId}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>Litros:</label>
                            <span className="assign-motor-value">{assignMotorLitros}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>Tipo de Árbol:</label>
                            <span className="assign-motor-value">{assignMotorArbol}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>No. de vávulas:</label>
                            <span className="assign-motor-value">{assignMotorValvulas}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>Pistones y Posición:</label>
                            <span className="assign-motor-value">{assignMotorNoPistones} {assignMotorPosicionPistones}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>Información adicional:</label>
                            <span className="assign-motor-value">{assignMotorInfoAdicional}</span>
                        </div>
                        <div className="assign-motor-detail">
                            <label>Rango de años:</label>
                            <span className="assign-motor-value">{assignMotorRangeYearI} - {assignMotorRangeYearF}</span>
                        </div>

                        {/* React Select para elegir juntas GasketGenius */}
                        <Select
                            className="select-juntas-g"
                            classNamePrefix="select-juntas-g"
                            isMulti
                            value={getJuntasgOptions().filter(option => selectedJuntasg.includes(option.value))}
                            options={getJuntasgOptions()}
                            onChange={handleJuntagSelect}
                            placeholder="Seleccionar GasketGenius"
                            formatOptionLabel={(juntagOption) => (
                                <div>
                                    <span data-tooltip-id={`juntag-${juntagOption.value}`}>
                                        {juntagOption.label}
                                    </span>
                                    <Tooltip id={`juntag-${juntagOption.value}`} effect="solid">
                                        {juntagOption.dataTooltip}
                                    </Tooltip>
                                </div>
                            )}
                        />
                            
                        {/* Mostrar los motores seleccionados */}
                        <div className="assign-motor-detail">
                            <label>GasketGenius seleccionadas:</label>
                            <input
                                type="text"
                                value={selectedJuntasg.join(', ')}
                                readOnly
                            />
                        </div>
                        
                            
                        {/* Acciones del modal */}
                        <div className="assign-motor-modal-actions">
                            <button className="assign-motor-modal-button cancel" onClick={closeAssignModal}>Cancelar</button>
                            <button className="assign-motor-modal-button confirm" onClick={handleAssignMotor}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministrarMotoresAdmin;