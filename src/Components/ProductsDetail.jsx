import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Grid,
    Typography,
    Button,
    Rating,
    Stack,
    Divider,
    TextField,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    CardActionArea
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../Redux/ProductSlice'
import { addToCart } from '../Redux/CartSlice';
import { useNavigate } from 'react-router-dom'
import DrawerProduct from './DrawerProduct'
import ProductBreadcrumbs from './ProductBreadCrumbs'


function ProductsDetail() {
    const { id } = useParams(); // used for to get id from URL 

    const { products, loading, error } = useSelector((state) => state.products);

    const dispatch = useDispatch();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);


    const navigate = useNavigate();

    const handleCardClick = useCallback((id) => {
        navigate(`/product/${id}`);
    }, [navigate]);

    const toggleDrawerOpen = useCallback((newOpen) => () => {
        setOpenDrawer(newOpen);
    }, []);


    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);


    const product = products.find((item) => item.id === parseInt(id))

    useEffect(() => {
        if (product?.category) {
            const filtered = products.filter((p) => p.category === product.category);
            setRelatedProducts(filtered)
        }
    }, [product, products, id])




    if (loading) return <CircularProgress />;
    if (error) return <Typography>Error: {error}</Typography>;
    if (!product) return <Typography>Product not found.</Typography>;

    return (
        <Box>
            <Box sx={{ pt: '2rem', px: { xs: '1rem', sm: '2rem' } }}>
                <ProductBreadcrumbs product={product} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, alignItems: 'center', height: '100vh', bgcolor: '#f5f5f5', width: { sm: '100%', md: '100%', lg: '60%' } }}>
                    <Box
                        component="img"
                        src={product.image}
                        sx={{
                            width: { xs: 300, sm: 500, md: 400, lg: 400 },
                            height: { xs: 300, sm: 500, md: 400, lg: 400 },
                            objectFit: 'contain',
                            my: 2,

                            // backgroundColor: 'transparent'
                        }}
                    />
                </Box>

                <Box sx={{ width: { xs: '100%', sm: '100%', md: '100%', lg: '40%' }, mt: { xs: 3, sm: 3, md: 0, lg: 0 } }}>
                    <Box>
                        <Typography variant='h4' sx={{
                            fontWeight: 'bold',
                            ml: { md: 2, lg: 2 },

                        }}>
                            {product.title}
                        </Typography>
                        <Typography variant='h6' sx={{
                            ml: { md: 2, lg: 2 },
                            color: 'gray',

                        }}>
                            ${(product.price).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3, ml: { md: 2, lg: 2 }, textAlign: 'justify' }}>
                        <Typography>
                            {product.description}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3, ml: { md: 2, lg: 2 } }}>
                        <Rating value={product.rating.rate} precision={0.1} readOnly />
                    </Box>
                    <Box>
                        <Button fullWidth sx={{ backgroundColor: '#0f172a', textTransform: 'none', fontSize: '1.2rem', fontWeight: 'bold', py: 1, borderRadius: 50, color: 'white', mt: 3, ml: { md: 2, lg: 2 } }}
                            onClick={() => {
                                dispatch(addToCart(product));
                                toggleDrawerOpen(true)();
                            }} >
                            Add to cart

                        </Button>
                        <DrawerProduct openDrawer={openDrawer} toggleDrawerOpen={toggleDrawerOpen} />

                    </Box>
                </Box>

            </Box>
            <Box sx={{ mt: 5, }}>
                <Typography variant='h4' sx={{ fontWeight: 'bold' }} >
                    May You Also Like
                </Typography>
            </Box>

            <Box>
                <Grid container spacing={2} mt={5}>
                    {relatedProducts.slice(0, 4).map((item) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                            <Card sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out',
                                },
                            }}>
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image}
                                        alt={item.name}
                                        onClick={() => handleCardClick(item.id)}
                                        sx={{
                                            objectFit: 'contain',
                                            width: '100%',
                                            backgroundColor: '#f5f5f5',
                                            padding: 2,
                                        }}
                                    />
                                    <CardContent >
                                        <Typography gutterBottom variant="h6" component="div" noWrap>
                                            {item.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                ${item.price}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Box>
        </Box >
    )
}

export default ProductsDetail
