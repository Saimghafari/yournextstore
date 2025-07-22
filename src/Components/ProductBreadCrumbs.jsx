import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

const ProductBreadcrumbs = ({ product }) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (path) => (event) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 3 }}
    >
      <Link
        sx={{ textDecoration: 'none' }}
        color="inherit"
        href="/"
        onClick={handleBreadcrumbClick('/')}
      >
        Home
      </Link>
      <Link
        sx={{ textDecoration: 'none' }}
        color="inherit"
        href={`/products/${product.category}`}
        onClick={handleBreadcrumbClick(`/products/${product.category}`)}
      >
        {product.category}
      </Link>
      <Typography
        color="text.primary"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          maxWidth: { xs: '100px', sm: '200px' },
        }}
      >
        {product.title}
      </Typography>
    </Breadcrumbs>
  );
};

export default ProductBreadcrumbs;
