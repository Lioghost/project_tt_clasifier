import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Dashboard.css';
import './Catalogo.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import motor from "../../../assets/img/motors.png";
import mecanic from "../../../assets/img/mecanic.png";
import profile from "../../../assets/img/profile.png";

const AdminCatalogo = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar, dropdown y mensaje de error o éxito
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para los filtros
    const [marca, setMarca] = useState('');
    const [submarca, setSubmarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [litros, setLitros] = useState('');
    const [autos, setAutos] = useState([]);

    // Petición de ejemplo para obtener las opciones de los filtros
    const [marcasOptions, setMarcasOptions] = useState([]);
    const [submarcasOptions, setSubmarcasOptions] = useState([]);
    const [modelosOptions, setModelosOptions] = useState([]);
    const [litrosOptions, setLitrosOptions] = useState([]);
    const [motors, setMotors] = useState([]);
    const [juntas, setJuntas] = useState([]);

    // Para el modal de ls información
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [juntaInfo, setJuntaInfo] = useState([]); // Estado para almacenar la información de la junta

    const fetchMarcas = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/marcas', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role, 
                    'Authorization': `Bearer ${token}`  // Asegúrate de tener el token disponible
                }
            });
            const data = await response.json();
            if (response.ok) {
                const sortedBrands = data.data.sort((a, b) => a.marca.localeCompare(b.marca));
                setMarcasOptions(sortedBrands);  // Guardar las marcas ordenadas
                setSuccessMessage(data.msj);
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('Error al recuperar marcas.');
        }
    };

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
                setAutos(data.data); // Guardar los autos en el estado
            } else {
                setErrorMessage(data.msj);
            }
        } catch (error) {
            setErrorMessage('Error al recuperar los autos.');
        }
    }

    useEffect(() => {
        // Solo filtrar si al menos se ha seleccionado la marca
        let filteredAutos = autos;
        
        // Filtrar por marca si hay una marca seleccionada
        if (marca) {
            filteredAutos = filteredAutos.filter(auto => auto.marca.marca.toLowerCase() === marca.toLowerCase());
        }
        
        // Filtrar por submarca si hay una submarca seleccionada
        if (submarca) {
            filteredAutos = filteredAutos.filter(auto => auto.submarca.toLowerCase() === submarca.toLowerCase());
        }
        
        // Filtrar por modelo si hay un modelo seleccionado
        if (modelo) {
            filteredAutos = filteredAutos.filter(auto => auto.modelo === modelo);
        }
        
        // Filtrar por litros si hay una selección de litros
        if (litros) {
            filteredAutos = filteredAutos.filter(auto => auto.litros.toString() === litros); // Comparar como string para evitar problemas de tipo
        }
        
        // Obtener los motores de los autos filtrados, guardando tanto el id como el id_motor
        let filteredMotores = filteredAutos.flatMap(auto => 
            auto.motores.map(motor => ({
                id: motor.id, 
                id_motor: motor.id_motor
            }))
        );
        
        // Eliminar duplicados basados en el id del motor
        const uniqueMotors = filteredMotores.filter((motor, index, self) =>
            index === self.findIndex((m) => m.id === motor.id)
        );
    
        setMotors(uniqueMotors);  // Actualizar los motores filtrados sin duplicados
    
    }, [marca, submarca, modelo, litros, autos]);

    // Actualización de submarcas basadas en la marca seleccionada
    useEffect(() => {
        if (marca) {
            const filteredAutos = autos.filter(auto => auto.marca.marca.toLowerCase() === marca.toLowerCase());
            const uniqueSubmarcas = [...new Set(filteredAutos.map(auto => auto.submarca))];
            setSubmarcasOptions(uniqueSubmarcas);
            setSubmarca('');  // Limpiar submarca seleccionada
            setModelo('');    // Limpiar modelo seleccionado
            setLitros('');    // Limpiar litros seleccionados
        } else {
            setSubmarcasOptions([]);
            setModelo('');
            setLitros('');
        }
    }, [marca, autos]);

    // Actualización de modelos basadas en la submarca seleccionada
    useEffect(() => {
        if (submarca) {
            const filteredAutos = autos.filter(auto => auto.submarca.toLowerCase() === submarca.toLowerCase());
            const uniqueModelos = [...new Set(filteredAutos.map(auto => auto.modelo))];
            setModelosOptions(uniqueModelos);
            setModelo('');  // Limpiar modelo seleccionado
            setLitros('');  // Limpiar litros seleccionados
        } else {
            setModelosOptions([]);
            setLitros('');
        }
    }, [submarca, autos]);

    // Actualización de litros basados en el modelo seleccionado
    useEffect(() => {
        if (modelo) {
            const filteredAutos = autos.filter(auto => auto.modelo === modelo && auto.submarca.toLowerCase() === submarca.toLowerCase());
            const uniqueLitros = [...new Set(filteredAutos.map(auto => auto.litros.toString()))];
            setLitrosOptions(uniqueLitros);  // Actualizar opciones de litros
            setLitros('');  // Limpiar selección de litros cuando cambie el modelo
        } else {
            setLitrosOptions([]);
        }
    }, [modelo, submarca, autos]);

    const handleMotorSelect = async (motor) => {
        const { id, id_motor } = motor;
        
        try {
            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:3000/admin/motor/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const motorData = await response.json();
                
                // Asegúrate de que estás accediendo a `motorData.data.juntas`
                if (motorData.data && motorData.data.juntas && motorData.data.juntas.length > 0) {
                    setJuntas(motorData.data.juntas);  // Guardamos las juntas en el estado si existen
                } else {
                    setJuntas([]);  // Si no hay juntas, lo ponemos como vacío
                }
    
                setSuccessMessage(`Motor ${id_motor} seleccionado con éxito.`);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.msj}`);
            }
        } catch (error) {
            setErrorMessage('Error al obtener información del motor.');
        }
    };    

    // Para obtener la información de la GasketGenius
    const handleJuntaInfo = async (id_junta) => {
        try {
            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');
    
            const response = await fetch(`http://localhost:3000/admin/juntas-ms/${id_junta}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const juntaData = await response.json();
                setJuntaInfo(juntaData.data); // Guardar la información de la junta
                setIsModalOpen(true); // Abrir el modal
            } else {
                setErrorMessage('Error al obtener información de la junta.');
            }
        } catch (error) {
            setErrorMessage('Error al realizar la petición de junta.');
        }
    };

    // Verificar si el usuario está autenticad
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchMarcas();
            fetchAutos();
        }
    }, [isAuthenticated, navigate]);

    // Funciones para el sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Funciones para el dropdown del perfil de usuario
    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                    <h1>Catálogo de GasketGenius</h1>

                    {/* Filtro para el automóvil */}
                    <div className="car-filter">
                        <label>Filtra tu automóvil:</label>
                        
                        <select name="marca" className="car-filter-select" value={marca} onChange={(e) => setMarca(e.target.value)}>
                            <option value="">Marca</option>
                            {marcasOptions.map(marca => (
                                <option key={marca.id} value={marca.marca}>{marca.marca}</option>
                            ))}
                        </select>

                        <select name="submarca" className="car-filter-select" value={submarca} onChange={(e) => setSubmarca(e.target.value)}>
                            <option value="">Submarca</option>
                            {submarcasOptions.map((submarcaOption, index) => (
                                <option key={index} value={submarcaOption}>{submarcaOption}</option>
                            ))}
                        </select>

                        <select name="modelo" className="car-filter-select" value={modelo} onChange={(e) => setModelo(e.target.value)}>
                            <option value="">Modelo</option>
                            {modelosOptions.map((modeloOption, index) => (
                                <option key={index} value={modeloOption}>{modeloOption}</option>
                            ))}
                        </select>

                        <select name="litros" className="car-filter-select" value={litros} onChange={(e) => setLitros(e.target.value)}>
                            <option value="">Litros</option>
                            {litrosOptions.map((litrosOption, index) => (
                                <option key={index} value={litrosOption}>{litrosOption}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sección para seleccionar el motor */}
                    <div className="motor-selection">
                        <h2>Selecciona tu motor:</h2>

                        {/* Mensajes de éxito y error */}
                        {successMessage && <div className="get-success-message-user">{successMessage}</div>}
                        {errorMessage && <div className="get-error-message-user">{errorMessage}</div>}

                        <table className="filter-motor-table">
                            <thead>
                                <tr>
                                    <th>Motor</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marca === '' ? (
                                    <tr>
                                        <td colSpan="2" className="empty-filter-motor-message">
                                            <div className="placeholder">
                                                <p>¡Ingresa los datos de tu auto!</p>
                                                <img src={motor} alt="Motor icon" className="filter-motor-placeholder-image" />
                                                <p>Así podrás ver los motores</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    motors.length > 0 ? (
                                        motors.map((motor, index) => (
                                            <tr key={index}>
                                                <td>{motor.id_motor}</td>
                                                <td>
                                                    <button className="button-seleccionar" onClick={() => handleMotorSelect(motor)}>Seleccionar</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="empty-filter-motor-table-message">
                                                <p>No se encontraron motores.</p>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>


                    <div className="juntas-catalogo">
                        <h2>Selecciona una Junta de Cabeza:</h2>
                        {juntas.length > 0 ? (
                            <div className="juntas-grid">
                                {juntas.map(junta => (
                                    <div key={junta.id_junta} className="junta-card">
                                        <img src={`http://localhost:3000/juntas/${junta.id_image}`} alt={`Junta ${junta.id_junta}`} className="junta-image" />
                                        <p>Código: {junta.id_junta}</p>
                                        <button className="junta-info-button" onClick={() => handleJuntaInfo(junta.id_junta)}>
                                            Información
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-juntas-message">
                                <h2>¡Lo sentimos!</h2>
                                <img src={mecanic} alt="Imagen mecánico" />
                                <p>Registraremos GasketGenius para este motor.</p>
                            </div>
                        )}
                    </div>

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Información de la Junta</h2>
                                <table className="junta-info-table">
                                    <thead>
                                        <tr>
                                            <th>Código de Marca</th>
                                            <th>Marca Refacción</th>
                                            <th>Enlace</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {juntaInfo.map((info) => (
                                            <tr key={info.id}>
                                                <td>{info.id_cod_marca}</td>
                                                <td>{info.marca_refac}</td>
                                                <td>
                                                    <a href={info.url_marca} target="_blank" rel="noopener noreferrer">
                                                        Ver Detalles
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}

                </section>
            </main>
        </div>
    );
};

export default AdminCatalogo;