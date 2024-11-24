import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "./LogoutButton.css"

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/cerrar-sesion', {
                method: 'POST',
                credentials: 'include', // Para incluir cookies
            });

            if (response.ok) {
                logout(); // Llama a la función logout del contexto
            } else {
                console.error('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };

    return (
        <button onClick={handleLogout} id="logout-button">Cerrar Sesión</button>
    );
};

export default LogoutButton;