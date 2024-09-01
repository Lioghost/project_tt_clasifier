import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./dashboardClient.css";

const DashboardClient = () => {
    const { user, role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'Cliente') {
            navigate('/'); // Redirige si el rol no es Cliente
        }
    }, [role, navigate]);

    return (
        <div className="dashboard-client">
            <h1>Bienvenido, {user && user.name}</h1>
            <div className="client-options">
                <div className="option-card">
                    <h2>Mis Juntas</h2>
                    <p>Administra y visualiza tus juntas.</p>
                    <button onClick={() => navigate('/client/juntas')}>Ver Juntas</button>
                </div>
                <div className="option-card">
                    <h2>Configuración</h2>
                    <p>Administra la configuración de tu cuenta.</p>
                    <button onClick={() => navigate('/client/settings')}>Configuración</button>
                </div>
                {/* Puedes agregar más opciones según las necesidades */}
            </div>
        </div>
    );
};

export default DashboardClient;

