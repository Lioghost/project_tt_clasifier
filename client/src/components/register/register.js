import React, { useState } from "react";
import "./register.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};

        // Validación de nombre de usuario
        if (!username) {
            newErrors.username = 'El nombre de usuario es obligatorio.';
        } else if (username.length < 4) {
            newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
        }

        // Validación de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            newErrors.email = 'El correo es obligatorio.';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'El correo tiene un formato inválido.';
        }

        // Validación de nombres y apellidos
        if (!firstName) {
            newErrors.name = 'El nombre es obligatorio.';  // Usamos 'name' porque así lo espera el backend
        }
        if (!lastName) {
            newErrors.lastname = 'El apellido es obligatorio.';  // Usamos 'lastname' porque así lo espera el backend
        }

        // Validación de contraseña
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 12) {
            newErrors.password = 'La contraseña debe ser mínimo de 12 dígitos.';
        }

        // Validación de confirmación de contraseña
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirmar la contraseña es obligatorio.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas deben coincidir.';
        }

        setErrors(newErrors);

        // Si no hay errores, envía los datos al servidor
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3000/auth/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: firstName,        // El campo 'name' coincide con el ID del input
                        lastname: lastName,     // El campo 'lastname' coincide con el ID del input
                        username,               // El campo 'username' coincide con el ID del input
                        email,                  // El campo 'email' coincide con el ID del input
                        password,               // El campo 'password' coincide con el ID del input
                        role: 'Admin',          // Si el rol es dinámico, puedes cambiarlo aquí según sea necesario.
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccessMessage('Registro exitoso. Por favor, revisa tu correo para confirmar tu cuenta.');

                    // Mostrar el mensaje de éxito durante 3 segundos y luego ocultarlo
                    setTimeout(() => {
                        setSuccessMessage('');
                        resetForm();
                    }, 3000);
                } else {
                    setErrors({ form: data.msg || 'Error al registrar usuario.' });
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                setErrors({ form: 'Error al conectar con el servidor.' });
            }
        }
    };

    // Función para restablecer el formulario
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setErrors({});
    };

    return (
        <div className="register-view">
            <div className="register-content">
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
                <div className="register-form">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className={errors.username ? 'error' : ''}>Nombre de usuario:</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Ingresa tu nombre de usuario aquí"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={errors.username ? 'error-input' : ''}
                            />
                            {errors.username && <p className="error-message">{errors.username}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className={errors.email ? 'error' : ''}>Correo:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Ingresa tu correo aquí"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={errors.email ? 'error-input' : ''}
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName" className={errors.name ? 'error' : ''}>Nombres:</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="firstName" 
                                placeholder="Ingresa tus nombres aquí"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={errors.name ? 'error-input' : ''}
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className={errors.lastname ? 'error' : ''}>Apellidos:</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                name="lastName" 
                                placeholder="Ingresa tus apellidos aquí"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={errors.lastname ? 'error-input' : ''}
                            />
                            {errors.lastname && <p className="error-message">{errors.lastname}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className={errors.password ? 'error' : ''}>Contraseña:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Ingresa tu contraseña aquí"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={errors.password ? 'error-input' : ''}
                            />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className={errors.confirmPassword ? 'error' : ''}>Confirmar contraseña:</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={errors.confirmPassword ? 'error-input' : ''}
                            />
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>
                        {errors.form && <p className="error-message">{errors.form}</p>}
                        <button type="submit" className="register-button">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
