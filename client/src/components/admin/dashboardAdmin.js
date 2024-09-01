import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./dashboardAdmin.css";

const DashboardAdmin = () => {
    const { user, role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'Admin') {
            navigate('/'); // Redirige si el rol no es Admin
        }
    }, [role, navigate]);

    return (
        <div className="dashboard-admin">
            <h1>Bienvenido, Administrador {user && user.name}</h1>
            <div className="admin-options">
                <div className="option-card">
                    <h2>Usuarios</h2>
                    <p>Gestiona los usuarios de la plataforma.</p>
                    <button onClick={() => navigate('/admin/users')}>Administrar Usuarios</button>
                </div>
                <div className="option-card">
                    <h2>Configuración</h2>
                    <p>Administra la configuración de la plataforma.</p>
                    <button onClick={() => navigate('/admin/settings')}>Configuración</button>
                </div>
                {/* Puedes agregar más opciones según las necesidades */}
            </div>
        </div>
    );
};

export default DashboardAdmin;