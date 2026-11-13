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
import { servicesApi } from '../../services/services';
import { imageUrl } from '../../services/images';
import ServiceFormDialog from '../../components/ServiceFormDialog';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [activeOnly, setActiveOnly] = useState(true);
  const [search, setSearch] = useState('');

  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        activeOnly,
      };
      const response = await servicesApi.list(params);
      setServices(response.data.data.services);
      setTotal(response.data.data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, rowsPerPage, activeOnly]);

  const visibleServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? services.filter((service) => (
        service.name?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term)
      ))
      : services;

    const sorted = [...filtered].sort((a, b) => {
      let result = 0;
      if (orderBy === 'price') {
        result = (a.price || 0) - (b.price || 0);
      } else if (orderBy === 'durationMinutes') {
        result = (a.durationMinutes || 0) - (b.durationMinutes || 0);
      } else {
        result = (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
      }
      return order === 'asc' ? result : -result;
    });

    return sorted;
  }, [services, search, orderBy, order]);

  const handleCreate = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleView = (service) => {
    setViewingService(service);
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`¿Está seguro de desactivar el servicio "${service.name}"?`)) {
      return;
    }
    setLoading(true);
    try {
      await servicesApi.delete(service.id);
      setSuccess('Servicio desactivado exitosamente');
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingService(null);
  };

  const handleDialogSuccess = () => {
    setSuccess('Servicio guardado exitosamente');
    fetchServices();
    handleDialogClose();
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatPrice = (price, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Servicios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Servicio
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
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={orderBy === 'durationMinutes'}
                      direction={orderBy === 'durationMinutes' ? order : 'asc'}
                      onClick={() => handleRequestSort('durationMinutes')}
                    >
                      Duración
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={orderBy === 'price' ? order : 'asc'}
                      onClick={() => handleRequestSort('price')}
                    >
                      Precio
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Depósito</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleServices.map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell padding="checkbox">
                      <Avatar
                        variant="rounded"
                        src={service.imageUrl ? imageUrl(service.imageUrl) : undefined}
                        alt={service.name}
                        sx={{ width: 48, height: 48, bgcolor: 'action.hover', color: 'text.disabled' }}
                      >
                        {service.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      {service.description ? (
                        service.description.length > 50
                          ? `${service.description.substring(0, 50)}...`
                          : service.description
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{formatDuration(service.durationMinutes)}</TableCell>
                    <TableCell align="right">{formatPrice(service.price, service.currency)}</TableCell>
                    <TableCell align="center">
                      {service.requiresDeposit ? (
                        <Chip
                          label={service.depositType === 'percentage'
                            ? `${service.depositAmount}%`
                            : formatPrice(service.depositAmount, service.currency)}
                          size="small"
                          color="info"
                        />
                      ) : (
                        <Chip label="No requiere" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={service.isActive ? 'Activo' : 'Inactivo'}
                        color={service.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver">
                        <IconButton size="small" onClick={() => handleView(service)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(service)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {service.isActive && (
                        <Tooltip title="Desactivar">
                          <IconButton size="small" color="error" onClick={() => handleDelete(service)}>
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

          {visibleServices.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron servicios
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

      <ServiceFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        service={editingService}
        loading={loading}
      />

      {viewingService && (
        <Dialog open={!!viewingService} onClose={() => setViewingService(null)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Servicio</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {viewingService.imageUrl && (
                <Box
                  component="img"
                  src={imageUrl(viewingService.imageUrl)}
                  alt={viewingService.name}
                  sx={{
                    width: '100%',
                    maxHeight: 240,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              )}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Nombre</Typography>
                <Typography variant="body1">{viewingService.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Descripción</Typography>
                <Typography variant="body1">{viewingService.description || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Duración</Typography>
                <Typography variant="body1">{formatDuration(viewingService.durationMinutes)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Precio</Typography>
                <Typography variant="body1">{formatPrice(viewingService.price, viewingService.currency)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Depósito</Typography>
                <Typography variant="body1">
                  {viewingService.requiresDeposit
                    ? viewingService.depositType === 'percentage'
                      ? `${viewingService.depositAmount}%`
                      : formatPrice(viewingService.depositAmount, viewingService.currency)
                    : 'No requiere'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Estado</Typography>
                <Chip
                  label={viewingService.isActive ? 'Activo' : 'Inactivo'}
                  color={viewingService.isActive ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingService(null)}>Cerrar</Button>
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

export default ServicesPage;