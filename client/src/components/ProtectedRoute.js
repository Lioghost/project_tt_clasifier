import React, { useContext } from 'react';
import { Navigate, useLocation, matchPath } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    // Definir una lista de rutas válidas para visitantes
    const visitantRoutes = [
        '/',
        '/login',
        '/register',
        '/auth/confirmar/:token',
        '/forgot-password',
        '/auth/olvide-password/:token',
        '/not-authorized'
    ];

    // Función para comprobar si la URL actual es una ruta de visitante
    const isValidRoute = visitantRoutes.some(route => matchPath(route, location.pathname));

    // Si la ruta es válida para visitantes, permitir el acceso sin autenticación
    if (isValidRoute) {
        return children;
    }

    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Si el usuario está autenticado y en una ruta válida de visitante, redirigir a dashboard según su rol
    if (isAuthenticated && isValidRoute) {
        const userRole = user?.role;
        if (userRole === 'Admin') {
            return <Navigate to="/admin/dashboard" />;
        } else if (userRole === 'Client') {
            return <Navigate to="/client/dashboard" />;
        }
    }

    // Verificar si el rol del usuario es válido para la ruta actual
    if (roles && (!user || !roles.includes(user.role))) {
        return <Navigate to="/not-authorized" />;
    }

    return children;
};

export default ProtectedRoute;
