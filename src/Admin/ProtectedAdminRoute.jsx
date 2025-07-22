import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

  return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;
