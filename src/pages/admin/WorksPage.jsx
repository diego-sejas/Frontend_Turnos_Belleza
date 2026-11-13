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
  AvatarGroup,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Public as PublishIcon,
  PublicOff as UnpublishIcon,
} from '@mui/icons-material';
import { worksApi } from '../../services/works';
import { imageUrl } from '../../services/images';
import WorkFormDialog from '../../components/WorkFormDialog';

const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const [orderBy, setOrderBy] = useState('titulo');
  const [order, setOrder] = useState('asc');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [viewingWork, setViewingWork] = useState(null);

  const fetchWorks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await worksApi.list({ page: page + 1, limit: rowsPerPage });
      setWorks(response.data.data.works);
      setTotal(response.data.data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar trabajos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [page, rowsPerPage]);

  const visibleWorks = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? works.filter((work) => (
        work.titulo?.toLowerCase().includes(term) ||
        work.categoria?.toLowerCase().includes(term) ||
        work.descripcion?.toLowerCase().includes(term)
      ))
      : works;

    return [...filtered].sort((a, b) => {
      let result = 0;
      if (orderBy === 'categoria') {
        result = (a.categoria || '').localeCompare(b.categoria || '', 'es', { sensitivity: 'base' });
      } else if (orderBy === 'fecha') {
        result = (new Date(a.fecha || 0)) - (new Date(b.fecha || 0));
      } else {
        result = (a.titulo || '').localeCompare(b.titulo || '', 'es', { sensitivity: 'base' });
      }
      return order === 'asc' ? result : -result;
    });
  }, [works, search, orderBy, order]);

  const handleCreate = () => {
    setEditingWork(null);
    setDialogOpen(true);
  };

  const handleEdit = (work) => {
    setEditingWork(work);
    setDialogOpen(true);
  };

  const handleView = (work) => {
    setViewingWork(work);
  };

  const handleTogglePublish = async (work) => {
    setLoading(true);
    setError('');
    try {
      await worksApi.update(work.id, { isPublished: !work.isPublished });
      setSuccess(work.isPublished ? 'Trabajo despublicado' : 'Trabajo publicado');
      fetchWorks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (work) => {
    if (!window.confirm(`¿Está seguro de desactivar el trabajo "${work.titulo}"?`)) {
      return;
    }
    setLoading(true);
    try {
      await worksApi.delete(work.id);
      setSuccess('Trabajo desactivado exitosamente');
      fetchWorks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar el trabajo');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingWork(null);
  };

  const handleDialogSuccess = () => {
    setSuccess('Trabajo guardado exitosamente');
    fetchWorks();
    handleDialogClose();
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-AR');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Trabajos Realizados
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Trabajo
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
            <TextField
              placeholder="Buscar por título, categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              variant="outlined"
              sx={{ flexGrow: 1, minWidth: 200, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'titulo'}
                      direction={orderBy === 'titulo' ? order : 'asc'}
                      onClick={() => handleRequestSort('titulo')}
                    >
                      Título
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'categoria'}
                      direction={orderBy === 'categoria' ? order : 'asc'}
                      onClick={() => handleRequestSort('categoria')}
                    >
                      Categoría
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Profesional</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'fecha'}
                      direction={orderBy === 'fecha' ? order : 'asc'}
                      onClick={() => handleRequestSort('fecha')}
                    >
                      Fecha
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Publicado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleWorks.map((work) => (
                  <TableRow key={work.id} hover>
                    <TableCell padding="checkbox">
                      {work.imageUrls && work.imageUrls.length > 0 ? (
                        <AvatarGroup max={2} sx={{ justifyContent: 'flex-end' }}>
                          {work.imageUrls.map((url) => (
                            <Avatar
                              key={url}
                              variant="rounded"
                              src={imageUrl(url)}
                              alt={work.titulo}
                              sx={{ width: 40, height: 40, bgcolor: 'action.hover' }}
                            />
                          ))}
                        </AvatarGroup>
                      ) : (
                        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'action.hover', color: 'text.disabled' }}>
                          {work.titulo?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>{work.titulo}</TableCell>
                    <TableCell>
                      {work.categoria || <Typography variant="body2" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell>
                      {work.professional
                        ? `${work.professional.nombre || ''} ${work.professional.apellido || ''}`.trim()
                        : <Typography variant="body2" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell>{formatDate(work.fecha)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={work.isPublished ? 'Publicado' : 'Borrador'}
                        color={work.isPublished ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver">
                        <IconButton size="small" onClick={() => handleView(work)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={work.isPublished ? 'Despublicar' : 'Publicar'}>
                        <IconButton size="small" color={work.isPublished ? 'warning' : 'success'} onClick={() => handleTogglePublish(work)}>
                          {work.isPublished ? <UnpublishIcon /> : <PublishIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(work)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Desactivar">
                        <IconButton size="small" color="error" onClick={() => handleDelete(work)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {visibleWorks.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron trabajos
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
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

      <WorkFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        work={editingWork}
        loading={loading}
      />

      {viewingWork && (
        <Dialog open={!!viewingWork} onClose={() => setViewingWork(null)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle del Trabajo</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {viewingWork.imageUrls && viewingWork.imageUrls.length > 0 && (
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                  {viewingWork.imageUrls.map((url) => (
                    <Box
                      key={url}
                      component="img"
                      src={imageUrl(url)}
                      alt={viewingWork.titulo}
                      sx={{
                        width: 140,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ))}
                </Stack>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Título</Typography>
                <Typography variant="body1">{viewingWork.titulo}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Descripción</Typography>
                <Typography variant="body1">{viewingWork.descripcion || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Categoría</Typography>
                <Typography variant="body1">{viewingWork.categoria || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Profesional</Typography>
                <Typography variant="body1">
                  {viewingWork.professional
                    ? `${viewingWork.professional.nombre || ''} ${viewingWork.professional.apellido || ''}`.trim()
                    : '—'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Fecha</Typography>
                <Typography variant="body1">{formatDate(viewingWork.fecha)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Estado</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={viewingWork.isPublished ? 'Publicado' : 'Borrador'}
                    color={viewingWork.isPublished ? 'success' : 'default'}
                  />
                  <Chip
                    label={viewingWork.isActive === false ? 'Inactivo' : 'Activo'}
                    color={viewingWork.isActive === false ? 'default' : 'success'}
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingWork(null)}>Cerrar</Button>
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

export default WorksPage;
