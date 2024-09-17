// NotFound.js
import React from 'react';
import './notFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">🔍</div>
                <h1 className="not-found-title">Página No Encontrada</h1>
                <p className="not-found-message">Lo sentimos, la página que estás buscando no existe.</p>
                <button className="not-found-button" onClick={() => window.location.href = '/'}>Volver al Inicio</button>
            </div>
        </div>
    );
};

export default NotFound;