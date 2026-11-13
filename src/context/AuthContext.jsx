import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((severity, message, title = null, autoHideDuration = 4000) => {
    setNotification({ severity, message, title, autoHideDuration, open: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => (prev ? { ...prev, open: false } : null));
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    showNotification('success', `Inicio de sesión exitoso.`, `Bienvenido, ${userData.nombre}`, 4000);
    return userData;
  }, [showNotification]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const register = useCallback(async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }, []);

  const loginWithError = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      showNotification('success', `Inicio de sesión exitoso.`, `Bienvenido, ${userData.nombre}`, 4000);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      if (errorMessage.includes('credenciales') || errorMessage.includes('Invalid credentials') || errorMessage.includes('Incorrect')) {
        showNotification('error', 'Usuario o contraseña incorrectos.', 'Error de autenticación', 5000);
      } else {
        showNotification('error', 'No fue posible iniciar sesión. Intente nuevamente.', 'Error', 5000);
      }
      throw err;
    }
  }, [showNotification]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, notification, showNotification, hideNotification, loginWithError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};