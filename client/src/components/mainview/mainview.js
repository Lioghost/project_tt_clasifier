import React from "react";
import { Link } from "react-router-dom";
import "./mainview.css";
import motorImage from '../../assets/img/motor-image.png';

const MainView = () => {
    return(
        <div className="main-view">
            <div className="main-content">
                <img src={motorImage} alt="Motor ilustrativo" className="main-image" />
                <div className="main-text">
                    <h1>Derribando el pasado y rectificando el futuro.</h1>
                    <p>Tu aliado en refacciones.</p>
                    <Link to="/login" className="main-button">Iniciar experiencia</Link>
                </div>
            </div>
        </div>
    );
}

export default MainView;