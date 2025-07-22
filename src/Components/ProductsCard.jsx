import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Drawer
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { addToCart } from '../Redux/CartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DrawerProduct from './DrawerProduct';

// memoized component
const ProductsCard = React.memo(({ product }) => {
    const dispatch = useDispatch();
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    const toggleDrawerOpen = useCallback((newOpen) => () => {
        setOpenDrawer(newOpen);
    }, []);

    if (!product) {
        return <Typography variant="h6">Product data is not available</Typography>;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Card
                sx={{
                    width: '100%',
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease-in-out',
                    },
                }}
            >
                <CardActionArea sx={{ height: '100%' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        onClick={handleCardClick}
                        sx={{
                            objectFit: 'contain',
                            width: '100%',
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                        }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                            {product.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                ${product.price}
                            </Typography>
                            <ShoppingCartOutlinedIcon
                                onClick={() => {
                                    dispatch(addToCart(product));
                                    toggleDrawerOpen(true)();
                                }}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Box>
                        <DrawerProduct openDrawer={openDrawer} toggleDrawerOpen={toggleDrawerOpen} />
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
});

export default ProductsCard;