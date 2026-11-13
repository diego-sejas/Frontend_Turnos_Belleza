import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Container, Stack, Grid, Skeleton, Card, CardActionArea, CardMedia } from '@mui/material';
import { Image, ArrowForward, PhotoLibrary } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { publicCatalogApi } from '../services/publicCatalog';
import { imageUrl } from '../services/images';

const PublicWorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchWorks = async () => {
      try {
        const response = await publicCatalogApi.works({ limit: 50 });
        if (active) {
          setWorks(response.data.data.works || []);
        }
      } catch (err) {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchWorks();
    return () => { active = false; };
  }, []);

  const getCover = (work) => {
    const first = work.imageUrls?.[0];
    return first ? imageUrl(first) : null;
  };

  const hasWorks = works.length > 0;

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 4 },
          background: (theme) => theme.palette.custom.gradientEspresso,
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
              width: 64,
              height: 64,
              borderRadius: 4,
              backgroundColor: 'rgba(210, 172, 114, 0.16)',
              border: '1px solid',
              borderColor: 'rgba(210, 172, 114, 0.45)',
              mb: 3,
            }}
          >
            <Image sx={{ fontSize: 32, color: '#E8D5B5' }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Galería de Trabajos
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ color: 'rgba(253, 248, 240, 0.86)', maxWidth: 600, mx: 'auto', fontWeight: 400 }}
          >
            {hasWorks
              ? 'Una selección de trabajos reales realizados por nuestro equipo.'
              : 'Estamos preparando una galería con trabajos reales de nuestro equipo.'}
          </Typography>
        </Container>
      </Box>

      {/* Gallery */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, mt: -4, position: 'relative', zIndex: 1 }}>
        {loading && (
          <Grid container spacing={3}>
            {[0, 1, 2].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" sx={{ height: 280, borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && hasWorks && (
          <Grid container spacing={3}>
            {works.map((work) => (
              <Grid item xs={12} sm={6} md={4} key={work.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {getCover(work) ? (
                    <CardActionArea disabled sx={{ cursor: 'default' }}>
                      <CardMedia
                        component="img"
                        image={getCover(work)}
                        alt={work.titulo}
                        loading="lazy"
                        sx={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
                      />
                    </CardActionArea>
                  ) : (
                    <Box
                      sx={{
                        aspectRatio: '4 / 3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => theme.palette.custom.gradientGold,
                      }}
                    >
                      <PhotoLibrary sx={{ fontSize: 48, color: 'rgba(255,255,255,0.6)' }} />
                    </Box>
                  )}
                  <Box sx={{ p: 2.5, flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {work.categoria && (
                        <Chip label={work.categoria} size="small" color="primary" variant="outlined" />
                      )}
                    </Stack>
                    <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                      {work.titulo}
                    </Typography>
                    {work.descripcion && (
                      <Typography variant="body2" color="text.secondary">
                        {work.descripcion}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !hasWorks && !error && (
          <Box
            sx={{
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              backgroundColor: 'background.paper',
              py: { xs: 6, md: 9 },
              px: { xs: 3, md: 6 },
            }}
          >
            <PhotoLibrary sx={{ fontSize: 56, color: 'palette.custom.iconMuted', mb: 2 }} />
            <Typography variant="h5" component="h2" fontWeight={600} sx={{ color: 'text.primary', mb: 1.5 }}>
              Próximamente
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 520, mx: 'auto', mb: 4 }}
            >
              Muy pronto vas a poder recorrer aquí los trabajos reales de nuestras
              estilistas. Mientras tanto, reservá tu turno y sé parte de la galería.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/reservar"
                variant="contained"
                size="large"
                startIcon={<ArrowForward />}
                sx={{ px: 4, py: 1.5 }}
              >
                Reservar mi turno
              </Button>
              <Button
                component={Link}
                to="/servicios"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Ver servicios
              </Button>
            </Stack>
          </Box>
        )}

        {!loading && !hasWorks && error && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No pudimos cargar la galería en este momento.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PublicWorksPage;
