import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Box>Registro - En construcción</Box></PublicRoute>} />
      </Route>

      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} path="/dashboard" />
        <Route element={<ProtectedRoute><Box>Reservas - En construcción</Box></ProtectedRoute>} path="/reservations" />
        <Route element={<ProtectedRoute><Box>Clientes - En construcción</Box></ProtectedRoute>} path="/clients" />
        <Route element={<ProtectedRoute><Box>Pagos - En construcción</Box></ProtectedRoute>} path="/payments" />
        <Route element={<ProtectedRoute><Box>Configuración - En construcción</Box></ProtectedRoute>} path="/settings" />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;