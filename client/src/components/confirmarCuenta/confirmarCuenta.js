import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./confirmarCuenta.css";

const ConfirmarCuenta = () => {
    const { token } = useParams(); // Captura el token desde la URL
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate(); // Para redirigir al usuario

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                const response = await fetch(`http://localhost:3000/auth/confirmar/${token}`, {
                    method: 'GET',
                    credentials: 'include', // Incluir cookies si es necesario
                });
    
                console.log('Response status:', response.status); // Verificar el código de estado
                console.log('Response ok:', response.ok); // Verificar si response.ok es true
    
                const data = await response.json();
                console.log('Response data:', data); // Verificar el contenido de la respuesta
    
                if (response.ok) {
                    setMensaje(data.msg || 'Cuenta confirmada exitosamente. Puedes iniciar sesión.');
                } else {
                    setMensaje(data.msg || 'Hubo un error al confirmar tu cuenta.');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                setMensaje(error.message || 'Hubo un error al conectar con el servidor.');
            }
        };
    
        confirmarCuenta();
    }, [token]);

    const handleButtonClick = () => {
        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    };
    

    return (
        <div className="confirmacion-view">
            <div className="confirmacion-content">
                <h1>Confirmación de Cuenta</h1>
                <p>{mensaje}</p>
                <button className="confirmacion-button" onClick={handleButtonClick}>
                    {mensaje.includes('exitosamente') ? 'Iniciar Sesión' : 'Regresar'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmarCuenta;
