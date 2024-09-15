import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Inicializa el estado desde localStorage
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const [role, setRole] = useState(() => {
        return localStorage.getItem('role') || null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Actualiza localStorage cuando cambia el estado de autenticación
        localStorage.setItem('isAuthenticated', isAuthenticated);
        localStorage.setItem('role', role);
    }, [isAuthenticated, role]);

    const login = (userRole) => {
        setIsAuthenticated(true);
        setRole(userRole);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };