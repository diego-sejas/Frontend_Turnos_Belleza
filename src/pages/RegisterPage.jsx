import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Person, Badge, Spa } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('PROFESIONAL');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({ nombre, email, password, rol });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
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
              Crear Cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Regístrate para acceder al sistema
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              margin="normal"
              required
              autoComplete="name"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

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
              sx={{ mt: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth margin="normal" required sx={{ mt: 1.5 }}>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                value={rol}
                label="Rol"
                onChange={(e) => setRol(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: 'text.disabled', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="PROFESIONAL">Profesional</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
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

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
              size="small"
              sx={{ mt: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.disabled', fontSize: 20 }} />
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
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" variant="body2" sx={{ fontWeight: 600 }}>Inicia Sesión</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
