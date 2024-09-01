import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./forgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState(''); // Estado para manejar el correo electrónico
    const [mensaje, setMensaje] = useState(''); // Estado para manejar los mensajes de respuesta
    const [solicitudHecha, setSolicitudHecha] = useState(false); // Controla si la solicitud ya fue hecha
    const navigate = useNavigate(); // Para redirigir al usuario

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (solicitudHecha) return; // Evita que la solicitud se haga más de una vez

        try {
            const response = await fetch('http://localhost:3000/auth/olvide-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('Response status:', response.status); // Verifica el código de estado
            console.log('Response ok:', response.ok); // Verifica si response.ok es true

            if (response.ok) {
                const data = await response.json();
                setMensaje(data.msg || 'Hemos enviado un email con las instrucciones para restablecer tu contraseña.');
                setSolicitudHecha(true); // Marca la solicitud como hecha
            } else {
                setMensaje('Hubo un error al enviar el email de recuperación.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setMensaje('Hubo un error al conectar con el servidor.');
        }
    };

    const handleButtonClick = () => {
        navigate('/login');
    };

    return (
        <div className="forgot-password-view">
            <div className="forgot-password-content">
                <h1>Recuperar Contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="forgot-password-button">Enviar</button>
                </form>
                <p>{mensaje}</p>
                <button className="forgot-password-button" onClick={handleButtonClick}>
                    {mensaje.includes('Hemos enviado un email') ? 'Volver al inicio de sesión' : 'Intentar de nuevo'}
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
