import React from 'react';
import { Box, Divider, Typography, MenuItem } from '@mui/material';
import { Dashboard, Spa, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserMenuContent = ({
  user,
  navigate,
  handleLogout,
  isPublicHeader = false,
}) => {
  const handleMenuClose = () => {
    // close logic would be handled by parent
  };

  // Determinar ruta de Panel de gestión (solo público) o Ver sitio web (Dashboard)
  const getAdminRoute = () => {
    if (isPublicHeader) {
      return '/dashboard';
    }
    return '/';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minHeight: 40 }}>
      {user.nombre ? (
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary' }}>
          {user.nombre} {user.apellido || ''}
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary' }}>
          {user.email}
        </Typography>
      )}
      <Divider sx={{ mx: 1, my: 0.5 }} />
      {user?.rol === 'ADMIN' && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(getAdminRoute());
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
            margin: '2px 0',
            minHeight: 40,
          }}>
          <Dashboard sx={{ mr: 0.5, fontSize: '1.25em', color: 'primary.main' }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>
            {isPublicHeader ? 'Panel de gestión' : 'Ver sitio web'}
          </Typography>
        </MenuItem>
      )}
      <MenuItem
        onClick={handleLogout}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '6px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
          margin: '2px 0',
          minHeight: 40,
        }}>
        <Lock sx={{ mr: 0.5, fontSize: '1.25em', color: 'error.main' }} /> Cerrar Sesión
      </MenuItem>
    </Box>
  );
};

export default UserMenuContent;