import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { imageUrl } from '../services/images';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 8;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Se aceptan JPEG, PNG o WebP.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `La imagen supera el límite de ${MAX_IMAGE_BYTES / (1024 * 1024)} MB.`;
  }
  return null;
};

const itemKey = (item, index) => item.id || (item.file ? `${item.file.name}-${index}` : `img-${index}`);

const itemPreview = (item, index) => {
  if (item.file && item.__objectUrl) return item.__objectUrl;
  if (item.url) return imageUrl(item.url);
  return null;
};

const MultiImageUploadField = ({
  label = 'Fotografías',
  value = [],
  onChange,
  disabled = false,
  maxImages = MAX_IMAGES,
  helperText,
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState('');

  const handlePick = () => {
    setLocalError('');
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    if (selected.length === 0) return;

    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      setLocalError(`Como máximo podés cargar ${maxImages} imágenes.`);
      return;
    }

    const accepted = [];
    for (const file of selected.slice(0, remaining)) {
      const validation = validateFile(file);
      if (validation) {
        setLocalError(validation);
        continue;
      }
      accepted.push({ file, __objectUrl: URL.createObjectURL(file) });
    }

    if (selected.length > remaining) {
      setLocalError(`Solo se agregaron ${remaining} imágenes (límite ${maxImages}).`);
    }

    if (accepted.length > 0) {
      onChange([...value, ...accepted]);
    }
  };

  const handleRemove = (index) => {
    setLocalError('');
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      {localError && (
        <Alert severity="warning" sx={{ mb: 1.5 }} onClose={() => setLocalError('')}>
          {localError}
        </Alert>
      )}

      {value.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          {value.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={itemKey(item, index)}>
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                }}
              >
                {itemPreview(item, index) ? (
                  <Box
                    component="img"
                    src={itemPreview(item, index)}
                    alt={`Imagen ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="caption" color="text.secondary">Sin vista previa</Typography>
                  </Box>
                )}
                {!disabled && (
                  <Tooltip title="Retirar">
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        size="small"
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handlePick}
        disabled={disabled || value.length >= maxImages}
      >
        {value.length > 0 ? 'Agregar más' : 'Seleccionar imágenes'}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleInputChange}
        disabled={disabled}
      />

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
        {helperText || `JPEG, PNG o WebP. Máximo 5 MB por imagen y ${maxImages} imágenes.`}
      </Typography>
    </Box>
  );
};

export default MultiImageUploadField;
