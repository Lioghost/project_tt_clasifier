import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, role } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    } else if (isAuthenticated && role === 'Client') {
        return <Navigate to="/client/dashboard" />;
    } else if (isAuthenticated && role === 'Admin') {	
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;