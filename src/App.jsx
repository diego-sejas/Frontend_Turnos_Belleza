import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicServicesPage from './pages/PublicServicesPage';
import PublicProfessionalsPage from './pages/PublicProfessionalsPage';
import PublicWorksPage from './pages/PublicWorksPage';
import PublicBookingPage from './pages/PublicBookingPage';
import DashboardPage from './pages/admin/DashboardPage';
import ServicesPage from './pages/admin/ServicesPage';
import ProfessionalsPage from './pages/admin/ProfessionalsPage';
import WorksPage from './pages/admin/WorksPage';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== 'ADMIN') {
    return (
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
            Acceso restringido
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta sección es solo para administradores.
          </Typography>
        </Box>
      </Box>
    );
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Los administradores pueden acceder a las rutas públicas
  if (user?.rol === 'ADMIN') {
    return children;
  }

  // Usuarios autenticados no administradores van al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Usuarios no autenticados ven la página pública
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<PublicServicesPage />} />
        <Route path="/estilistas" element={<PublicProfessionalsPage />} />
        <Route path="/trabajos" element={<PublicWorksPage />} />
        <Route path="/reservar" element={<PublicBookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<MainLayout />}>
        <Route element={<AdminRoute><DashboardPage /></AdminRoute>} path="/dashboard" />
        <Route element={<AdminRoute><ServicesPage /></AdminRoute>} path="/admin/services" />
        <Route element={<AdminRoute><ProfessionalsPage /></AdminRoute>} path="/admin/professionals" />
        <Route element={<AdminRoute><WorksPage /></AdminRoute>} path="/admin/works" />
        <Route element={<AdminRoute><Box>Reservas - En construccion</Box></AdminRoute>} path="/admin/reservations" />
        <Route element={<AdminRoute><Box>Clientes - En construccion</Box></AdminRoute>} path="/admin/clients" />
        <Route element={<AdminRoute><Box>Pagos - En construccion</Box></AdminRoute>} path="/admin/payments" />
        <Route element={<AdminRoute><Box>Configuracion - En construccion</Box></AdminRoute>} path="/admin/settings" />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;