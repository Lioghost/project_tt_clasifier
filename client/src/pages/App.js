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
import NotAuthorized from '../components/notAuthorized/notAuthorized';
import NotFound from '../components/notFound/notFound';

import AdministrarCuentaAdmin from '../components/dashboard/administrarCuenta/administrarCuentaAdmin';
import AdministrarCuentaClient from '../components/dashboard/administrarCuenta/administrarCuentaClient';

import AdministrarJuntasGAdmin from '../components/dashboard/administrarJuntas/administrarJuntasGAdmin';
// import AdministrarJuntasMAdmin from '../components/dashboard/administrarJuntas/administrarJuntasMAdmin';
import AdministrarMotoresAdmin from '../components/dashboard/administrarMotores/administrarMotoresAdmin';
import AdministrarAutosAdmin from '../components/dashboard/administrarAutos/administrarAutosAdmin';
import AdministrarMarcasAdmin from '../components/dashboard/administrarMarcas/administrarMarcasAdmin';

import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
      <Router>
          <AuthProvider>
              <Favicon />
              <Routes>
                  {/* Rutas del visitante */}
                  <Route path="/" element={<><ProtectedRoute roles={['Visitante']}><Header /><MainView /></ProtectedRoute></>} />
                  <Route path="/login" element={<><ProtectedRoute roles={['Visitante']}><Header /><Login /></ProtectedRoute></>} />
                  <Route path="/register" element={<><ProtectedRoute roles={['Visitante']}><Header /><Register /></ProtectedRoute></>} />
                  
                  {/* Ruta que no incluye el Header */}
                  <Route path="/auth/confirmar/:token" element={<ConfirmarCuenta />} /> {/* Confirmar cuenta sin Header */}
                  <Route path="/forgot-password" element={<><ForgotPassword /></>} />   {/* Nueva ruta para recuperar contraseña */}
                  <Route path="/auth/olvide-password/:token" element={<ResetPassword />} /> {/* Nueva ruta para restablecer contraseña */}
                  
                  {/* Rutas de los Dashboard */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/client/dashboard" element={<ProtectedRoute roles={['Client']}><ClientDashboard /></ProtectedRoute>} />
                    
                  {/* Rutas de administrar cuenta */}
                  <Route path="/admin/cuenta" element={<ProtectedRoute roles={['Admin']}><AdministrarCuentaAdmin /></ProtectedRoute>} />
                  <Route path="/client/cuenta" element={<ProtectedRoute roles={['Client']}><AdministrarCuentaClient /></ProtectedRoute>} />

                  {/* Rutas de catálogo */}
                  <Route path="/admin/catalogo" element={<ProtectedRoute roles={['Admin']}><AdministrarCuentaAdmin /></ProtectedRoute>} />
                  <Route path="/client/catalogo" element={<ProtectedRoute roles={['Client']}><AdministrarCuentaClient /></ProtectedRoute>} />

                  {/* Rutas de identificador */}
                  <Route path="/admin/identificador" element={<ProtectedRoute roles={['Admin']}><AdministrarCuentaAdmin /></ProtectedRoute>} />
                  <Route path="/client/identificador" element={<ProtectedRoute roles={['Client']}><AdministrarCuentaClient /></ProtectedRoute>} />

                  {/* Rutas restantes del administrador */}
                  <Route path="/admin/juntasg" element={<ProtectedRoute roles={['Admin']}><AdministrarJuntasGAdmin /></ProtectedRoute>} />
                  {/*<Route path="/admin/juntasm" element={<ProtectedRoute roles={['Admin']}><AdministrarJuntasMAdmin /></ProtectedRoute>} /> */}
                  <Route path="/admin/motores" element={<ProtectedRoute roles={['Admin']}><AdministrarMotoresAdmin /></ProtectedRoute>} />
                  <Route path="/admin/autos" element={<ProtectedRoute roles={['Admin']}><AdministrarAutosAdmin /></ProtectedRoute>} />
                  <Route path="/admin/marcas" element={<ProtectedRoute roles={['Admin']}><AdministrarMarcasAdmin /></ProtectedRoute>} />
                  <Route path="/admin/usuarios" element={<ProtectedRoute roles={['Admin']}><AdministrarCuentaAdmin /></ProtectedRoute>} />

                  <Route path="/not-authorized" element={<NotAuthorized />} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </AuthProvider>
      </Router>
  );
}

export default App;