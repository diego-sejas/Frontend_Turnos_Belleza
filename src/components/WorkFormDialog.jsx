import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { worksApi } from '../services/works';
import { professionalsApi } from '../services/professionals';
import { imagesApi } from '../services/images';
import MultiImageUploadField from './MultiImageUploadField';

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const WorkFormDialog = ({ open, onClose, onSuccess, work, loading }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    fecha: '',
    professionalId: '',
    isPublished: false,
  });
  const [images, setImages] = useState([]);
  const [professionalOptions, setProfessionalOptions] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await professionalsApi.list({ activeOnly: true, limit: 100 });
        setProfessionalOptions(response.data.data.professionals);
      } catch (err) {
        console.error('Error loading professionals:', err);
      }
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (work) {
      setFormData({
        titulo: work.titulo || '',
        descripcion: work.descripcion || '',
        categoria: work.categoria || '',
        fecha: toDateInputValue(work.fecha),
        professionalId: work.professional?.id || work.professional?._id || '',
        isPublished: Boolean(work.isPublished),
      });
      setImages((work.imageIds || []).map((id, index) => ({
        id,
        url: work.imageUrls?.[index] || `/api/images/${id}`,
      })));
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        fecha: '',
        professionalId: '',
        isPublished: false,
      });
      setImages([]);
    }
    setError('');
  }, [work, open]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const resolvedImageIds = [];
      for (const item of images) {
        if (item.id) {
          resolvedImageIds.push(item.id);
        } else if (item.file) {
          const uploadResponse = await imagesApi.upload(item.file);
          resolvedImageIds.push(uploadResponse.data.data.id);
        }
      }

      const payload = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria.trim(),
        imageIds: resolvedImageIds,
        isPublished: formData.isPublished,
      };

      if (formData.professionalId) {
        payload.professionalId = formData.professionalId;
      } else if (work) {
        payload.professionalId = null;
      }

      if (formData.fecha) {
        payload.fecha = new Date(`${formData.fecha}T00:00:00`).toISOString();
      }

      if (work) {
        await worksApi.update(work.id, payload);
      } else {
        await worksApi.create(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el trabajo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{work ? 'Editar Trabajo' : 'Nuevo Trabajo'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Título *"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Categoría"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Ej: Color, Corte"
                sx={{ flexGrow: 1, minWidth: 200 }}
              />

              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
            </Box>

            <Autocomplete
              options={professionalOptions}
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={professionalOptions.find((p) => p.id === formData.professionalId) || null}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, professionalId: newValue ? newValue.id : '' }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Profesional (opcional)"
                  placeholder="Buscar profesional..."
                  fullWidth
                />
              )}
            />

            <MultiImageUploadField
              label="Fotografías del trabajo"
              value={images}
              onChange={setImages}
              disabled={submitting || loading}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
              }
              label="Publicado en la web"
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting || loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || loading}
        >
          {submitting || loading ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkFormDialog;
