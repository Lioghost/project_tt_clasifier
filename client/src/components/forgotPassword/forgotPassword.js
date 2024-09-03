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
                const data = await response.json();
                setMensaje(data.msg || 'Hubo un error al enviar el email de recuperación.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setMensaje('Hubo un error al conectar con el servidor.');
        }

        // Vaciar el campo de correo electrónico después de enviar el formulario
        setEmail("");

        // Hacer que el mensaje desaparezca después de 5 segundos
        setTimeout(() => {
            setMensaje('');
        }, 5000);
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
              <p>{mensaje}</p> {/* El mensaje desaparece después de 5 segundos */}
              <div className="button-group">
                <button type="submit" className="forgot-password-button">
                  Enviar
                </button>
                <button
                  className="forgot-password-button"
                  onClick={handleButtonClick}
                >
                  {mensaje.includes('Hemos enviado un email')
                    ? 'Volver al inicio de sesión'
                    : 'Intentar de nuevo'}
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};

export default ForgotPassword;
