import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favicon from '../components/common/favicon'; 
import Header from '../components/header/header';
import MainView from '../components/mainview/mainview';
import Login from '../components/login/login';
import Register from '../components/register/register';
import ConfirmarCuenta from '../components/confirmarCuenta/confirmarCuenta'; // Importa el componente de confirmación

function App() {
  return (
    <Router>
      <div className="App">
        <Favicon />
        <Routes>
          {/* Rutas que incluyen el Header */}
          <Route path="/" element={<><Header /><MainView /></>} />
          <Route path="/login" element={<><Header /><Login /></>} />
          <Route path="/register" element={<><Header /><Register /></>} />
          
          {/* Ruta que no incluye el Header */}
          <Route path="/auth/confirmar/:token" element={<ConfirmarCuenta />} /> {/* Confirmar cuenta sin Header */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;