import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientDashboard.css';
import LogoutButton from '../logout/LogoutButton';
import { AuthContext } from '../../context/AuthContext';

const ClientDashboard = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="client-dashboard">
            <h1>Bienvenido al Dashboard del Cliente</h1>
            <p>Aquí puedes gestionar tus actividades como cliente.</p>
            <LogoutButton /> {/* Agrega el botón de cerrar sesión */}
        </div>
    );
};

export default ClientDashboard;