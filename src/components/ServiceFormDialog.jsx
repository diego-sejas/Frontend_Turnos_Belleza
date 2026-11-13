import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { servicesApi } from '../services/services';
import { imagesApi } from '../services/images';
import ImageUploadField from './ImageUploadField';

const ServiceFormDialog = ({ open, onClose, onSuccess, service, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: '',
    price: '',
    currency: 'ARS',
    requiresDeposit: false,
    depositAmount: '',
    depositType: 'fixed',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        durationMinutes: service.durationMinutes,
        price: service.price,
        currency: service.currency,
        requiresDeposit: service.requiresDeposit,
        depositAmount: service.depositAmount || '',
        depositType: service.depositType || 'fixed',
        isActive: service.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        durationMinutes: '',
        price: '',
        currency: 'ARS',
        requiresDeposit: false,
        depositAmount: '',
        depositType: 'fixed',
        isActive: true,
      });
    }
    setError('');
    setImageFile(null);
    setImageRemoved(false);
  }, [service, open]);

  const handleImageChange = (file, meta = {}) => {
    if (file) {
      setImageFile(file);
      setImageRemoved(false);
    } else {
      setImageFile(null);
      setImageRemoved(Boolean(meta.removed));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        durationMinutes: parseInt(formData.durationMinutes, 10),
        price: parseInt(formData.price, 10),
        currency: formData.currency,
        requiresDeposit: formData.requiresDeposit,
        depositAmount: formData.requiresDeposit ? parseInt(formData.depositAmount, 10) : undefined,
        depositType: formData.requiresDeposit ? formData.depositType : 'fixed',
        isActive: formData.isActive,
      };

      if (imageId !== undefined) {
        payload.imageId = imageId;
      }

      if (service) {
        await servicesApi.update(service.id, payload);
      } else {
        await servicesApi.create(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const depositFields = formData.requiresDeposit ? (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Configuración de adelanto/depósito
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="deposit-type-label">Tipo de depósito</InputLabel>
        <Select
          labelId="deposit-type-label"
          name="depositType"
          value={formData.depositType}
          onChange={handleChange}
          label="Tipo de depósito"
        >
          <MenuItem value="fixed">Monto fijo</MenuItem>
          <MenuItem value="percentage">Porcentaje del precio</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label={formData.depositType === 'percentage' ? 'Porcentaje (%)' : 'Monto (en centavos)'}
        name="depositAmount"
        type="number"
        value={formData.depositAmount}
        onChange={handleChange}
        required
        min={formData.depositType === 'percentage' ? 1 : 1}
        max={formData.depositType === 'percentage' ? 100 : undefined}
        helperText={formData.depositType === 'percentage' ? 'Valor entre 1 y 100' : 'Monto en centavos (ej: 5000 = $50,00)'}
      />
    </Box>
  ) : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{service ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />

            <ImageUploadField
              label="Imagen del servicio"
              currentUrl={service?.imageUrl || null}
              file={imageFile}
              onFileChange={handleImageChange}
              disabled={submitting || loading}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Duración (minutos) *"
                name="durationMinutes"
                type="number"
                value={formData.durationMinutes}
                onChange={handleChange}
                required
                min={1}
                inputProps={{ min: 1 }}
              />

              <TextField
                fullWidth
                label="Precio (en centavos) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
                inputProps={{ min: 0 }}
                helperText="Ej: 5000 = $50,00"
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel id="currency-label">Moneda</InputLabel>
              <Select
                labelId="currency-label"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Moneda"
              >
                <MenuItem value="ARS">ARS (Peso Argentino)</MenuItem>
                <MenuItem value="USD">USD (Dólar Americano)</MenuItem>
              </Select>
            </FormControl>

            {depositFields}

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

export default ServiceFormDialog;