import React, { useState } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Button,
    Typography,
    Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
    const [data, setData] = useState({
        email: '',
        status: 'initial',
    });

    const getSubscribeUser = () => JSON.parse(localStorage.getItem('subscribe')) || [];
    const subscribeUser = (subscribe) => localStorage.setItem("subscribe", JSON.stringify(subscribe));

    const handleSubmit = (event) => {
        event.preventDefault();
        setData((current) => ({ ...current, status: 'loading' }));

        const user = getSubscribeUser();
        user.push(data.email);
        subscribeUser(user);

        setTimeout(() => {
            setData({ email: '', status: 'sent' });
        }, 1500);
    };


    return (
        <Box
            component="footer"
            sx={{
                p: 4,
                // backgroundColor: '#f5f5f5',
                mt: 10,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // responsive layout
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 4, // space between stacked sections on small screens
            }}
        >
            {/* Left Column */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <form onSubmit={handleSubmit} id="newsletter-form">
                    <FormControl>
                        <FormLabel
                            sx={(theme) => ({
                                color: theme.palette.primary.black,
                                fontWeight: 600,
                                textAlign: 'left',
                            })}
                        >
                            Subscribe to our newsletter
                        </FormLabel>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                width: '100%',
                                maxWidth: 600,
                                mx: 'auto',
                                mt: 2,
                            }}
                        >
                            <Input
                                placeholder="mail@yournextstore.com"
                                type="email"
                                required
                                value={data.email}
                                onChange={(event) =>
                                    setData({ email: event.target.value, status: 'initial' })
                                }
                                error={data.status === 'failure'}
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 1,
                                    px: 1.5,
                                    height: '45px',
                                    flexGrow: 1,
                                    minWidth: '250px',
                                    borderColor: 'black',
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={data.status === 'loading'}
                                sx={{
                                    px: 3,
                                    height: '45px',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600,
                                    bgcolor: 'black',
                                    borderRadius: 10,
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        color: 'black',
                                    },
                                }}
                            >
                                {data.status === 'loading' ? 'Loading...' : 'Subscribe'}
                            </Button>
                        </Box>

                        {data.status === 'failure' && (
                            <FormHelperText
                                sx={(theme) => ({ color: theme.palette.error.main, mt: 1 })}
                            >
                                Oops! Something went wrong, please try again later.
                            </FormHelperText>
                        )}
                        {data.status === 'sent' && (
                            <FormHelperText
                                sx={(theme) => ({ color: theme.palette.primary.main, mt: 1 })}
                            >
                                Thank You For Subscribe!
                            </FormHelperText>
                        )}
                    </FormControl>
                </form>
                <Typography variant="subtitle2" mt={10} color="gray">
                    © 2025 Your Next Store <br />
                    Delightful commerce for everyone
                </Typography>
            </Box>

            {/* Right Column */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        alignItems: 'flex-start',
                        mt: { xs: 4, md: 0 },
                    }}
                >
                    <Stack direction="row" spacing={10} mr={3}>
                        <Stack spacing={1} alignItems="flex-start">
                            <Typography variant="h6" fontWeight={600}>Products</Typography>
                            <Link to='/apparel' ><Button size="small" sx={{ color: 'black' }} >Apparel</Button></Link>
                            <Link to='/accessories'><Button size="small" sx={{ color: 'black' }} >Accessories</Button></Link>
                        </Stack>

                        <Stack spacing={1} alignItems="flex-start" >
                            <Typography variant="h6" fontWeight={600}>Support</Typography>
                            <Button size="small" color='black'>Features</Button>
                            <Button size="small" color='black'>Pricing</Button>
                            <Button size="small" color='black'>Contact us</Button>
                        </Stack>
                    </Stack>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        gap: 5,
                        mr: { xs: 0, md: 3 },
                        mt: 4,
                    }}
                >
                    <Button sx={{ color: 'gray', fontSize: 12 }}>@saim</Button>
                    <Button sx={{ color: 'gray', fontSize: 12 }}>@typeofweb</Button>
                </Box>
            </Box>
        </Box>

    );
}

export default Footer;
