import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { professionalsApi } from '../services/professionals';
import { servicesApi } from '../services/services';
import { imagesApi } from '../services/images';
import { schedulesApi } from '../services/schedules';
import ImageUploadField from './ImageUploadField';

const getServiceId = (service) => String(service?.id || service?._id || service);

const DAYS_OF_WEEK = [
  { key: '0', label: 'Domingo' },
  { key: '1', label: 'Lunes' },
  { key: '2', label: 'Martes' },
  { key: '3', label: 'Miércoles' },
  { key: '4', label: 'Jueves' },
  { key: '5', label: 'Viernes' },
  { key: '6', label: 'Sábado' },
];

const ProfessionalFormDialog = ({ open, onClose, onSuccess, professional, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    phone: '',
    especialidades: '',
    services: [],
    isActive: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.list({ activeOnly: true, limit: 100 });
        setAvailableServices(response.data.data.services);
      } catch (err) {
        console.error('Error loading services:', err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (professional) {
      setFormData({
        nombre: professional.nombre,
        apellido: professional.apellido,
        email: professional.email || '',
        phone: professional.phone || '',
        especialidades: professional.especialidades || '',
        services: (professional.services || []).map(getServiceId),
        isActive: professional.isActive,
      });
      loadSchedules(professional.id);
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        phone: '',
        especialidades: '',
        services: [],
        isActive: true,
      });
      setSchedules({});
    }
    setError('');
    setImageFile(null);
    setImageRemoved(false);
  }, [professional, open]);

  const loadSchedules = async (professionalId) => {
    setSchedulesLoading(true);
    try {
      const response = await schedulesApi.getByProfessional(professionalId);
      const schedulesByDay = {};
      DAYS_OF_WEEK.forEach((d) => {
        schedulesByDay[d.key] = { active: false, intervals: [] };
      });
      (response.data.data.schedules || []).forEach((s) => {
        const dayKey = String(s.dayOfWeek);
        if (!schedulesByDay[dayKey]) {
          schedulesByDay[dayKey] = { active: s.isActive, intervals: [] };
        }
        schedulesByDay[dayKey].intervals.push({
          id: s.id,
          startTime: s.startTime,
          endTime: s.endTime,
        });
        schedulesByDay[dayKey].active = s.isActive;
      });
      setSchedules(schedulesByDay);
    } catch (err) {
      console.error('Error loading schedules:', err);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServicesChange = (event, newServices) => {
    setFormData((prev) => ({ ...prev, services: newServices.map((s) => s.id) }));
  };

  const handleImageChange = (file, meta = {}) => {
    if (file) {
      setImageFile(file);
      setImageRemoved(false);
    } else {
      setImageFile(null);
      setImageRemoved(Boolean(meta.removed));
    }
  };

  const toggleDayActive = (dayKey) => {
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        active: !prev[dayKey]?.active,
      },
    }));
  };

  const addInterval = (dayKey) => {
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        intervals: [...(prev[dayKey]?.intervals || []), { startTime: '', endTime: '' }],
      },
    }));
  };

  const updateInterval = (dayKey, index, field, value) => {
    setSchedules((prev) => {
      const day = prev[dayKey];
      if (!day) return prev;
      const newIntervals = [...day.intervals];
      newIntervals[index] = { ...newIntervals[index], [field]: value };
      return {
        ...prev,
        [dayKey]: { ...day, intervals: newIntervals },
      };
    });
  };

  const removeInterval = (dayKey, index) => {
    setSchedules((prev) => {
      const day = prev[dayKey];
      if (!day) return prev;
      const newIntervals = day.intervals.filter((_, i) => i !== index);
      return {
        ...prev,
        [dayKey]: { ...day, intervals: newIntervals },
      };
    });
  };

  const copyDayTo = (sourceDayKey, targetDayKey) => {
    if (sourceDayKey === targetDayKey) return;
    setSchedules((prev) => {
      const source = prev[sourceDayKey];
      if (!source) return prev;
      return {
        ...prev,
        [targetDayKey]: {
          active: source.active,
          intervals: source.intervals.map((i) => ({ ...i })),
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let imageId;
      if (imageFile) {
        const uploadResponse = await imagesApi.upload(imageFile);
        imageId = uploadResponse.data.data.id;
      } else if (imageRemoved) {
        imageId = null;
      }

      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        phone: formData.phone.trim(),
        especialidades: formData.especialidades.trim(),
        services: formData.services,
        isActive: formData.isActive,
      };

      const email = formData.email.trim();
      if (email || professional) {
        payload.email = email;
      }

      if (imageId !== undefined) {
        payload.imageId = imageId;
      }

      let savedProfessional;
      if (professional) {
        const response = await professionalsApi.update(professional.id, payload);
        savedProfessional = response.data.data;
      } else {
        const response = await professionalsApi.create(payload);
        savedProfessional = response.data.data;
      }

      // Guardar horarios laborales solo si se está editando un profesional existente
      if (professional) {
        await saveSchedules(savedProfessional.id);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el profesional');
    } finally {
      setSubmitting(false);
    }
  };

  const saveSchedules = async (professionalId) => {
    // Obtener horarios existentes para hacer diff
    let existingSchedules = [];
    try {
      const response = await schedulesApi.getByProfessional(professionalId);
      existingSchedules = response.data.data.schedules || [];
    } catch (err) {
      console.error('Error fetching existing schedules for diff:', err);
    }

    const existingById = {};
    existingSchedules.forEach((s) => {
      existingById[s.id] = s;
    });

    const seenIds = new Set();
    const operations = [];

    // Procesar cada día
    for (const day of DAYS_OF_WEEK) {
      const dayKey = day.key;
      const dayData = schedules[dayKey];
      if (!dayData) continue;

      if (!dayData.active) {
        // Día desactivado: eliminar todos los intervalos existentes de este día
        existingSchedules
          .filter((s) => String(s.dayOfWeek) === dayKey)
          .forEach((s) => operations.push({ type: 'delete', id: s.id }));
        continue;
      }

      for (const interval of dayData.intervals) {
        if (!interval.startTime || !interval.endTime) continue;

        if (interval.id) {
          // Intervalo existente: actualizar si cambió
          seenIds.add(interval.id);
          const existing = existingById[interval.id];
          if (
            existing &&
            (existing.startTime !== interval.startTime ||
              existing.endTime !== interval.endTime ||
              existing.isActive !== dayData.active)
          ) {
            operations.push({
              type: 'update',
              id: interval.id,
              data: {
                dayOfWeek: parseInt(dayKey, 10),
                startTime: interval.startTime,
                endTime: interval.endTime,
                isActive: true,
              },
            });
          }
        } else {
          // Nuevo intervalo: crear
          operations.push({
            type: 'create',
            data: {
              businessId: professional ? (professional.businessId || '') : '',
              professionalId: professionalId,
              dayOfWeek: parseInt(dayKey, 10),
              startTime: interval.startTime,
              endTime: interval.endTime,
              isActive: true,
            },
          });
        }
      }
    }

    // Eliminar intervalos existentes que ya no están en la UI
    existingSchedules.forEach((s) => {
      if (!seenIds.has(s.id)) {
        operations.push({ type: 'delete', id: s.id });
      }
    });

    // Ejecutar operaciones en secuencia
    for (const op of operations) {
      if (op.type === 'create') {
        await schedulesApi.create(op.data);
      } else if (op.type === 'update') {
        await schedulesApi.update(op.id, op.data);
      } else if (op.type === 'delete') {
        await schedulesApi.delete(op.id);
      }
    }
  };

  const getDayLabel = (dayKey) => {
    const day = DAYS_OF_WEEK.find((d) => d.key === dayKey);
    return day ? day.label : dayKey;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>{professional ? 'Editar Profesional' : 'Nuevo Profesional'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '85vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                autoFocus
              />

              <TextField
                fullWidth
                label="Apellido *"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Box>

            <TextField
              fullWidth
              label="Especialidades"
              name="especialidades"
              value={formData.especialidades}
              onChange={handleChange}
              placeholder="Ej: Color, cortes, tratamientos"
              helperText="Texto libre. Dejá vacío si no corresponde."
            />

            <ImageUploadField
              label="Fotografía del profesional"
              currentUrl={professional?.imageUrl || null}
              file={imageFile}
              onFileChange={handleImageChange}
              disabled={submitting || loading}
              aspect="1 / 1"
            />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Servicios que ofrece
              </Typography>
              <Autocomplete
                multiple
                id="services-autocomplete"
                options={availableServices}
                getOptionLabel={(service) => service.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={formData.services
                  .map((id) => availableServices.find((s) => s.id === id))
                  .filter(Boolean)}
                onChange={handleServicesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar servicios"
                    placeholder="Buscar servicios..."
                    fullWidth
                    variant="outlined"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key: _key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option.name}
                        {...tagProps}
                      />
                    );
                  })
                }
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              }
              label="Activo"
            />

            {/* Horarios Laborales Section */}
            <Box sx={{ mt: 4, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Horarios Laborales
              </Typography>
              {schedulesLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const dayData = schedules[day.key] || { active: false, intervals: [] };
                    return (
                      <Accordion
                        key={day.key}
                        expanded={dayData.active || dayData.intervals.length > 0}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ px: 2 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Checkbox
                              checked={dayData.active}
                              onChange={() => toggleDayActive(day.key)}
                              inputProps={{ 'aria-label': `Día activo: ${day.label}` }}
                            />
                            <Typography fontWeight={600} sx={{ flexGrow: 1 }}>
                              {day.label}
                            </Typography>
                            {dayData.active ? (
                              <Typography color="success" fontSize="0.85rem">
                                Activo
                              </Typography>
                            ) : (
                              <Typography color="text.secondary" fontSize="0.85rem">
                                No trabaja
                              </Typography>
                            )}
                            {dayData.active && (
                              <Tooltip title="Copiar a otro día">
                                <IconButton size="small" onClick={() => copyDayTo(day.key, '')}>
                                  <CopyIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 1, pb: 1 }}>
                          {dayData.active ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {dayData.intervals.length === 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  Sin intervalos configurados. Agregá uno abajo.
                                </Typography>
                              )}
                              {dayData.intervals.map((interval, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    backgroundColor: 'background.paper',
                                  }}
                                >
                                  <TextField
                                    size="small"
                                    label="Desde"
                                    type="time"
                                    value={interval.startTime}
                                    onChange={(e) => updateInterval(day.key, index, 'startTime', e.target.value)}
                                    sx={{ flexGrow: 1, minWidth: 100 }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                                    a
                                  </Typography>
                                  <TextField
                                    size="small"
                                    label="Hasta"
                                    type="time"
                                    value={interval.endTime}
                                    onChange={(e) => updateInterval(day.key, index, 'endTime', e.target.value)}
                                    sx={{ flexGrow: 1, minWidth: 100 }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => removeInterval(day.key, index)}
                                    sx={{ color: 'error' }}
                                    title="Eliminar intervalo"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              ))}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => addInterval(day.key)}
                                  startIcon={<AddIcon />}
                                >
                                  Agregar intervalo
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Día no laborable. Activá para configurar horarios.
                            </Typography>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </Box>
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

export default ProfessionalFormDialog;
