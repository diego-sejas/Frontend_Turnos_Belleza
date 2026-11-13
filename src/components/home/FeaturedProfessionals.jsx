import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowForward, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { getInitials } from './formatters';
import { imageUrl } from '../../services/images';

const cardHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 18px 36px -18px rgba(0, 0, 0, 0.65)'
        : '0 18px 36px -18px rgba(42, 38, 32, 0.35)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': { transform: 'none' },
  },
};

const ProfessionalsSkeleton = () => (
  <Grid container spacing={1.5} justifyContent="center">
    {[...Array(3)].map((_, index) => (
      <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
        <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" sx={{ aspectRatio: '4 / 3', width: '100%', height: 'auto' }} />
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={14} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const FeaturedProfessionals = ({ professionals = [], loading, error, onRetry }) => {
  const items = professionals.slice(0, 4);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 3.5, md: 5 },
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Equipo"
          title="Nuestros profesionales"
          subtitle="Las personas que te acompañan en cada visita."
        />

        {loading ? (
          <ProfessionalsSkeleton />
        ) : error ? (
          <Alert
            severity="warning"
            sx={{ maxWidth: 640, mx: 'auto' }}
            action={
              onRetry && (
                <Button color="inherit" size="small" onClick={onRetry}>
                  Reintentar
                </Button>
              )
            }
          >
            {error}
          </Alert>
        ) : items.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 3.5,
              px: 2.5,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              backgroundColor: (theme) => theme.palette.custom.surfaceAlt,
            }}
          >
            <Person sx={{ fontSize: 26, color: 'primary.main', mb: 0.75 }} />
            <Typography variant="h6" component="h3" sx={{ fontSize: '0.9375rem', color: 'text.primary', mb: 0.5 }}>
              Equipo en presentación
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              Muy pronto vas a poder conocer aquí a nuestro equipo.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5} justifyContent="center">
            {items.map((professional) => {
              const serviceNames = (professional.services || [])
                .map((service) => service.name)
                .filter(Boolean);

              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={professional.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid',
                      borderColor: 'divider',
                      ...cardHoverSx,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        aspectRatio: '4 / 3',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: (theme) => theme.palette.custom.surfaceAlt,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {/* Si el registro tiene fotografía en GridFS (professional.imageUrl),
                          se muestra; de lo contrario usamos un avatar neutro de marca. */}
                      {professional.imageUrl ? (
                        <Box
                          component="img"
                          src={imageUrl(professional.imageUrl)}
                          alt={`Retrato de ${professional.nombre} ${professional.apellido}`}
                          loading="lazy"
                          decoding="async"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <>
                          <Box
                            aria-hidden="true"
                            sx={{
                              width: 68,
                              height: 68,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: (theme) => theme.palette.custom.gradientGold,
                              color: '#ffffff',
                              fontSize: 22,
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {getInitials(professional.nombre, professional.apellido)}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 4,
                              left: 0,
                              right: 0,
                              textAlign: 'center',
                              color: 'text.disabled',
                              letterSpacing: '0.04em',
                              fontSize: '0.625rem',
                            }}
                          >
                            Foto no disponible
                          </Typography>
                        </>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'text.primary', mb: 0.5, lineHeight: 1.3 }}
                      >
                        {professional.nombre} {professional.apellido}
                      </Typography>

                      {serviceNames.length > 0 ? (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          useFlexGap
                          flexWrap="wrap"
                          sx={{ mb: 1.25, gap: 0.5 }}
                        >
                          {serviceNames.slice(0, 3).map((name) => (
                            <Chip
                              key={name}
                              label={name}
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: '0.71875rem', '& .MuiChip-label': { px: 0.75 } }}
                            />
                          ))}
                          {serviceNames.length > 3 && (
                            <Chip
                              label={`+${serviceNames.length - 3}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ height: 22, fontSize: '0.71875rem', '& .MuiChip-label': { px: 0.75 } }}
                            />
                          )}
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', mb: 1.25 }}>
                          Consultá los servicios disponibles.
                        </Typography>
                      )}

                      <Button
                        component={Link}
                        to="/reservar"
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForward sx={{ fontSize: '0.85rem' }} />}
                        sx={{
                          mt: 'auto',
                          alignSelf: 'flex-start',
                          py: 0.4,
                          px: 1.5,
                          fontSize: '0.75rem',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        Reservar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box sx={{ mt: 2.5, textAlign: 'center' }}>
          <Button
            component={Link}
            to="/estilistas"
            variant="outlined"
            size="small"
            endIcon={<ArrowForward fontSize="small" />}
            sx={{
              py: 0.75,
              px: 2.5,
              fontSize: '0.8125rem',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { borderColor: 'primary.dark', backgroundColor: 'action.hover' },
            }}
          >
            Conocer al equipo
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedProfessionals;
