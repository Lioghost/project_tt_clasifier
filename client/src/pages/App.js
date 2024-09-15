import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favicon from '../components/common/favicon'; 
import Header from '../components/header/header';
import MainView from '../components/mainview/mainview';
import Login from '../components/login/login';
import Register from '../components/register/register';
import ConfirmarCuenta from '../components/confirmarCuenta/confirmarCuenta'; // Importa el componente de confirmación
import ForgotPassword from '../components/forgotPassword/forgotPassword'; // Importa el nuevo componente
import ResetPassword from '../components/ResetPassword/resetPassword' // Importa el nuevo componente
import ClientDashboard from '../components/dashboard/ClientDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

import AdministrarCuenta from '../components/dashboard/administrarCuenta/administrarCuenta';

import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
      <Router>
          <AuthProvider>
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
                  
                  {/* Rutas de los Dashboard */}
                  <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                  <Route path="/admin/cuenta" element={<AdministrarCuenta />} /> 

              </Routes>
          </AuthProvider>
      </Router>
  );
}

export default App;