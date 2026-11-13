import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Skeleton,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  MiscellaneousServices,
  Badge,
  CalendarMonth,
  People,
  Payments,
  Build,
  ArrowForward,
  Spa,
} from '@mui/icons-material';
import { servicesApi } from '../../services/services';
import { professionalsApi } from '../../services/professionals';
import { reservationsApi } from '../../services/reservations';
import { clientsApi } from '../../services/clients';
import { paymentsApi } from '../../services/payments';

const formatMoney = (amount, currency = 'ARS') =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format((amount || 0) / 100);

const reservationStatusConfig = {
  PENDING: { label: 'Pendiente', color: 'warning' },
  CONFIRMED: { label: 'Confirmada', color: 'info' },
  IN_PROGRESS: { label: 'En curso', color: 'primary' },
  COMPLETED: { label: 'Completada', color: 'success' },
  CANCELLED: { label: 'Cancelada', color: 'error' },
  NO_SHOW: { label: 'Sin asistencia', color: 'error' },
};

const formatReservationDate = (iso) => {
  const date = new Date(iso);
  const day = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
};

const statToneGradients = {
  services: {
    light: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)',
    dark: 'linear-gradient(135deg, #B98A4B 0%, #8F652D 100%)',
  },
  professionals: {
    light: 'linear-gradient(135deg, #B98A4B 0%, #8F652D 100%)',
    dark: 'linear-gradient(135deg, #C79A57 0%, #9A7139 100%)',
  },
  reservations: {
    light: 'linear-gradient(135deg, #D2AC72 0%, #B98A4B 100%)',
    dark: 'linear-gradient(135deg, #D2AC72 0%, #B98A4B 100%)',
  },
  clients: {
    light: 'linear-gradient(135deg, #A87A3C 0%, #7E5A2B 100%)',
    dark: 'linear-gradient(135deg, #9A7139 0%, #7E5A2B 100%)',
  },
  payments: {
    light: 'linear-gradient(135deg, #4A423A 0%, #2A2622 100%)',
    dark: 'linear-gradient(135deg, #4A423A 0%, #1C1916 100%)',
  },
  works: {
    light: 'linear-gradient(135deg, #6E655B 0%, #4A423A 100%)',
    dark: 'linear-gradient(135deg, #6E655B 0%, #3A342E 100%)',
  },
};

const resolveStatGradient = (tone) => {
  const pair = statToneGradients[tone] || statToneGradients.services;
  return (theme) => (theme.palette.mode === 'dark' ? pair.dark : pair.light);
};

const StatCard = ({ icon, title, value, secondary, tone, loading }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 8px 30px -8px rgba(0, 0, 0, 0.55)'
            : '0 8px 30px -8px rgba(42, 38, 32, 0.20)',
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1, p: 3, '&:last-child': { pb: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            background: resolveStatGradient(tone),
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 6px 14px -4px rgba(0, 0, 0, 0.5)'
                : '0 6px 14px -4px rgba(42, 38, 32, 0.28)',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton width={60} height={40} />
      ) : (
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
          {value}
        </Typography>
      )}
      {secondary && !loading && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {secondary}
        </Typography>
      )}
      {loading && <Skeleton width={120} height={16} sx={{ mt: 0.5 }} />}
    </CardContent>
  </Card>
);

const quickLinks = [
  { label: 'Servicios', path: '/admin/services', icon: <MiscellaneousServices fontSize="small" /> },
  { label: 'Profesionales', path: '/admin/professionals', icon: <Badge fontSize="small" /> },
  { label: 'Reservas', path: '/admin/reservations', icon: <CalendarMonth fontSize="small" /> },
  { label: 'Clientes', path: '/admin/clients', icon: <People fontSize="small" /> },
  { label: 'Pagos', path: '/admin/payments', icon: <Payments fontSize="small" /> },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalServices: null,
    activeServices: null,
    totalProfessionals: null,
    activeProfessionals: null,
    totalReservations: null,
    pendingReservations: null,
    totalClients: null,
    paymentsSummary: null,
    totalTrabajos: null,
  });
  const [recentReservations, setRecentReservations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      const [totalSvc, activeSvc, totalPro, activePro, recentRes, pendingRes, clients, paySummary, completedRes] = await Promise.allSettled([
        servicesApi.list({ activeOnly: false, page: 1, limit: 1 }),
        servicesApi.list({ activeOnly: true, page: 1, limit: 1 }),
        professionalsApi.list({ activeOnly: false, page: 1, limit: 1 }),
        professionalsApi.list({ activeOnly: true, page: 1, limit: 1 }),
        reservationsApi.list({ page: 1, limit: 5 }),
        reservationsApi.list({ status: 'PENDING', page: 1, limit: 1 }),
        clientsApi.list({ page: 1, limit: 1 }),
        paymentsApi.summary(),
        reservationsApi.list({ status: 'COMPLETED', page: 1, limit: 1 }),
      ]);

      const newStats = { ...stats };
      const errors = [];

      if (totalSvc.status === 'fulfilled') {
        newStats.totalServices = totalSvc.value.data.data.pagination.total;
      } else {
        errors.push('servicios');
      }

      if (activeSvc.status === 'fulfilled') {
        newStats.activeServices = activeSvc.value.data.data.pagination.total;
      } else {
        errors.push('servicios activos');
      }

      if (totalPro.status === 'fulfilled') {
        newStats.totalProfessionals = totalPro.value.data.data.pagination.total;
      } else {
        errors.push('profesionales');
      }

      if (activePro.status === 'fulfilled') {
        newStats.activeProfessionals = activePro.value.data.data.pagination.total;
      } else {
        errors.push('profesionales activos');
      }

      if (recentRes.status === 'fulfilled') {
        newStats.totalReservations = recentRes.value.data.data.pagination.total;
        setRecentReservations(recentRes.value.data.data.reservations);
      } else {
        errors.push('reservas');
      }

      if (pendingRes.status === 'fulfilled') {
        newStats.pendingReservations = pendingRes.value.data.data.pagination.total;
      } else {
        errors.push('reservas pendientes');
      }

      if (clients.status === 'fulfilled') {
        newStats.totalClients = clients.value.data.data.pagination.total;
      } else {
        errors.push('clientes');
      }

      if (paySummary.status === 'fulfilled') {
        newStats.paymentsSummary = paySummary.value.data.data;
      } else {
        errors.push('pagos');
      }

      if (completedRes.status === 'fulfilled') {
        newStats.totalTrabajos = completedRes.value.data.data.pagination.total;
      } else {
        errors.push('trabajos realizados');
      }

      setStats(newStats);

      if (errors.length > 0) {
        setError(`No se pudo cargar: ${errors.join(', ')}. Verifique su conexión.`);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const inactiveServices =
    stats.totalServices !== null && stats.activeServices !== null
      ? stats.totalServices - stats.activeServices
      : null;

  const inactiveProfessionals =
    stats.totalProfessionals !== null && stats.activeProfessionals !== null
      ? stats.totalProfessionals - stats.activeProfessionals
      : null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen general del negocio
          </Typography>
        </Box>
        <Chip
          icon={<Spa sx={{ fontSize: 16, color: 'primary.main' }} />}
          label="Sistema Belleza"
          variant="outlined"
          sx={{ borderRadius: 2, fontWeight: 500 }}
        />
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<MiscellaneousServices sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Servicios"
            value={loading ? '' : stats.totalServices ?? '—'}
            secondary={
              stats.activeServices !== null
                ? `${stats.activeServices} activos${inactiveServices ? ` · ${inactiveServices} inactivos` : ''}`
                : null
            }
            tone="services"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Badge sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Profesionales"
            value={loading ? '' : stats.totalProfessionals ?? '—'}
            secondary={
              stats.activeProfessionals !== null
                ? `${stats.activeProfessionals} activos${inactiveProfessionals ? ` · ${inactiveProfessionals} inactivos` : ''}`
                : null
            }
            tone="professionals"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CalendarMonth sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Reservas"
            value={loading ? '' : stats.totalReservations ?? '—'}
            secondary={
              stats.pendingReservations !== null
                ? `${stats.pendingReservations} pendientes`
                : null
            }
            tone="reservations"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Clientes"
            value={loading ? '' : stats.totalClients ?? '—'}
            secondary={
              stats.totalClients === 0 ? 'Sin clientes registrados' : null
            }
            tone="clients"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Payments sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Pagos"
            value={loading ? '' : stats.paymentsSummary?.total ?? '—'}
            secondary={
              stats.paymentsSummary !== null
                ? stats.paymentsSummary.approvedCount > 0
                  ? `${stats.paymentsSummary.approvedCount} aprobados · ${formatMoney(stats.paymentsSummary.approvedAmount, stats.paymentsSummary.currency)}`
                  : 'Sin pagos aprobados'
                : null
            }
            tone="payments"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Build sx={{ fontSize: 24, color: '#ffffff' }} />}
            title="Trabajos realizados"
            value={loading ? '' : stats.totalTrabajos ?? '—'}
            secondary={
              stats.totalTrabajos === 0 ? 'Aún no hay trabajos completados' : null
            }
            tone="works"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Últimas reservas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Stack spacing={2}>
                  {[0, 1, 2].map((i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton width="45%" height={20} />
                        <Skeleton width="60%" height={16} sx={{ mt: 0.5 }} />
                      </Box>
                      <Skeleton width={90} height={24} />
                    </Box>
                  ))}
                </Stack>
              ) : recentReservations && recentReservations.length > 0 ? (
                <Stack spacing={1.5}>
                  {recentReservations.map((reservation) => {
                    const statusCfg = reservationStatusConfig[reservation.status] || {
                      label: reservation.status,
                      color: 'default',
                    };
                    return (
                      <Box
                        key={reservation.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {reservation.client?.name || '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {reservation.service?.name || '—'}
                            {reservation.professional
                              ? ` · ${reservation.professional.nombre} ${reservation.professional.apellido}`
                              : ''}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatReservationDate(reservation.startTime)}
                          </Typography>
                          <Chip
                            label={statusCfg.label}
                            color={statusCfg.color}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, minWidth: 110, justifyContent: 'center' }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <CalendarMonth sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {recentReservations === null ? 'No se pudieron cargar las reservas' : 'Todavía no hay reservas registradas'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {recentReservations === null
                      ? 'Verifique su conexión e intente de nuevo.'
                      : 'Las reservas creadas aparecerán aquí.'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Accesos rápidos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {quickLinks.map((link) => (
                    <Button
                      key={link.path}
                      fullWidth
                      variant="outlined"
                      endIcon={<ArrowForward fontSize="small" />}
                      startIcon={link.icon}
                      onClick={() => navigate(link.path)}
                      sx={{
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1,
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Resumen de actividad
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Servicios totales
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalServices ?? '—'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Servicios activos
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Chip
                        label={stats.activeServices ?? '—'}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Profesionales totales
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalProfessionals ?? '—'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Profesionales activos
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Chip
                        label={stats.activeProfessionals ?? '—'}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Reservas
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalReservations ?? '—'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Clientes
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalClients ?? '—'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pagos
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.paymentsSummary?.total ?? '—'}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Trabajos realizados
                    </Typography>
                    {loading ? (
                      <Skeleton width={30} height={20} />
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {stats.totalTrabajos ?? '—'}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
