import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';

import Footer from './Components/Footer';
import Navbar from './Navbar/Navbar';
import ScrollOnTop from './Components/ScrollOnTop';
import HomeIndex from './Components/HomeIndex';
import Cart from './Components/Cart';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ProductsDetail from './Components/ProductsDetail';
import Apparel from './Pages/Apparel';
import Accessories from './Pages/Accessories';
import Digital from './Pages/Digital';

// Admin
import AdminPanel from './Admin/AdminPanel';
import Dashboard from './Admin/Dashboard';
import Orders from './Admin/Orders';
import AdminProducts from './Admin/AdminProducts';
import Users from './Admin/Users';
import Setting from './Admin/Setting';
import AdminLogin from './Admin/AdminLogin';
import ProtectedAdminRoute from './Admin/ProtectedAdminRoute';

function App() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = JSON.parse(localStorage.getItem('isLoggedIn'));
    return !!user;
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('isLoggedIn'));
    setIsLoggedIn(!!user);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Box
      sx={{
        ml: isAdminRoute ? { xs: 0, sm: 0, md: 0 } : { xs: 2, sm: 5, md: 10 },
        mr: isAdminRoute ? { xs: 0, sm: 0, md: 0 } : { xs: 2, sm: 5, md: 10 },
      }}
    >
      
      {!isAdminRoute && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <ScrollOnTop />

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomeIndex />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/product/:id' element={<ProductsDetail />} />
        <Route path='/apparel' element={<Apparel />} />
        <Route path='/accessories' element={<Accessories />} />
        <Route path='/digital' element={<Digital />} />

        {/* Admin Routes with nested routing */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='adminProducts' element={<AdminProducts />} />
          <Route path='orders' element={<Orders />} />
          <Route path='users' element={<Users />} />
          {/* <Route path='setting' element={<Setting />} /> */}
        </Route>
      </Routes>

      
      {!isAdminRoute && <Footer />}
    </Box>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}