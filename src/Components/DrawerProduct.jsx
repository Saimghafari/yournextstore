import React, { useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Divider,
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



function DrawerProduct({ openDrawer, toggleDrawerOpen }) {
    // const [open, setOpen] = useState(false);

    const cart = useSelector((state) => state.cart.cartItems)
    const total = (useSelector((state) => state.cart.totalPrice) || 0).toFixed(2);

    // const toggleDrawer = (newOpen) => () => {
    //     setOpen(newOpen);
    // };

    const productsDrawer = (
        <Box sx={{ width: { xs: 250, sm: 400, md: 400, lg: 400 }, mt: 3, ml: 3, mr: 3, }} role="presentation" onClick={toggleDrawerOpen(false)}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 'bold',
                        fontSize: {
                            xs: '1rem',
                            sm: '1.5rem',
                        },
                    }}
                >
                    Shopping Cart
                </Typography>
                <Link to='/cart'>
                    <Typography
                        variant='subtitle2'
                        sx={{
                            color: 'gray',
                            fontSize: {
                                xs: '0.7rem',
                                sm: '1rem'
                            }
                        }}
                    >
                        (open full view)
                    </Typography>
                </Link>
            </Box>

            <Box marginBottom={3}>
                {cart.map((item) => (
                    <List key={item.id}>
                        <ListItem disableGutters>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >

                                <Box sx={{ display: 'flex', gap: 2 }}>

                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            border: '1px solid #eee',
                                            backgroundColor: '#fafafa',
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            Quantity: {item.quantity}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body2" fontWeight={500}>
                                    ${item.price.toFixed(2)}
                                </Typography>
                            </Box>
                        </ListItem>
                    </List>
                ))}
            </Box>

            <Divider />
            <Box sx={{ mt: 4, }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6' fontWeight='bold'>
                        Total
                    </Typography>
                    <Typography>${total}</Typography>
                </Box>
                <Box>
                    <Typography variant='body2' color='gray'>
                        Shipping and taxes will be added at the next step
                    </Typography>
                </Box>
                <Box >
                    <Link to='/cart'><Button fullWidth sx={{ backgroundColor: '#0f172a', textTransform: 'none', fontSize: '1.2rem', fontWeight: 'bold', py: 1, borderRadius: 50, color: 'white', mt: 3, mb: 4, }}>
                        Go to payment
                    </Button>
                    </Link>
                </Box>
            </Box>

        </Box>
    );

    return (
        <Box>
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawerOpen(false)}>{productsDrawer}</Drawer>
        </Box>
    )
}

export default DrawerProduct
