import { useState } from 'react';
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
import { AccessTime, ArrowForward, LocalOffer, Spa } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { formatDuration, formatPrice } from './formatters';
import { getServiceImage } from './serviceImages';

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

const ServicesSkeleton = () => (
  <Grid container spacing={1.5}>
    {[...Array(4)].map((_, index) => (
      <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
        <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" sx={{ aspectRatio: '16 / 8.5', width: '100%', height: 'auto' }} />
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="90%" height={14} />
            <Skeleton variant="text" width="40%" height={14} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ServiceMedia = ({ service }) => {
  const { src, alt } = getServiceImage(service);
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;

  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: '16 / 8.5',
        overflow: 'hidden',
        backgroundColor: (theme) => theme.palette.custom.surfaceAlt,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {showFallback ? (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: (theme) => theme.palette.custom.gradientGold,
          }}
        >
          <Spa sx={{ fontSize: 30, color: '#ffffff' }} />
        </Box>
      ) : (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </Box>
  );
};

const FeaturedServices = ({ services = [], loading, error, onRetry }) => {
  const items = services.slice(0, 6);

  return (
    <Box
      component="section"
      sx={{ py: { xs: 3.5, md: 5 }, backgroundColor: 'background.default' }}
    >
      <Container maxWidth="xl">
        <SectionHeading
          eyebrow="Servicios"
          title="Servicios destacados"
          subtitle="Una selección de lo que hacemos, con precios y duración reales de nuestro catálogo."
        />

        {loading ? (
          <ServicesSkeleton />
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
            <Spa sx={{ fontSize: 26, color: 'primary.main', mb: 0.75 }} />
            <Typography variant="h6" component="h3" sx={{ fontSize: '0.9375rem', color: 'text.primary', mb: 0.5 }}>
              Catálogo en preparación
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
              Muy pronto vas a poder ver aquí nuestros servicios disponibles.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {items.map((service) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={service.id}>
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
                  <ServiceMedia service={service} />

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'text.primary', mb: 0.5, lineHeight: 1.3 }}
                    >
                      {service.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8125rem',
                        lineHeight: 1.45,
                        color: 'text.secondary',
                        mb: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {service.description || 'Servicio profesional personalizado.'}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ mt: 'auto', gap: 0.5 }}
                    >
                      <Chip
                        icon={<AccessTime sx={{ fontSize: '0.85rem !important' }} />}
                        label={formatDuration(service.durationMinutes)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.75rem', '& .MuiChip-label': { px: 0.75 } }}
                      />
                      <Chip
                        icon={<LocalOffer sx={{ fontSize: '0.85rem !important' }} />}
                        label={formatPrice(service.price, service.currency)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.75rem', '& .MuiChip-label': { px: 0.75 } }}
                      />
                      {service.requiresDeposit && (
                        <Chip
                          label="Requiere seña"
                          size="small"
                          variant="outlined"
                          color="warning"
                          sx={{ height: 24, fontSize: '0.75rem', '& .MuiChip-label': { px: 0.75 } }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 2.5, textAlign: 'center' }}>
          <Button
            component={Link}
            to="/servicios"
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
            Ver todos los servicios
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedServices;
