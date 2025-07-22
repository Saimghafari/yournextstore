import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Login({ setIsLoggedIn }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'info' | 'warning'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const matchUser = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (matchUser?.blocked) {
      setSnackbar({ open: true, message: 'Your account is blocked.', severity: 'error' });
      return;
    }

    if (matchUser) {
      setSnackbar({ open: true, message: `Welcome back ${matchUser.email}`, severity: 'success' });
      localStorage.setItem('isLoggedIn', JSON.stringify(matchUser));
      setIsLoggedIn(true);

      setTimeout(() => navigate('/'), 1500); // slight delay to show snackbar before navigating
    } else {
      setSnackbar({ open: true, message: 'User not found', severity: 'error' });
    }

    setCredentials({ email: '', password: '' });
  };

  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
      marginTop={4}
    >
      <Paper
        elevation={3}
        sx={{
          width: 370,
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your email below to login to your account
        </Typography>

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name='email'
              value={credentials.email}
              onChange={handleChange}
              label="Email"
              placeholder="m@example.com"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Box
                    sx={{ cursor: 'pointer', ml: 1 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Box>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type='submit'
              sx={{ backgroundColor: '#0f172a', textTransform: 'none', fontWeight: 'bold', py: 1.5 }}
            >
              Login
            </Button>

            <Link to='/signup'>Don't have an account?</Link>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
