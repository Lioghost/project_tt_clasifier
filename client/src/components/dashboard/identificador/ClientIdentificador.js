import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import '../Dashboard.css';
import './Identificador.css'; 
import LogoutButton from '../../logout/LogoutButton';
import { AuthContext } from '../../../context/AuthContext';
import logo from "../../../assets/img/header-logo.png";
import profile from "../../../assets/img/profile.png";
import JuntaEjemplo from "../../../assets/img/junta-ejemplo.jpg";
import checkIcon from "../../../assets/img/check-icon.png";
import noResultsIcon from "../../../assets/img/no-results-icon.png";

const ClientIdentificador = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados para el sidebar, dropdown y mensaje de error o éxito
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Estados de manejo de la imagen y proceso de verificación
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true); // Estado para mostrar/ocultar instrucciones

    // Estados para mostrar los resultados de las Juntas de Cabeza
    const [showGasketOptions, setShowGasketOptions] = useState(false);
    const [juntas, setJuntas] = useState([]); // Array to store gasket results
    const [juntaInfo, setJuntaInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } 
    }, [isAuthenticated, navigate]);

    // Funciones de sidebar y dropdown
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleClick = () => setIsDropdownOpen(!isDropdownOpen);

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

    // Función para manejar la carga de imágenes con DropZone
    const onDrop = acceptedFiles => {
        setImage(URL.createObjectURL(acceptedFiles[0]));
        setIsVerified(false); // Resetea el estado de verificación cuando se sube una nueva imagen
        setShowInstructions(true); // Vuelve a mostrar las instrucciones al subir una nueva imagen
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Función para iniciar el proceso de identificación
    const handleIdentify = () => {
        setIsLoading(true);
        setShowInstructions(false); // Oculta las instrucciones al iniciar el proceso
        // Simulación de solicitud al servidor
        setTimeout(() => {
            setIsLoading(false);
            setIsProcessing(true);
        }, 2000); // Simulación de tiempo de espera
    };

    // Función para verificar la imagen recibida del servidor
    const handleVerifyImage = () => {
        setIsProcessing(false);
        setIsVerifying(true); // Activa el estado de verificación para mostrar el mensaje
        // Simulación de espera en la verificación
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);

            // Resultado de la consulta a la base de datos
            setJuntas([
                /*{ id_junta: 1, id_image: 'junta1.jpg' },
                { id_junta: 2, id_image: 'junta2.jpg' },
                { id_junta: 3, id_image: 'junta3.jpg' },*/
            ]);
        }, 3000); // Simula un tiempo de verificación de 3 segundos
    };

    // Mostrar las opciones de Juntas dde Cabeza si se da en "Continuar"
    const handleContinue = () => setShowGasketOptions(true);

    // Función para manejar la información de la Junta de Cabeza
    const handleJuntaInfo = (juntaId) => {
        // Simulate server data for modal
        setJuntaInfo([
            { id: 1, id_cod_marca: '001', marca_refac: 'Marca A', url_marca: 'http://example.com/1' },
            { id: 2, id_cod_marca: '002', marca_refac: 'Marca B', url_marca: 'http://example.com/2' },
        ]);
        setIsModalOpen(true);
    };

    // Función para subir otra imagen y muestra las instrucciones nuevamente
    const onUploadAnother = () => {
        setImage(null);
        setIsVerified(false);
        setIsProcessing(false);
        setIsVerifying(false);
        setShowInstructions(true); 
        setShowGasketOptions(false);
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
                    <h1>Identificador de GasketGenius</h1>
                </section>

                <div className="image-uploader-container">
                    {/* Mostrar instrucciones si están habilitadas */}
                    {showInstructions && !isVerifying && !isVerified && (
                        <div className="upload-instructions">
                            <h2 className="attention-title">¡ATENCIÓN!</h2>
                            <p className="attention-description">
                                Ingrese una imagen de la Junta de Cabeza, para lograr una asertividad lo más exacta posible, cumpla con las siguientes condiciones:
                            </p>
                            <ul className="conditions-list">
                                <li>De frente con fondo claro y lizo</li>
                                <li>La mayor iluminación posible</li>
                                <li>Imagen de la junta completa, como en el ejemplo</li>
                            </ul>
                            <div className="example-image-container">
                                <img src={JuntaEjemplo} alt="Ejemplo de Junta de Cabeza" className="example-image" />
                            </div>
                        </div>
                    )}

                    {/* Dropzone para cargar la imagen */}
                    {!isLoading && !isProcessing && !isVerifying && !isVerified && (
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            {image ? (
                                <img src={image} alt="Imagen subida" className="uploaded-image" />
                            ) : (
                                <p className="dropzone-placeholder">Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.</p>
                            )}
                        </div>
                    )}

                    {/* Botón de Procesar fuera del Dropzone */}
                    {image && !isLoading && !isProcessing && !isVerified && !isVerifying && (
                        <button onClick={handleIdentify} className="process-button">
                            Procesar
                        </button>
                    )}

                    {/* Mostrar un mensaje de carga mientras se procesa */}
                    {isLoading && (
                        <div className="loading">
                            <p>Espera un momento...</p>
                            <p className="description">Haz ingresado una imagen, estamos procesando la imagen para que la verifiques.</p>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {/* Mostrar la imagen procesada y opciones para verificar o cargar otra imagen */}
                    {isProcessing && (
                        <div className="processing">
                            <p>¡La imagen está lista!</p>
                            <img src={image} alt="Resultado del servidor" className="processed-image" />
                            <div className="button-container">
                                <button onClick={handleVerifyImage} className="verify-button">Verificar imagen</button>
                                <button onClick={onUploadAnother} className="upload-another-button">Subir otra imagen</button>
                            </div>
                        </div>
                    )}

                    {/* Mostrar el mensaje de espera mientras se verifica la imagen */}
                    {isVerifying && (
                        <div className="loading">
                            <p>Espera un momento...</p>
                            <p className="description">Haz verificado una imagen, estamos buscando coincidencias en nuestros registros, podrás continuar cuando hayamos terminado.</p>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {/* Vista de "todo listo" cuando hay coincidencias verificadas */}
                    {isVerified && juntas.length > 0 && !showGasketOptions && (
                        <div className="final-step">
                            <p>¡Todo listo!</p>
                            <p className="description">Hemos encontrado resultados de coincidencias potenciales, ¿listo para verlos?</p>
                            <img src={checkIcon} alt="Verificación exitosa" className="success-icon" />

                            {/* Botones para continuar o subir otra imagen */}
                            <div className="button-container">
                                <button onClick={handleContinue} className="continue-button">Continuar</button>
                                <button onClick={onUploadAnother} className="cancel-button">Cancelar</button>
                            </div>
                        </div>
                    )}

                    {/* Vista de "sin resultados" si no se encuentran juntas */}
                    {isVerified && juntas.length === 0 && (
                        <div className="no-results">
                            <h2>Lo sentimos, no encontramos coincidencias :(</h2>
                            <p>No hemos encontrado resultados de coincidencias potenciales. Es posible que aún no hayamos registrado tu pieza.</p>
                            <img src={noResultsIcon} alt="Sin resultados" className="no-results-icon" />
                            <button onClick={onUploadAnother} className="retry-button">Intentar de nuevo</button>
                        </div>
                    )}

                    {/* Mostrar opciones de juntas si hay resultados */}
                    {isVerified && juntas.length > 0 && showGasketOptions && (
                        <div className="juntas-catalogo">
                            <h2>Selecciona una Junta de Cabeza:</h2>
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
                            <button onClick={onUploadAnother} className="upload-another-button">Subir otra imagen</button>
                        </div>
                    )}

                    {/* Modal con información detallada de la junta */}
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

                </div>
            </main>
        </div>
    );
};

export default ClientIdentificador;