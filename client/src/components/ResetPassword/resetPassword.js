import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./resetPassword.css";

const ResetPassword = () => {
    const { token } = useParams(); // Captura el token desde la URL
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [solicitudHecha, setSolicitudHecha] = useState(false);
    const [tokenValido, setTokenValido] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verificarToken = async () => {
            try {
                const response = await fetch(`http://localhost:3000/auth/olvide-password/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setTokenValido(true);
                } else {
                    setMensaje('El enlace para restablecer la contraseña no es válido o ha expirado.');
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                setMensaje('Hubo un error al conectar con el servidor.');
            }
        };

        verificarToken();
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Resetea el mensaje de error antes de validar

        if (password.length < 12) {
            setErrorMessage('La contraseña debe tener al menos 12 caracteres.');
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        if (!password || !passwordConfirm) {
            setErrorMessage('Ambos campos son obligatorios.');
            return;
        }

        if (solicitudHecha) return;

        try {
            const response = await fetch(`http://localhost:3000/auth/olvide-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje(data.msg || 'Contraseña restablecida correctamente.');
                setSolicitudHecha(true);

                // Inicia la redirección después de mostrar el mensaje
                setTimeout(() => {
                    setRedirect(true);
                }, 3000); // Redirige después de 3 segundos, puedes ajustar este tiempo
            } else {
                setErrorMessage(data.msg || 'Hubo un error al restablecer la contraseña.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setErrorMessage('Hubo un error al conectar con el servidor.');
        }
    };

    useEffect(() => {
        if (redirect) {
            navigate('/login');
        }
    }, [redirect, navigate]);

    return (
        <div className="reset-password-view">
            <div className="reset-password-content">
                <h1>Restablecer Contraseña</h1>
                {tokenValido ? (
                    solicitudHecha ? (
                        <p>{mensaje}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <input 
                                    type="password"
                                    placeholder="Nueva Contraseña (mínimo 12 caracteres)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    type="password"
                                    placeholder="Confirma tu Contraseña"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                />
                            </div>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className="reset-password-button">Restablecer Contraseña</button>
                        </form>
                    )
                ) : (
                    <p>{mensaje}</p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;