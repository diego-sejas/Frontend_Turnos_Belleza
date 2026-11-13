import { useEffect, useState } from 'react';
import { Box, Button, Chip, Container, Grid, Typography, Skeleton } from '@mui/material';
import { CalendarMonth, Image as ImageIcon, Spa } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { publicCatalogApi } from '../../services/publicCatalog';
import { imageUrl } from '../../services/images';

const DecorativeTile = ({ tone }) => {
  const tones = {
    gold: (theme) => theme.palette.custom.gradientGold,
    surface: (theme) => theme.palette.custom.surfaceBadge,
    espresso: (theme) => theme.palette.custom.heroGradient,
  };

  return (
    <Grid item xs={12} sm={4}>
      <Box
        aria-hidden="true"
        sx={{
          minHeight: { xs: 90, sm: 130, md: 155 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tones[tone],
        }}
      >
        <Box
          component={ImageIcon}
          sx={{ fontSize: { xs: 24, sm: 36 }, color: 'rgba(255, 255, 255, 0.35)' }}
        />
      </Box>
    </Grid>
  );
};

const WorksGallery = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchWorks = async () => {
      try {
        const response = await publicCatalogApi.works({ limit: 6 });
        if (active) setWorks(response.data.data.works || []);
      } catch {
        if (active) setWorks([]);
      } finally {
        if (active) setLoading(false);
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
    <Box
      component="section"
      sx={{ py: { xs: 3.5, md: 5 }, backgroundColor: 'background.default' }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 2.5, md: 3.5 }, maxWidth: 680, mx: 'auto' }}>
          <Typography
            variant="overline"
            component="p"
            sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 600, fontSize: '0.6875rem', mb: 0.5 }}
          >
            Galería
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontSize: { xs: '1.25rem', md: '1.4rem' }, fontWeight: 600, lineHeight: 1.15, color: 'text.primary' }}
          >
            Trabajos realizados
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.75 }}>
            {hasWorks
              ? 'Una muestra de trabajos reales de nuestro equipo.'
              : 'Estamos preparando nuestra galería con fotografías reales autorizadas.'}
          </Typography>
        </Box>

        {loading && (
          <Grid container spacing={1.25}>
            {[0, 1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" sx={{ height: { xs: 120, sm: 140, md: 160 }, borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && hasWorks && (
          <Grid container spacing={1.25}>
            {works.map((work) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={work.id}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: { xs: 120, sm: 140, md: 160 },
                  }}
                >
                  {getCover(work) ? (
                    <Box
                      component="img"
                      src={getCover(work)}
                      alt={work.titulo}
                      loading="lazy"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => theme.palette.custom.gradientGold,
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.55)' }} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 1.25,
                      background: 'linear-gradient(180deg, rgba(18,16,14,0) 40%, rgba(18,16,14,0.85) 100%)',
                    }}
                  >
                    {work.categoria && (
                      <Chip
                        label={work.categoria}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          mb: 0.5,
                          height: 20,
                          fontSize: '0.6875rem',
                          color: '#FDF8F0',
                          borderColor: 'rgba(253, 248, 240, 0.5)',
                          backgroundColor: 'rgba(253, 248, 240, 0.08)',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                        variant="outlined"
                      />
                    )}
                    <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', color: '#FDF8F0', fontWeight: 600, lineHeight: 1.25 }}>
                      {work.titulo}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !hasWorks && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              maxWidth: { xs: '100%', sm: 600, md: 680 },
              mx: 'auto',
            }}
          >
            <Grid container spacing={0}>
              <DecorativeTile tone="surface" />
              <DecorativeTile tone="gold" />
              <DecorativeTile tone="espresso" />
            </Grid>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: 2.5,
                background:
                  'linear-gradient(180deg, rgba(18,16,14,0.55) 0%, rgba(18,16,14,0.78) 100%)',
              }}
            >
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
                  mb: 1,
                }}
              >
                <Spa sx={{ fontSize: 18, color: '#E8D5B5' }} />
              </Box>
              <Chip
                label="Próximamente"
                size="small"
                sx={{
                  mb: 0.75,
                  height: 20,
                  fontSize: '0.6875rem',
                  color: '#FDF8F0',
                  borderColor: 'rgba(253, 248, 240, 0.5)',
                  backgroundColor: 'rgba(253, 248, 240, 0.08)',
                  '& .MuiChip-label': { px: 0.75 },
                }}
                variant="outlined"
              />
              <Typography
                variant="h4"
                component="h3"
                sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 600, color: '#FDF8F0', mb: 0.5 }}
              >
                Muy pronto, lo mejor de nuestro trabajo
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '0.8125rem', color: 'rgba(253, 248, 240, 0.85)', maxWidth: 440, mb: 1.5 }}
              >
                Cuando tengamos fotografías reales de trabajos autorizados, las vas a ver aquí.
              </Typography>
              <Button
                component={Link}
                to="/reservar"
                variant="contained"
                size="small"
                startIcon={<CalendarMonth sx={{ fontSize: '0.85rem' }} />}
                sx={{ py: 0.6, px: 2, fontSize: '0.8125rem' }}
              >
                Reservar turno
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WorksGallery;
