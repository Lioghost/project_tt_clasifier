import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; // Importa el AuthProvider
import Favicon from '../components/common/favicon'; 
import Header from '../components/header/header';
import MainView from '../components/mainview/mainview';
import Login from '../components/login/login';
import Register from '../components/register/register';
import ConfirmarCuenta from '../components/confirmarCuenta/confirmarCuenta'; // Importa el componente de confirmación
import ForgotPassword from '../components/forgotPassword/forgotPassword'; // Importa el nuevo componente
import ResetPassword from '../components/ResetPassword/resetPassword' // Importa el nuevo componente
import DashboardAdmin from '../components/admin/dashboardAdmin'; // Asegúrate de tener este componente
import DashboardClient from '../components/client/dashboardClient'; // Asegúrate de tener este componente

function App() {
  return (
    <AuthProvider> {/* Provee el contexto de autenticación */}
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
            <Route path="/forgot-password" element={<><ForgotPassword /></>} />   {/* Nueva ruta para recuperar contraseña */}
            <Route path="/auth/olvide-password/:token" element={<ResetPassword />} /> {/* Nueva ruta para restablecer contraseña */}
    
            {/* Rutas para los roles */}
            <Route path="/admin/dashboard" element={<DashboardAdmin />} /> {/* Ruta protegida para Admin */}
            <Route path="/client/dashboard" element={<DashboardClient />} /> {/* Ruta protegida para Cliente */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;