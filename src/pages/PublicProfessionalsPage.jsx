import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Skeleton,
} from '@mui/material';
import { Person, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { publicCatalogApi } from '../services/publicCatalog';
import { imageUrl } from '../services/images';

const getInitials = (firstName, lastName) =>
  `${(firstName || '').trim().charAt(0)}${(lastName || '').trim().charAt(0)}`.toUpperCase();

const PublicProfessionalsPage = () => {
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState(null);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const res = await publicCatalogApi.professionals({ limit: 50 });
      setProfessionals(res.data.data.professionals);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar estilistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

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
            <Person sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Nuestros Estilistas
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 560, mx: 'auto' }}>
            Conoce a nuestro equipo de profesionales apasionados por la belleza. Cada uno con su especialidad y estilo único.
          </Typography>
        </Container>
      </Box>

      {/* Professionals Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, mt: -3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.4rem' }, color: 'text.primary' }}>
            Nuestro Equipo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            {loading ? 'Cargando...' : `${professionals.length} profesionales a tu servicio`}
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ aspectRatio: '1 / 1', backgroundColor: (t) => t.palette.custom.surfaceBadge }}>
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  </Box>
                  <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                    <Skeleton variant="text" width="50%" height={20} sx={{ textAlign: 'center', mx: 'auto', mb: 0.75 }} />
                    <Skeleton variant="text" width="60%" height={14} sx={{ textAlign: 'center', mx: 'auto', mb: 0.75 }} />
                    <Skeleton variant="text" width="80%" height={14} sx={{ textAlign: 'center', mx: 'auto' }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : professionals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontSize: '1.15rem' }}>
              Próximamente nuevos estilistas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary' }}>
              Estamos ampliando nuestro equipo. ¡Vuelve pronto!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {professionals.map((prof) => (
              <Grid item xs={12} sm={6} lg={4} key={prof.id}>
                <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      backgroundColor: (t) => t.palette.custom.surfaceAlt,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {prof.imageUrl ? (
                      <Box
                        component="img"
                        src={imageUrl(prof.imageUrl)}
                        alt={`Retrato de ${prof.nombre} ${prof.apellido}`}
                        loading="lazy"
                        decoding="async"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <>
                          <Box
                            aria-hidden="true"
                            sx={{
                              width: '48%',
                              maxWidth: 110,
                              aspectRatio: '1 / 1',
                              borderRadius: '50%',
                              background: (t) => t.palette.custom.gradientGold,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: 34,
                              fontWeight: 700,
                            }}
                          >
                            {getInitials(prof.nombre, prof.apellido)}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              left: 0,
                              right: 0,
                              textAlign: 'center',
                              color: 'text.disabled',
                              letterSpacing: '0.04em',
                              fontSize: '0.6875rem',
                            }}
                          >
                            Foto no disponible
                          </Typography>
                        </>
                      )}
                    </Box>
                    <CardContent sx={{ py: 1.75, px: 1.75, '&:last-child': { pb: 1.75 } }}>
                      <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', color: 'text.primary', mb: 1, textAlign: 'center' }}>
                        {prof.nombre} {prof.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 1.5, textAlign: 'center' }}>
                        {prof.especialidades
                          ? prof.especialidades
                          : 'Estilista del equipo. Consultá sus servicios disponibles al reservar.'}
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          component={Link}
                          to={`/reservar?professional=${prof.id}`}
                          variant="outlined"
                          size="small"
                          startIcon={<ArrowForward fontSize="small" />}
                          sx={{ borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'action.hover' } }}
                        >
                        Reservar con {prof.nombre}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PublicProfessionalsPage;