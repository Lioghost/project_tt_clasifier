import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, role } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isAuthenticated && role === 'Client') {
        return <Navigate to="/client/dashboard" />;
    }

    if (isAuthenticated && role === 'Admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;