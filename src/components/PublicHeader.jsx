import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Spa, Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import UserMenuContent from './UserMenuContent';

const PublicHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Estilistas', href: '/estilistas' },
    { label: 'Trabajos', href: '/trabajos' },
    { label: 'Reservar', href: '/reservar' },
  ];

  return (
    <AppBar position="fixed" elevation={0} sx={{
      bgcolor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              background: (t) => t.palette.custom.gradientGold,
              boxShadow: '0 4px 12px -2px rgba(154, 113, 57, 0.3)',
            }}
          >
            <Spa sx={{ fontSize: 20, color: '#ffffff' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
            Sistema Belleza
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.href}
              component="a"
              href={item.href}
              variant="text"
              size="small"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={handleMenuOpen}
              sx={{ mr: 1 }}
            >
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          )}

          <ThemeToggle sx={{ color: 'text.secondary' }} />

          <IconButton
            color="inherit"
            aria-label="open user menu"
            onClick={handleMenuOpen}
            sx={{ mr: 1 }}
          >
            <Person sx={{ color: 'text.primary' }} />
          </IconButton>

{user ? (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
PaperProps={{ sx: { minWidth: 240, maxWidth: 280, width: 250, borderRadius: '12px', boxSizing: 'border-box', backgroundColor: 'background.paper', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' } }}
                >
                  <UserMenuContent
                    user={user}
                    navigate={navigate}
                    handleLogout={handleLogout}
                    isPublicHeader={true}
                  />
                </Menu>
              ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleLoginClick}
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;