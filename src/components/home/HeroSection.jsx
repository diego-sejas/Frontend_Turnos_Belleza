import { useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowForward, CalendarMonth, Spa } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: '56vh', md: '62vh' },
        color: '#ffffff',
        background: (theme) => theme.palette.custom.heroGradient,
      }}
    >
      {!imageFailed && (
        <Box
          component="img"
          src="/images/home/hero-1600.jpg"
          srcSet="/images/home/hero-900.jpg 900w, /images/home/hero-1600.jpg 1600w"
          sizes="100vw"
          alt="Fotografía ilustrativa de un salón de belleza moderno con espejos y sillones de estilismo"
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
      )}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(105deg, rgba(18,16,14,0.94) 0%, rgba(18,16,14,0.78) 42%, rgba(18,16,14,0.38) 100%)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 5, md: 7 } }}>
        <Box sx={{ maxWidth: 560 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'rgba(210, 172, 114, 0.55)',
                backgroundColor: 'rgba(210, 172, 114, 0.12)',
              }}
            >
              <Spa sx={{ fontSize: 18, color: '#E8D5B5' }} />
            </Box>
            <Typography
              variant="overline"
              sx={{ color: '#E8D5B5', letterSpacing: '0.22em', fontWeight: 600, fontSize: '0.6875rem' }}
            >
              Sistema Belleza
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '1.85rem', md: '2.85rem' },
              lineHeight: 1.08,
              fontWeight: 600,
              color: '#FDF8F0',
              mb: 1.75,
            }}
          >
            Tu belleza, en su mejor expresión
          </Typography>

          <Typography
            variant="body2"
            component="p"
            sx={{
              color: 'rgba(253, 248, 240, 0.86)',
              fontWeight: 400,
              lineHeight: 1.55,
              mb: 3,
              maxWidth: 460,
            }}
          >
            Cortes, color y tratamientos con una experiencia cuidada en cada detalle.
            Reservá tu turno online en segundos.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
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
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
