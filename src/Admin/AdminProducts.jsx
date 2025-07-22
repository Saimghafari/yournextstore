import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Collapse,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddProductModel from './AddProductModel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localProducts, setLocalProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setLocalProducts(storedProducts);
  }, []);

  const refreshProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setLocalProducts(storedProducts);
  };

  const deleteProducts = () => {
    const updated = localProducts.filter((product) => product.id !== selectedId);
    setLocalProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    handleMenuClose();
  };

  const updateProduct = (id) => {
    const editToProduct = localProducts.find((product) => product.id === id);
    setEditingProduct(editToProduct);
    setShowForm(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => {
          if (showForm) {
            setEditingProduct(null); // Clear edit mode on close
          }
          setShowForm(!showForm);
        }}
        sx={{ mb: 2 }}
      >
        {showForm ? 'Close Form' : editingProduct ? 'Edit Product' : 'Add Product'}
      </Button>

      <Collapse in={showForm}>
        <AddProductModel
          productToEdit={editingProduct}
          onProductAdd={() => {
            refreshProducts();
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      </Collapse>

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          New Products 
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {localProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.title}
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, product.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
              mt: 1.5,
              minWidth: 220,
              p: 1,
              bgcolor: '#fff',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              '& .MuiMenuItem-root': {
                borderRadius: 2,
                mb: 0.8,
                px: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: 15,
                color: '#444',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#1976d2',
                  color: '#fff',
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                },
              },
              '& .MuiMenuItem-root:last-of-type': {
                mb: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              updateProduct(selectedId);
            }}
          >
            <EditIcon fontSize="small" />
            Update
          </MenuItem>

          <MenuItem onClick={deleteProducts} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>


      {/* External API Products */}
      <Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Product List 
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Image</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.title}
                        height={40}
                        style={{ objectFit: 'contain' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminProducts;