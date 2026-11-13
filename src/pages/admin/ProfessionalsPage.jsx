import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { professionalsApi } from '../../services/professionals';
import { imageUrl } from '../../services/images';
import { schedulesApi } from '../../services/schedules';
import ProfessionalFormDialog from '../../components/ProfessionalFormDialog';

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [activeOnly, setActiveOnly] = useState(true);
  const [search, setSearch] = useState('');

  const [orderBy, setOrderBy] = useState('nombre');
  const [order, setOrder] = useState('asc');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [viewingProfessional, setViewingProfessional] = useState(null);
  const [viewingSchedules, setViewingSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  const fetchProfessionals = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        activeOnly,
      };
      const response = await professionalsApi.list(params);
      setProfessionals(response.data.data.professionals);
      setTotal(response.data.data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar profesionales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [page, rowsPerPage, activeOnly]);

  const visibleProfessionals = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? professionals.filter((professional) => (
        professional.nombre?.toLowerCase().includes(term) ||
        professional.apellido?.toLowerCase().includes(term) ||
        professional.email?.toLowerCase().includes(term) ||
        professional.especialidades?.toLowerCase().includes(term)
      ))
      : professionals;

    const sorted = [...filtered].sort((a, b) => {
      const result = `${a.nombre || ''} ${a.apellido || ''}`
        .localeCompare(`${b.nombre || ''} ${b.apellido || ''}`, 'es', { sensitivity: 'base' });
      return order === 'asc' ? result : -result;
    });

    return sorted;
  }, [professionals, search, order, orderBy]);

  const getServiceId = (service) => String(service?.id || service?._id || service);
  const getServiceLabel = (service) => service?.name || service;

  const handleCreate = () => {
    setEditingProfessional(null);
    setDialogOpen(true);
  };

  const handleEdit = (professional) => {
    setEditingProfessional(professional);
    setDialogOpen(true);
  };

  const handleView = async (professional) => {
    setViewingProfessional(professional);
    setSchedulesLoading(true);
    try {
      const response = await schedulesApi.getByProfessional(professional.id);
      setViewingSchedules(response.data.data.schedules || []);
    } catch (err) {
      setViewingSchedules([]);
      console.error('Error loading schedules:', err);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const handleDelete = async (professional) => {
    if (!window.confirm(`¿Está seguro de desactivar al profesional "${professional.nombre} ${professional.apellido}"?`)) {
      return;
    }
    setLoading(true);
    try {
      await professionalsApi.delete(professional.id);
      setSuccess('Profesional desactivado exitosamente');
      fetchProfessionals();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar profesional');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProfessional(null);
  };

  const handleDialogSuccess = () => {
    setSuccess('Profesional guardado exitosamente');
    fetchProfessionals();
    handleDialogClose();
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Profesionales
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Profesional
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ flexGrow: 1, minWidth: 200, maxWidth: 400 }}>
              <TextField
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={activeOnly}
                label="Estado"
                onChange={(e) => setActiveOnly(e.target.value === 'true')}
                size="small"
              >
                <MenuItem value={true}>Solo activos</MenuItem>
                <MenuItem value={false}>Todos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'nombre'}
                      direction={orderBy === 'nombre' ? order : 'asc'}
                      onClick={() => handleRequestSort('nombre')}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Especialidades</TableCell>
                  <TableCell align="center">Servicios</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleProfessionals.map((professional) => (
                  <TableRow key={professional.id} hover>
                    <TableCell padding="checkbox">
                      <Avatar
                        src={professional.imageUrl ? imageUrl(professional.imageUrl) : undefined}
                        alt={`${professional.nombre} ${professional.apellido}`}
                        sx={{ width: 44, height: 44, bgcolor: 'action.hover', color: 'text.disabled' }}
                      >
                        {professional.nombre?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>{professional.nombre} {professional.apellido}</TableCell>
                    <TableCell>{professional.email || <Typography variant="body2" color="text.secondary">—</Typography>}</TableCell>
                    <TableCell>{professional.phone || <Typography variant="body2" color="text.secondary">—</Typography>}</TableCell>
                    <TableCell>
                      {professional.especialidades ? (
                        professional.especialidades.length > 40
                          ? `${professional.especialidades.substring(0, 40)}...`
                          : professional.especialidades
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {professional.services && professional.services.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                          {professional.services.map((service) => (
                            <Chip key={getServiceId(service)} label={getServiceLabel(service)} size="small" variant="outlined" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={professional.isActive ? 'Activo' : 'Inactivo'}
                        color={professional.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver">
                        <IconButton size="small" onClick={() => handleView(professional)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(professional)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {professional.isActive && (
                        <Tooltip title="Desactivar">
                          <IconButton size="small" color="error" onClick={() => handleDelete(professional)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {visibleProfessionals.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron profesionales
              </Typography>
            </Box>
          )}

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      <ProfessionalFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        professional={editingProfessional}
        loading={loading}
      />

      {viewingProfessional && (
        <Dialog open={!!viewingProfessional} onClose={() => setViewingProfessional(null)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Profesional</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={viewingProfessional.imageUrl ? imageUrl(viewingProfessional.imageUrl) : undefined}
                  alt={`${viewingProfessional.nombre} ${viewingProfessional.apellido}`}
                  sx={{ width: 120, height: 120, bgcolor: 'action.hover', color: 'text.disabled', fontSize: 40 }}
                >
                  {viewingProfessional.nombre?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Nombre completo</Typography>
                <Typography variant="body1">{viewingProfessional.nombre} {viewingProfessional.apellido}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Email</Typography>
                <Typography variant="body1">{viewingProfessional.email || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Teléfono</Typography>
                <Typography variant="body1">{viewingProfessional.phone || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Especialidades</Typography>
                <Typography variant="body1">{viewingProfessional.especialidades || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Servicios</Typography>
                {viewingProfessional.services && viewingProfessional.services.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {viewingProfessional.services.map((service) => (
                      <Chip key={getServiceId(service)} label={getServiceLabel(service)} variant="outlined" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">—</Typography>
                )}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Estado</Typography>
                <Chip
                  label={viewingProfessional.isActive ? 'Activo' : 'Inactivo'}
                  color={viewingProfessional.isActive ? 'success' : 'default'}
                />
              </Box>

              <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Horarios Laborales
                </Typography>
                {schedulesLoading ? (
                  <CircularProgress size={24} />
                ) : viewingSchedules.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay horarios laborales configurados.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                      const daySchedules = viewingSchedules.filter(
                        (s) => s.dayOfWeek === dayOfWeek && s.isActive
                      );
                      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                      if (daySchedules.length === 0) {
                        return (
                          <Box key={dayOfWeek} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ width: 100, flexShrink: 0, color: 'text.secondary' }}>
                              {dayNames[dayOfWeek]}:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              No trabaja
                            </Typography>
                          </Box>
                        );
                      }
                      return (
                        <Box key={dayOfWeek} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ width: 100, flexShrink: 0 }}>
                            {dayNames[dayOfWeek]}:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {daySchedules.map((s) => (
                              <Chip
                                key={s.id}
                                label={`${s.startTime} - ${s.endTime}`}
                                size="small"
                                variant="outlined"
                                color="success"
                              />
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingProfessional(null)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfessionalsPage;