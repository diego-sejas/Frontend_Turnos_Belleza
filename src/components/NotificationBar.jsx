import React from 'react';
import { Box, Alert, AlertTitle, IconButton, Snackbar, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Warning, Info, Close } from '@mui/icons-material';

const iconMap = {
  success: CheckCircle,
  error: ErrorIcon,
  warning: Warning,
  info: Info,
};

const severityMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const NotificationBar = ({
  open,
  onClose,
  severity = 'info',
  message,
  title,
  autoHideDuration = 4000,
  variant = 'standard',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!open || !message) return null;

  const severityColor = severityMap[severity] || 'info';
  const IconComponent = iconMap[severity] || iconMap.info;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      ContentProps={{
        'aria-describedby': 'notification-bar-message',
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severityColor}
        variant={variant}
        sx={{
          width: isMobile ? 'calc(100% - 24px)' : 380,
          maxWidth: isMobile ? 'calc(100% - 24px)' : 380,
          minWidth: isMobile ? 'calc(100% - 24px)' : 340,
          borderRadius: 12,
          boxShadow: '0 12px 32px -8px rgb(0 0 0 / 0.15), 0 4px 16px -4px rgb(0 0 0 / 0.1)',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            padding: '4px 0',
          },
          '& .MuiAlert-icon': {
            marginRight: 0,
            marginTop: 2,
          },
        }}
        role="alert"
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexGrow: 1 }}>
          <IconComponent sx={{ fontSize: 20, flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {title && (
              <AlertTitle sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.875rem' }}>{title}</AlertTitle>
            )}
            <Typography id="notification-bar-message" variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
              {message}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            color="inherit"
            aria-label="Cerrar notificación"
            sx={{ marginLeft: 1, padding: 0.5, flexShrink: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationBar;