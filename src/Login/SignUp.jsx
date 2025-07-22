import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Stack, Paper,
  MenuItem, InputLabel, FormControl, Select, IconButton, InputAdornment, Snackbar, Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // can be 'success' | 'error'
  });

  const validationSchema = Yup.object({
    userName: Yup.string().min(3, "Too short").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    country: Yup.string().required('Country or region is required'),
    password: Yup.string().min(4, "Too short").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSignup = (values, { resetForm }) => {
    const { userName, email, country, password } = values;
    const users = getUsers();
    const userExists = users.find(user => user.email === email);

    if (userExists) {
      setSnackbar({ open: true, message: 'User already exists!', severity: 'error' });
    } else {
      users.push({ userName, email, country, password });
      saveUsers(users);
      setSnackbar({ open: true, message: 'Signup successful! You can now log in.', severity: 'success' });
      resetForm();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f9fafb" marginTop={4}>
      <Paper elevation={3} sx={{ width: 370, padding: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Sign Up</Typography>
        <Formik
          initialValues={{ userName: '', email: '', country: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="User Name"
                  name="userName"
                  fullWidth
                  {...formik.getFieldProps('userName')}
                  error={formik.touched.userName && Boolean(formik.errors.userName)}
                  helperText={formik.touched.userName && formik.errors.userName}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <FormControl fullWidth required sx={{ mt: 3 }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    label="Country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.country && !!formik.errors.country}
                  >
                    <MenuItem value="Pakistan">Pakistan</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="China">China</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                  </Select>
                  {formik.touched.country && formik.errors.country && (
                    <Typography color="error" variant="caption">{formik.errors.country}</Typography>
                  )}
                </FormControl>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  fullWidth
                  {...formik.getFieldProps('password')}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  fullWidth
                  {...formik.getFieldProps('confirmPassword')}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button type="submit" variant="contained"
                  sx={{ backgroundColor: '#0f172a', textTransform: 'none', fontWeight: 'bold', py: 1.5 }}>
                  Sign Up
                </Button>
                <Link to='/login'>Already have an account?</Link>
              </Stack>
            </form>
          )}
        </Formik>

        {/* ✅ Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
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
      </Paper>
    </Box>
  );
};

export default Signup;
