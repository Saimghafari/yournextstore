import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

const categories = ['electronics', 'jewelry', "men's clothing", "women's clothing"];

function AddProductModel({ onProductAdd, productToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: '',
  });

  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData({
        title: '',
        price: '',
        description: '',
        image: '',
        category: '',
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];
    const saveProducts = (products) => localStorage.setItem('products', JSON.stringify(products));

    let existingProducts = getProducts();

    if (productToEdit) {
      // Update existing product
      existingProducts = existingProducts.map((p) =>
        p.id === productToEdit.id ? { ...formData, id: productToEdit.id } : p
      );
    } else {
      // Add new product
      const numericIds = existingProducts.map((p) => Number(p.id)).filter((n) => !isNaN(n));
      const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

      const newProduct = {
        ...formData,
        id: newId,
      };

      existingProducts = [...existingProducts, newProduct];
    }

    saveProducts(existingProducts);

    setSnackOpen(true);

    // Reset form only if adding new product
    if (!productToEdit) {
      setFormData({
        title: '',
        price: '',
        description: '',
        image: '',
        category: '',
      });
    }

    if (typeof onProductAdd === 'function') {
      onProductAdd();
    }
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}
      >
        <Typography variant="h5" gutterBottom>
          {productToEdit ? 'Update Product' : 'Add New Product'}
        </Typography>

        <TextField
          fullWidth
          label="Product Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
          inputProps={{ min: 0, step: 'any' }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" fullWidth>
          {productToEdit ? 'Update Product' : 'Submit Product'}
        </Button>

        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
          <Alert severity="success" onClose={() => setSnackOpen(false)}>
            {productToEdit ? 'Product updated successfully!' : 'Product added successfully!'}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default AddProductModel;