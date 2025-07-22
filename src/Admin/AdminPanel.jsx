import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function AdminPanel() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: SpaceDashboardIcon, path: '/admin/dashboard' },
    { text: 'Orders', icon: EqualizerIcon, path: '/admin/orders' },
    { text: 'Products', icon: ProductionQuantityLimitsIcon, path: '/admin/adminProducts' },
    { text: 'Users', icon: PeopleAltIcon, path: '/admin/users' },
    // { text: 'Setting', icon: SettingsIcon, path: '/admin/setting' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
          <Box sx={{ flexGrow: 1 }} />


          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{
              px: { xs: 1, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: '0.6rem', sm: '0.9rem', md: '1rem' },
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 2,
              textTransform: 'none',
              width: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#c62828',
              },
            }}
          >
            Logout
          </Button>

        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ text, icon: Icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={location.pathname === path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        {/* Show dashboard cards on /admin only, else render nested route content */}

        {location.pathname === '/admin' ? (
          <Grid container spacing={5}>
            {menuItems.map(({ text, icon: Icon, path }) => {
              let bgColor = '#000';
              if (text === 'Dashboard') bgColor = '#1976d2';
              else if (text === 'Orders') bgColor = '#9c27b0';
              else if (text === 'Products') bgColor = '#ff9800';
              else if (text === 'Users') bgColor = '#4caf50';
              else if (text === 'Setting') bgColor = '#f44336';

              return (
                <Grid item xs={12} sm={6} md={3} key={text}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        transform: 'translateY(-6px)',
                        backdropFilter: 'blur(3px)',
                      },
                    }}
                    onClick={() => navigate(path)}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '12px',
                        backgroundColor: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mx: 'auto',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: '#fff' }} />
                    </Box>

                    <Typography variant="h6" fontWeight="600" textAlign="center" mb={1}>
                      {text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      View and manage your {text.toLowerCase()}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
}
