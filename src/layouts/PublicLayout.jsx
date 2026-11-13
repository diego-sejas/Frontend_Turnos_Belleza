import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, Button } from '@mui/material';
import { Spa, CalendarMonth } from '@mui/icons-material';
import NotificationBar from '../components/NotificationBar';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/AuthContext';

const footerLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Estilistas', to: '/estilistas' },
  { label: 'Trabajos', to: '/trabajos' },
  { label: 'Reservar', to: '/reservar' },
];

const PublicLayout = () => {
  const { notification, hideNotification } = useAuth();

  const footerLinkSx = {
    color: (theme) => theme.palette.custom.footerText,
    textDecoration: 'none',
    fontSize: '0.9rem',
    '&:hover': {
      color: '#FDF8F0',
      textDecoration: 'underline',
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <NotificationBar
        open={notification?.open}
        onClose={hideNotification}
        severity={notification?.severity}
        message={notification?.message}
        title={notification?.title}
        autoHideDuration={notification?.autoHideDuration}
      />
      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.custom.footerBg,
          color: (theme) => theme.palette.custom.footerText,
          borderTop: '1px solid',
          borderColor: (theme) => theme.palette.custom.borderGold,
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: (theme) => theme.palette.custom.gradientGold,
                  }}
                >
                  <Spa sx={{ fontSize: 22, color: '#ffffff' }} />
                </Box>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="h6"
                    sx={{ color: '#FDF8F0', fontWeight: 700, lineHeight: 1.15 }}
                  >
                    Sistema Belleza
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: (theme) => theme.palette.custom.footerText }}
                  >
                    Salón de belleza
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.custom.footerText,
                  textAlign: { xs: 'center', md: 'left' },
                  maxWidth: 360,
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                Reservá tu turno online y viví una experiencia pensada para realzar tu belleza.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle2"
                component="h2"
                sx={{
                  color: '#FDF8F0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                Navegación
              </Typography>
              <Box
                component="nav"
                aria-label="Navegación del pie de página"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: { xs: 'center', sm: 'flex-start' },
                }}
              >
                {footerLinks.map((item) => (
                  <Link key={item.to} component={RouterLink} to={item.to} sx={footerLinkSx}>
                    {item.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="subtitle2"
                component="h2"
                sx={{
                  color: '#FDF8F0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                Reservas
              </Typography>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography
                  variant="body2"
                  sx={{ color: (theme) => theme.palette.custom.footerText, mb: 2 }}
                >
                  Agendá online cuando quieras.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/reservar"
                  variant="contained"
                  size="small"
                  startIcon={<CalendarMonth />}
                >
                  Reservar turno
                </Button>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <Link component={RouterLink} to="/login" sx={footerLinkSx}>
                    Iniciar sesión
                  </Link>
                  <Link component={RouterLink} to="/register" sx={footerLinkSx}>
                    Crear cuenta
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: { xs: 5, md: 6 },
              pt: 3,
              borderTop: '1px solid',
              borderColor: (theme) => theme.palette.custom.borderGold,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: (theme) => theme.palette.custom.footerText }}
            >
              © {new Date().getFullYear()} Sistema Belleza. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
