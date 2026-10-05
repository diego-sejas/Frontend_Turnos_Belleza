import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { CalendarMonth, People, AttachMoney, Star, Verified, AccessTime } from '@mui/icons-material';

const HomePage = () => {
  const features = [
    { icon: <CalendarMonth fontSize="large" sx={{ color: 'primary.main' }} />, title: 'Gestión de Citas', description: 'Reservas en tiempo real con disponibilidad por profesional y servicio.' },
    { icon: <People fontSize="large" sx={{ color: 'secondary.main' }} />, title: 'Clientes', description: 'Historial completo, preferencias y fidelización.' },
    { icon: <AttachMoney fontSize="large" sx={{ color: 'success.main' }} />, title: 'Pagos Flexibles', description: 'Integración con Mercado Pago, depósitos opcionales y reembolsos.' },
    { icon: <Star fontSize="large" sx={{ color: 'warning.main' }} />, title: 'Servicios Personalizados', description: 'Duraciones, precios y requisitos de depósito por servicio.' },
    { icon: <Verified fontSize="large" sx={{ color: 'info.main' }} />, title: 'Confirmaciones', description: 'Notificaciones por WhatsApp y email automáticas.' },
    { icon: <AccessTime fontSize="large" sx={{ color: 'error.main' }} />, title: 'Horarios Inteligentes', description: 'Disponibilidad semanal, bloqueos y excepciones.' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Sistema Belleza
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Plataforma completa para gestión de reservas, profesionales y pagos en salones de belleza.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'white',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Button variant="contained" size="large" href="/login" startIcon={<People />}>
          Iniciar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;