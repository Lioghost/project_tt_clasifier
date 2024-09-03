import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./confirmarCuenta.css";

const ConfirmarCuenta = () => {
    const { token } = useParams(); // Captura el token desde la URL
    const [mensaje, setMensaje] = useState('');
    const [solicitudHecha, setSolicitudHecha] = useState(false); // Nuevo estado para controlar la solicitud
    const navigate = useNavigate(); // Para redirigir al usuario

    useEffect(() => {
        if (solicitudHecha) return; // Evita que la solicitud se haga más de una vez

        const confirmarCuenta = async () => {
            try {
                const response = await fetch(`http://localhost:3000/auth/confirmar/${token}`, {
                    method: 'GET',
                    credentials: 'include', // Incluir cookies si es necesario
                });

                console.log('Response status:', response.status); // Verifica el código de estado
                console.log('Response ok:', response.ok); // Verifica si response.ok es true

                if (response.ok) {
                    const data = await response.json();
                    setMensaje(data.msg || 'Cuenta confirmada exitosamente. Puedes iniciar sesión.');
                    setSolicitudHecha(true); // Marca la solicitud como hecha
                } else {
                    setMensaje('Hubo un error al confirmar tu cuenta.');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                setMensaje('Hubo un error al conectar con el servidor.');
            }
        };

        confirmarCuenta();
    }, [token, solicitudHecha]);

    const handleButtonClick = () => {
        navigate('/login');
    };

    return (
        <div className="confirmacion-view">
            <div className="confirmacion-content">
                <h1>Confirmación de Cuenta</h1>
                <p>{mensaje}</p>
                <button className="confirmacion-button" onClick={handleButtonClick}>
                    {mensaje.includes('exitosamente') ? 'Iniciar Sesión' : 'Volver al Inicio'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmarCuenta;
