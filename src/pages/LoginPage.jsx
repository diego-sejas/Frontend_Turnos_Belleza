import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, CircularProgress, Link, IconButton, InputAdornment } from '@mui/material';
import { Lock, Email, Visibility, VisibilityOff, Spa } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginWithError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginWithError(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by loginWithError via notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: 'auto', sm: '70vh' },
        px: 2,
        py: { xs: 4, sm: 6, md: 8 },
        background: (t) => t.palette.custom.glow,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ height: 6, background: 'linear-gradient(90deg, #D2AC72 0%, #B98A4B 55%, #9A7139 100%)' }} />
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header with logo and title */}
          <Box sx={{ textAlign: 'center', mb: 4, mt: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)',
                mb: 3,
                boxShadow: '0 12px 26px -10px rgba(154, 113, 57, 0.55)',
              }}
            >
              <Spa sx={{ fontSize: 30, color: '#FFFDF9' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Sistema Belleza
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Gestión de turnos y reservas
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              size="small"
              sx={{ mt: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 3, mb: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/register" variant="body2" sx={{ fontWeight: 600 }}>Regístrate</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
