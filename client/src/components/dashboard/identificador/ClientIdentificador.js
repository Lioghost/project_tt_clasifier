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
    const [imageFile, setImageFile] = useState(null); // Almacena el archivo real
    const [imageBinarized, setImageBinarized] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true); // Estado para mostrar/ocultar instrucciones

    // Estado para almacenar el junta_id recibido
    const [juntaId, setJuntaId] = useState(null);

    // Estados para mostrar los resultados de las Juntas de Cabeza
    const [showGasketOptions, setShowGasketOptions] = useState(false);
    const [juntas, setJuntas] = useState([]); // Array to store gasket results
    const [juntaInfo, setJuntaInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [selectedJunta, setSelectedJunta] = useState(null);

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

    // Función para obtener el junta_id
    const fetchJuntaId = async () => {
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/admin/juntas-g-id', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setJuntaId(data.junta_id); // Almacena el junta_id recibido
                console.log(data.junta_id);
            } else {
                console.error('Error al obtener el junta_id');
            }
        } catch (error) {
            console.error('Error al obtener el junta_id', error);
        }
    };

    // Función para manejar la carga de imágenes con DropZone
    const onDrop = acceptedFiles => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file)); // Establece la URL de la imagen
        setImageFile(file); // Establece el archivo real
        setIsVerified(false); // Resetea la verificación cuando se sube una nueva imagen
        setShowInstructions(true); // Muestra las instrucciones nuevamente
    
        fetchJuntaId(); // Hacer la petición para obtener el junta_id cuando se suba una imagen
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Función para iniciar el proceso de identificación
    const handleIdentify = async () => {
        setIsLoading(true);
        setShowInstructions(false); // Oculta las instrucciones al iniciar el proceso
        
        try {
            // Crea un FormData con el juntaId y la imagen cargada en el dropzone
            const formData = new FormData();
            formData.append("id_image", juntaId); // Asegúrate de que juntaId esté disponible
            formData.append("imagen", imageFile); // Asumiendo que imageFile es la imagen del dropzone
    
            // Realiza la solicitud POST al servidor
            const response = await fetch("http://127.0.0.1:5000/test-binarized", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Error en la petición");
            }
    
            // Obtén la respuesta binarizada como un Blob
            const data = await response.blob();
    
            // Crea una URL para la imagen binarizada
            const imageUrl = URL.createObjectURL(data);
    
            // Actualiza el estado con la imagen binarizada
            setImageBinarized(imageUrl);
    
            // Actualiza los estados para mostrar la imagen procesada
            setIsLoading(false);
            setIsProcessing(true); // Si es necesario, puedes agregar más lógica para mostrar que se está procesando
    
        } catch (error) {
            console.error("Error al procesar la imagen:", error);
            setIsLoading(false); // Termina la carga en caso de error
        }
    };

    // Función para verificar la imagen recibida del servidor
    const handleVerifyImage = async () => {
        setIsProcessing(false);
        setIsVerifying(true); // Activa el estado de verificación para mostrar el mensaje
    
        try {
            // Realizamos la petición GET al servidor para la clasificación de la imagen
            const response = await fetch(`http://127.0.0.1:5000/classification/${juntaId}`);
    
            if (!response.ok) {
                throw new Error('Error en la solicitud de clasificación');
            }
    
            // Obtenemos la respuesta de las probabilidades
            const data = await response.json();
    
            // Arreglo con los nombres de los Gaskets
            const gaskets = [
                'GasketGenius_05', 'GasketGenius_06', 'GasketGenius_07', 'GasketGenius_08',
                'GasketGenius_09', 'GasketGenius_10', 'GasketGenius_11', 'GasketGenius_12',
                'GasketGenius_13', 'GasketGenius_14', 'GasketGenius_15', 'GasketGenius_16',
                'GasketGenius_17', 'GasketGenius_18', 'GasketGenius_19'
            ];
    
            // Mapear las probabilidades a los nombres de los Gaskets
            const sortedGaskets = gaskets.map((gasket, index) => ({
                gasketName: gasket,
                probability: data[index] || 0 // Asignamos 0 si no hay valor
            }));
    
            // Realizamos la petición para obtener las juntas
            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');
    
            const juntasResponse = await fetch('http://localhost:3000/admin/juntas-g', {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!juntasResponse.ok) {
                throw new Error('Error en la solicitud de juntas');
            }
    
            const juntasData = await juntasResponse.json();
    
            if (juntasResponse.ok) {
                // Crear un nuevo array con la probabilidad asociada a cada junta
                const juntasConProbabilidad = juntasData.data.map(junta => {
                    // Buscar la probabilidad correspondiente al gasketName de la junta
                    const probabilidad = sortedGaskets.find(
                        gasket => gasket.gasketName === junta.id_junta // Comparar gasketName con id_junta
                    );
                    return {
                        ...junta,  // Mantener los datos originales de la junta
                        probability: probabilidad ? probabilidad.probability : 0 // Asignar la probabilidad, si no la encuentra asigna 0
                    };
                });
    
                // Ordenar las juntas por probabilidad de mayor a menor
                const juntasOrdenadas = juntasConProbabilidad.sort((a, b) => b.probability - a.probability);
    
                // Seleccionar solo las tres juntas con mayor probabilidad
                const top3Juntas = juntasOrdenadas.slice(0, 3);
    
                // Actualizar el estado con las tres juntas más probables
                setJuntas(top3Juntas);  // Directamente asignamos las tres juntas con la probabilidad más alta
                setSuccessMessage(juntasData.msj);  // Usamos `data.msj` para el mensaje de éxito
                setShowGasketOptions(false);
                setIsVerified(true);
                console.log("Datos de las tres juntas con mayor probabilidad:", top3Juntas);
            } else {
                console.error("Error al recuperar las juntas");
            }
    
            setIsVerifying(false);  // Finaliza la verificación
        } catch (error) {
            console.error("Error en la verificación de la imagen o las juntas:", error);
            setIsVerifying(false); // Termina el estado de verificación si ocurre un error
            setIsProcessing(false); // Finaliza el estado de procesamiento en caso de error
        }
    };
    
    // Mostrar las opciones de Juntas de Cabeza si se da en "Continuar"
    const handleContinue = async () => {
        setShowGasketOptions(true);
        setIsVerified(true);
    };

    const handleJuntaInfo = async (id_junta) => {
        try {
            const role = localStorage.getItem('role');
            const token = localStorage.getItem('token');
    
            const response = await fetch(`http://localhost:3000/shared/juntas-ms/${id_junta}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Role': role,
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const juntaData = await response.json();
                setJuntaInfo(juntaData.data); // Guardar la información de la junta
                setSuccessMessage('Información de la junta obtenida con éxito.');
                setIsModalOpen(true); // Abrir el modal
            } else if (response.status === 404) {
                setErrorMessage('Información aún no disponible.');
            }
        } catch (error) {
            setErrorMessage('Información aún no disponible.');
        }
    };

    // Función para subir otra imagen y muestra las instrucciones nuevamente
    const onUploadAnother = async () => {
        // Asegurarse de que juntaId esté disponible antes de realizar la solicitud DELETE
        if (juntaId) {
            try {
                // Realizar la petición DELETE al servidor para eliminar la junta
                const response = await fetch(`http://127.0.0.1:5000/classification/${juntaId}`, {
                    method: 'DELETE'
                });
    
                if (!response.ok) {
                    throw new Error('Error al eliminar la junta');
                }
    
                // Si la eliminación fue exitosa, mostrar un mensaje
                console.log('ID de la Junta eliminada exitosamente del servidor de Python.');
            } catch (error) {
                console.error('Error en la solicitud DELETE:', error);
            }
        }
    
        // Restablecer los estados
        setImage(null);
        setIsVerified(false);
        setIsProcessing(false);
        setIsVerifying(false);
        setShowInstructions(true); 
        setShowGasketOptions(false);
    };

    const openModalImage = (junta) => {
        setSelectedJunta(junta);
        setIsModalImageOpen(true);
    };

    const closeModal = () => {
        setIsModalImageOpen(false);
        setSelectedJunta(null);
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
                        <li><NavLink to="/client/dashboard">Inicio</NavLink></li> 
                        <li><NavLink to="/client/catalogo">Catálogo</NavLink></li>
                        <li><NavLink to="/client/identificador">Identificador</NavLink></li>
                        <li><NavLink to="/client/cuenta">Administrar cuenta</NavLink></li>
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
                                <li>Formato de imagen: .jpg, .jpeg, .png</li>
                                <li>Utilice una escala 9:16 y 16MP</li>
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

                    {/* Mostrar la imagen binarizada procesada y las opciones */}
                    {isProcessing && imageBinarized && (
                        <div className="processing">
                            <p>¡La imagen está lista!</p>
                            <img src={imageBinarized} alt="Resultado del servidor" className="processed-image" />
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

                            {successMessage && <div className="get-success-message-user">{successMessage}</div>}
                            {errorMessage && <div className="get-error-message-user">{errorMessage}</div>}

                            <div className="juntas-grid">
                                {juntas.map(junta => (
                                    <div key={junta.id_junta} className="junta-card">
                                        <img
                                            src={`http://localhost:3000/juntas/${junta.id_image}`}
                                            alt={`Junta ${junta.id_junta}`}
                                            className="junta-image"
                                            onClick={() => openModalImage(junta)}
                                        />
                                        <p>Código: {junta.id_junta}</p>
                                        <p>Probabilidad: {junta.probability}</p> {/* Mostrar la probabilidad con todos los decimales */}
                                        <button 
                                            className="junta-info-button" 
                                            onClick={() => handleJuntaInfo(junta.id_junta)}
                                        >
                                            Información
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={onUploadAnother} className="upload-another-button">
                                Subir otra imagen
                            </button>
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

                    {isModalImageOpen && selectedJunta && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={`http://localhost:3000/juntas/${selectedJunta.id_image}`}
                                    alt={`Junta ${selectedJunta.id_junta}`}
                                    className="modal-image"
                                />
                                <button className="modal-close-button" onClick={closeModal}>
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