import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    // Definir una lista de rutas válidas
    const visitantRoutes = [
        '/',
        '/login',
        '/register',
        '/auth/confirmar/:token',
        '/forgot-password',
        '/auth/olvide-password/:token',
        '/not-authorized'
    ];

    // Comprobar si la URL actual no está en la lista de rutas válidas
    const isValidRoute = visitantRoutes.includes(location.pathname);

    if (!isAuthenticated && roles.includes('Visitante')) {
        return children;
    } else if (isValidRoute && isAuthenticated) {
        const userRole = user.role; // Asumiendo que el rol del usuario está disponible en el contexto de autenticación
        if (userRole === 'Admin') {
            return <Navigate to="/admin/dashboard" />;
        } else if (userRole === 'Client') {
            return <Navigate to="/client/dashboard" />;
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/not-authorized" />;
    }

    return children;
};

export default ProtectedRoute;