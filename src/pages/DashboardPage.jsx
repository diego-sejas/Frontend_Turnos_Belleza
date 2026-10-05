import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { CalendarMonth, People, AttachMoney, Settings } from '@mui/icons-material';

const DashboardPage = () => {
  const stats = [
    { title: 'Reservas Hoy', value: '12', icon: <CalendarMonth fontSize="large" sx={{ color: 'primary.main' }} />, color: 'primary' },
    { title: 'Clientes', value: '156', icon: <People fontSize="large" sx={{ color: 'secondary.main' }} />, color: 'secondary' },
    { title: 'Ingresos Mes', value: '$45,200', icon: <AttachMoney fontSize="large" sx={{ color: 'success.main' }} />, color: 'success' },
    { title: 'Profesionales', value: '5', icon: <Settings fontSize="large" sx={{ color: 'info.main' }} />, color: 'info' },
  ];

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Panel de Control
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Bienvenido al sistema de gestión. Aquí verás un resumen de tu negocio.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: 2, backgroundColor: `${stat.color}.light`, opacity: 0.2 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>Accesos Rápidos</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth size="large" startIcon={<CalendarMonth />} href="/reservations">
              Nueva Reserva
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth size="large" startIcon={<People />} href="/clients">
              Gestionar Clientes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth size="large" startIcon={<AttachMoney />} href="/payments">
              Pagos
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth size="large" startIcon={<Settings />} href="/settings">
              Configuración
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;