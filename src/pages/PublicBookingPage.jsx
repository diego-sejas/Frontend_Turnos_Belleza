import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Skeleton,
} from '@mui/material';
import { CalendarMonth, Person, AccessTime, Spa, ArrowForward, CheckCircle, LocalOffer, Star } from '@mui/icons-material';
import { publicCatalogApi } from '../services/publicCatalog';
import { reservationsApi } from '../services/reservations';

const PublicBookingPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState(null);
  const [clientRequestId] = useState(() => crypto.randomUUID());
  const [formData, setFormData] = useState({
    serviceId: '',
    professionalId: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, professionalsRes] = await Promise.all([
        publicCatalogApi.services({ limit: 100 }),
        publicCatalogApi.professionals({ limit: 100 }),
      ]);
      setServices(servicesRes.data.data.services);
      setProfessionals(professionalsRes.data.data.professionals);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stepsConfig = [
    { label: 'Servicio', icon: <Spa /> },
    { label: 'Estilista', icon: <Person /> },
    { label: 'Fecha y Hora', icon: <AccessTime /> },
    { label: 'Tus Datos', icon: <LocalOffer /> },
  ];

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < stepsConfig.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.professionalId || !formData.date || !formData.time || !formData.name || !formData.email || !formData.phone) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    const startTime = `${formData.date}T${formData.time}:00`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setSubmitting(true);
    setError(null);

    try {
      const response = await reservationsApi.create({
        serviceId: formData.serviceId,
        professionalId: formData.professionalId,
        startTime,
        timezone,
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        notes: formData.notes,
        clientRequestId,
      });

      if (response.data && response.data.status === 'success') {
        setError(null);
        alert('Reserva solicitada correctamente. Te contactaremos para confirmar.');
        setStep(0);
        setFormData({
          serviceId: '',
          professionalId: '',
          date: '',
          time: '',
          name: '',
          email: '',
          phone: '',
          notes: '',
        });
      } else {
        setError(response.data?.message || 'Error al crear la reserva');
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error || 'Error al crear la reserva';
      setError(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: 'text.primary' }}>
              1. Elige tu servicio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 3 }}>
              Selecciona el servicio que deseas reservar
            </Typography>
            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} lg={4} key={service.id}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '2px solid',
                      borderColor: formData.serviceId === service.id ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                    }}
                    onClick={() => handleChange('serviceId', formData.serviceId === service.id ? '' : service.id)}
                  >
                    <CardContent sx={{ py: 2, px: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex.start', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
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
                      <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 1 }}>
                        {service.description || 'Servicio profesional personalizado'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<AccessTime fontSize="small" />}
                          label={formatDuration(service.durationMinutes)}
                          size="small"
                          variant="outlined"
                        />
                        {service.requiresDeposit && (
                          <Chip
                            icon={<LocalOffer fontSize="small" />}
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
              {services.length === 0 && (
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No hay servicios disponibles en este momento.
                </Typography>
              )}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: 'text.primary' }}>
              2. Elige tu estilista
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 3 }}>
              Selecciona con quién quieres tu cita (opcional)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={4}>
                <Card
                  sx={{
                    height: '100%',
                    border: '2px solid',
                    borderColor: formData.professionalId === '' ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                  }}
                  onClick={() => handleChange('professionalId', formData.professionalId === '' ? '' : '')}
                >
                  <CardContent sx={{ py: 2, px: 2, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 24,
                        fontWeight: 700,
                        mx: 'auto',
                        mb: 1.5,
                      }}
                    >
                      Cualquiera
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                      Cualquier disponible
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary' }}>
                      Te asignamos al primer estilista libre
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {professionals.map((prof) => (
                <Grid item xs={12} sm={6} lg={4} key={prof.id}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '2px solid',
                      borderColor: formData.professionalId === prof.id ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                    }}
                    onClick={() => handleChange('professionalId', formData.professionalId === prof.id ? '' : prof.id)}
                  >
                    <CardContent sx={{ py: 2, px: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: 20,
                            fontWeight: 700,
                          }}
                        >
                          {(prof.nombre?.[0] || '') + (prof.apellido?.[0] || '')}
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                            {prof.nombre} {prof.apellido}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ color: 'text.disabled' }}>
                            Estilista
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        <Chip
                          icon={<Star fontSize="small" />}
                          label="5.0"
                          size="small"
                          variant="outlined"
                          color="warning"
                        />
                        <Chip
                          label="Disponible"
                          size="small"
                          variant="outlined"
                          color="success"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: 'text.primary' }}>
              3. Fecha y hora
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 3 }}>
              Selecciona cuándo quieres tu cita
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, p: 2, backgroundColor: (t) => t.palette.custom.surfaceAlt, borderRadius: 10 }}>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Horario de atención:</strong> Lunes a Sábado 9:00 - 20:00
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ color: 'text.disabled' }}>
                La disponibilidad final se confirmará según la agenda del estilista seleccionado.
              </Typography>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: 'text.primary' }}>
              4. Tus datos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'text.secondary', mb: 3 }}>
              Completa tu información para confirmar la reserva
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  autoComplete="name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  autoComplete="tel"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notas adicionales"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Alergias, preferencias, indicaciones especiales..."
                />
              </Grid>
            </Grid>

            {currentService && (
              <Box sx={{ mt: 4, p: 2, backgroundColor: (t) => t.palette.custom.surfaceAlt, borderRadius: 10 }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', mb: 1 }}>
                  Resumen de tu reserva
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Servicio:</strong> {currentService.name} - {formatPrice(currentService.price)} ({formatDuration(currentService.durationMinutes)})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estilista:</strong> {currentProfessional ? `${currentProfessional.nombre} ${currentProfessional.apellido}` : 'Cualquier disponible'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {formData.date || 'Por definir'} <strong>Hora:</strong> {formData.time || 'Por definir'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cliente:</strong> {formData.name || 'Por completar'} - {formData.email || 'Por completar'} - {formData.phone || 'Por completar'}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const currentService = services.find(s => s.id === formData.serviceId);
  const currentProfessional = professionals.find(p => p.id === formData.professionalId);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #2A2622 0%, #4A423A 100%)',
          color: '#ffffff',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.2)',
                  mb: 2,
                }}
              >
                <CalendarMonth sx={{ fontSize: 28, color: '#ffffff' }} />
              </Box>
              <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
                Reserva tu Cita
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Elige tu servicio, estilista y horario preferido en pocos pasos.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Booking Form */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, mt: -4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
            {stepsConfig.map((s) => (
              <Step key={s.label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': { fontWeight: 600 },
                    '&.Mui-active': { color: 'primary.main' },
                    '&.Mui-completed': { color: '#10B981' },
                  }}
                >
                  {s.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={step === 0 ? null : <ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                  onClick={handleBack}
                  disabled={step === 0}
                  sx={{ '&:hover': { borderColor: 'primary.main', color: 'primary.dark' } }}
                >
                  {step === 0 ? 'Cancelar' : 'Anterior'}
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {step < stepsConfig.length - 1 ? (
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={handleNext}
                      sx={{ background: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)', '&:hover': { background: 'linear-gradient(135deg, #B98A4B 0%, #8F652D 100%)' } }}
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={<CheckCircle />}
                      type="submit"
                      disabled={submitting}
                      sx={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' } }}
                    >
                      {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PublicBookingPage;