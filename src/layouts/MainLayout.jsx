import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItemIcon, ListItemText, Divider, Tooltip, ListItemButton } from '@mui/material';
import { Person, ExitToApp, Dashboard, MiscellaneousServices, CalendarMonth, People, Payments, Settings, Badge, Spa, Collections } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NotificationBar from '../components/NotificationBar';
import ThemeToggle from '../components/ThemeToggle';
import UserMenuContent from '../components/UserMenuContent';

const MainLayout = () => {
  const { user, logout, notification, hideNotification } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const drawer = (
    <Box sx={{ px: 2, py: 2.5 }}>
      <Box
        onClick={handleHomeClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          mb: 1,
        }}
      >
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Sistema Belleza
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', color: 'text.secondary' }}>
        Panel de gestión
      </Typography>
    </Box>
  );

  const isAdmin = user?.rol === 'ADMIN';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/admin/services', label: 'Servicios', icon: <MiscellaneousServices />, adminOnly: true },
    { path: '/admin/professionals', label: 'Profesionales', icon: <Badge />, adminOnly: true },
    { path: '/admin/works', label: 'Trabajos', icon: <Collections />, adminOnly: true },
    { path: '/admin/reservations', label: 'Reservas', icon: <CalendarMonth /> },
    { path: '/admin/clients', label: 'Clientes', icon: <People /> },
    { path: '/admin/payments', label: 'Pagos', icon: <Payments /> },
    { path: '/admin/settings', label: 'Configuración', icon: <Settings /> },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <Dashboard sx={{ color: 'text.primary' }} />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' }, justifyContent: 'center', alignItems: 'center' }}>
              <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
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
              </NavLink>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ml: 1 }}>
                Sistema Belleza
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle sx={{ color: 'text.secondary' }} />
              <Tooltip title="Cuenta de usuario">
                <IconButton onClick={handleMenuOpen} aria-label="account" size="small" sx={{ color: 'text.secondary' }}>
                  <Person />
                </IconButton>
              </Tooltip>
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
                  isPublicHeader={false}
                />
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <NotificationBar
          open={notification?.open}
          onClose={hideNotification}
          severity={notification?.severity}
          message={notification?.message}
          title={notification?.title}
          autoHideDuration={notification?.autoHideDuration}
        />
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
          <Divider sx={{ mx: 1 }} />
          <List component="nav" aria-label="main navigation" sx={{ px: 1, py: 1 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {({ isActive }) => (
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      px: 1.5,
                      py: 1.2,
                      minHeight: 48,
                      width: '100%',
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 600 : 400,
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                )}
              </NavLink>
            ))}
          </List>
          <Divider sx={{ mx: 1 }} />
          <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Sistema Belleza v1.0
            </Typography>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 7, sm: 8 },
            pb: 4,
            minHeight: '100vh',
            backgroundColor: 'background.default',
            width: '100%',
            minWidth: 0,
          }}
        >
          <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', flex: 1 }}>
            <Outlet />
          </Box>
        </Box>
    </Box>
  );
};

export default MainLayout;
