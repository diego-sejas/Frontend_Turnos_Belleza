import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Container,
  Skeleton,
  Alert,
} from '@mui/material';
import { Spa, Favorite, AccessTime, ArrowForward, LocalOffer, CalendarMonth } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { publicCatalogApi } from '../services/publicCatalog';
import { getServiceImage } from '../components/home/serviceImages';

const ServiceMedia = ({ service }) => {
  const { src, alt } = getServiceImage(service);
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        backgroundColor: (t) => t.palette.custom.surfaceAlt,
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
            background: (t) => t.palette.custom.gradientGold,
          }}
        >
          <Spa sx={{ fontSize: 32, color: '#ffffff' }} />
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

const PublicServicesPage = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await publicCatalogApi.services({ limit: 50 });
      setServices(res.data.data.services);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #2A2622 0%, #4A423A 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              mb: 2,
            }}
          >
            <Spa sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Nuestros Servicios
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 560, mx: 'auto' }}>
            Descubre nuestra carta de servicios diseñada para realzar tu belleza. Todos realizados con productos premium y por profesionales certificados.
          </Typography>
        </Container>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, mt: -3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.4rem' }, color: 'text.primary' }}>
            Catálogo de Servicios
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            {loading ? 'Cargando...' : `${services.length} servicios disponibles`}
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <CardMedia
                    component="div"
                    sx={{ height: 160, backgroundColor: (t) => t.palette.custom.surfaceBadge }}
                  >
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </CardMedia>
                  <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.75 }} />
                    <Skeleton variant="text" width="80%" height={14} sx={{ mt: 1.5 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontSize: '1.15rem' }}>
              No hay servicios disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary' }}>
              Vuelve pronto para ver nuestros nuevos servicios.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} lg={4} key={service.id}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <ServiceMedia service={service} />
                  <CardContent sx={{ py: 1.75, px: 1.75, '&:last-child': { pb: 1.75 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', color: 'text.primary' }}>
                        {service.name}
                      </Typography>
                      <Chip
                        label={formatPrice(service.price)}
                        icon={<LocalOffer fontSize="small" />}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 0.75 }}>
                      {service.description || 'Servicio profesional personalizado según tus necesidades.'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<AccessTime fontSize="small" />}
                        label={formatDuration(service.durationMinutes)}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                      {service.requiresDeposit && (
                        <Chip
                          icon={<Favorite fontSize="small" />}
                          label="Requiere seña"
                          size="small"
                          variant="outlined"
                          color="warning"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* CTA */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ color: 'text.secondary', mb: 1.5 }}>
            ¿No encontraste lo que buscabas?
          </Typography>
          <Button
            component={Link}
            to="/reservar"
            variant="outlined"
            size="medium"
            startIcon={<CalendarMonth />}
            sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'action.hover' } }}
          >
            Consultar disponibilidad
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicServicesPage;