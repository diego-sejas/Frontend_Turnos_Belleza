import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowForward, CalendarMonth } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BookingCta = () => (
  <Box
    component="section"
    sx={{
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 5.5, md: 7 },
      backgroundColor: (theme) => theme.palette.custom.heroGradient,
      color: '#ffffff',
    }}
  >
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        background: (theme) => theme.palette.custom.glow,
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    />
    <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 600,
          color: '#FDF8F0',
          mb: 1,
        }}
      >
        Reservá tu próximo turno
      </Typography>
      <Typography
        variant="body2"
        component="p"
        sx={{ color: 'rgba(253, 248, 240, 0.85)', fontWeight: 400, mb: 3 }}
      >
        Elegí tu servicio, tu profesional y el horario que mejor te quede.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="center"
      >
        <Button
          component={Link}
          to="/reservar"
          variant="contained"
          size="medium"
          startIcon={<CalendarMonth />}
          sx={{ px: 3, py: 1 }}
        >
          Reservar turno
        </Button>
        <Button
          component={Link}
          to="/servicios"
          variant="outlined"
          size="medium"
          endIcon={<ArrowForward />}
          sx={{
            px: 3,
            py: 1,
            borderColor: 'rgba(253, 248, 240, 0.55)',
            color: '#FDF8F0',
            '&:hover': {
              borderColor: '#FDF8F0',
              backgroundColor: 'rgba(253, 248, 240, 0.10)',
            },
          }}
        >
          Ver servicios
        </Button>
      </Stack>
    </Container>
  </Box>
);

export default BookingCta;
