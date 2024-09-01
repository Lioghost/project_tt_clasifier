import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/check-session', { // Cambia a la ruta correcta en el backend
                    method: 'GET',
                    credentials: 'include', // Asegura el envío de cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setRole(data.role);
                } else {
                    setUser(null);
                    setRole(null);
                }
            } catch (error) {
                console.error('Error al verificar la sesión:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserSession();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Para incluir cookies
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setRole(data.role);
                return { success: true };
            } else {
                return { success: false, message: 'Email o password incorrecto' };
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/cerrar-sesion', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                setRole(null);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
