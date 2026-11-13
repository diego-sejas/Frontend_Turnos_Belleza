import { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { imageUrl } from '../services/images';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
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

const ImageUploadField = ({
  label = 'Imagen',
  currentUrl = null,
  file = null,
  onFileChange,
  disabled = false,
  helperText = 'JPEG, PNG o WebP. Máximo 5 MB.',
  aspect = '16 / 10',
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewSrc = objectUrl || (currentUrl ? imageUrl(currentUrl) : null);

  const handlePick = () => {
    setLocalError('');
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    e.target.value = '';
    if (!selected) return;

    const validation = validateFile(selected);
    if (validation) {
      setLocalError(validation);
      return;
    }

    setLocalError('');
    onFileChange(selected);
  };

  const handleRemove = () => {
    setLocalError('');
    onFileChange(null, { removed: true });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      {localError && (
        <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setLocalError('')}>
          {localError}
        </Alert>
      )}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 360,
          aspectRatio: aspect,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {previewSrc ? (
          <Box
            component="img"
            src={previewSrc}
            alt="Vista previa"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <Stack alignItems="center" spacing={1} sx={{ p: 2, textAlign: 'center' }}>
            <UploadIcon color="disabled" />
            <Typography variant="body2" color="text.secondary">
              Sin imagen
            </Typography>
          </Stack>
        )}

        {disabled && (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.35)' }} />
        )}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="outlined"
          startIcon={previewSrc ? <SwapIcon /> : <UploadIcon />}
          onClick={handlePick}
          disabled={disabled}
        >
          {previewSrc ? 'Reemplazar' : 'Seleccionar imagen'}
        </Button>
        {previewSrc && (
          <Button
            size="small"
            color="error"
            variant="text"
            startIcon={<DeleteIcon />}
            onClick={handleRemove}
            disabled={disabled}
          >
            Retirar
          </Button>
        )}
      </Stack>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleInputChange}
        disabled={disabled}
      />

      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadField;
