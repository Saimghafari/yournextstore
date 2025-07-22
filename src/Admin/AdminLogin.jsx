import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Stack } from '@mui/material';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminEmail = 'ahtixham786@gmail.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('isAdminLoggedIn', true);
      navigate('/admin');
    } else {
      alert('Invalid admin credentials');
    }
  };

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
        <Typography variant="h5" fontWeight="bold" gutterBottom>Admin Login</Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              label="Admin Email"
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth
              sx={{ backgroundColor: '#0f172a', textTransform: 'none', fontWeight: 'bold', py: 1.5 }}>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default AdminLogin;