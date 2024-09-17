// notAuthorized.js
import React from 'react';
import './notAuthorized.css';

const NotAuthorized = () => {
    return (
        <div className="not-authorized-container">
            <div className="not-authorized-content">
                <div className="not-authorized-icon">🚫</div>
                <h1 className="not-authorized-title">Acceso Denegado</h1>
                <p className="not-authorized-message">No tienes autorización para acceder a esta página.</p>
                <p className="not-authorized-message">Por favor, contacta al administrador si crees que esto es un error.</p>
                <button className="not-authorized-button" onClick={() => window.location.href = '/'}>Volver al Inicio</button>
            </div>
        </div>
    );
};

export default NotAuthorized;