import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from '../logout/LogoutButton';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="admin-dashboard">
            <h1>Bienvenido al Dashboard del Administrador</h1>
            <p>Aquí puedes gestionar las actividades administrativas.</p>
            <LogoutButton /> {/* Agrega el botón de cerrar sesión */}
        </div>
    );
};

export default AdminDashboard;