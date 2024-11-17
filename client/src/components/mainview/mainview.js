import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./mainview.css";
import motorImage1 from "../../assets/carrusel/carrusel1.png";
import motorImage2 from "../../assets/carrusel/carrusel2.png";
import motorImage3 from "../../assets/carrusel/carrusel3.png";

const MainView = () => {
    return(
        <div className="main-view">
            <div className="main-content">
                <Carousel 
                    showThumbs={false} 
                    infiniteLoop 
                    useKeyboardArrows 
                    autoPlay 
                    interval={3000}
                    className="main-carousel"
                >
                    <div>
                        <img src={motorImage1} alt="Motor ilustrativo 1" className="main-image" />
                    </div>
                    <div>
                        <img src={motorImage2} alt="Motor ilustrativo 2" className="main-image" />
                    </div>
                    <div>
                        <img src={motorImage3} alt="Motor ilustrativo 3" className="main-image" />
                    </div>
                </Carousel>
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