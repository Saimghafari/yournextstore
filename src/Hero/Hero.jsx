import React from 'react';
import {
    Typography,
    Box,
    Button,
} from '@mui/material';
import img1 from '../assets/img1.jpg';
import { useSearch } from '../Context/SearchContext';
import { Link } from 'react-router-dom';


function Hero() {
    const { searchData } = useSearch();

    if (searchData) return <Typography variant='h4' >Searching for "{searchData}"</Typography>;

    return (
        <Box
            sx={{
                bgcolor: 'whitesmoke',
                mt: 2,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
                py: 4,
            }}
        >
            {/* Text Section */}
            <Box
                sx={{
                    width: { xs: '100%', md: '50%' },
                    textAlign: 'center',
                    mb: { xs: 4, md: 0 },
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Discover our <br />
                    Curated Collection
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mt: 2, fontSize: { xs: 14, sm: 16 }, px: { xs: 2, sm: 5 } }}
                >
                    Explore our carefully selected products for your home
                    <br />
                    and lifestyle.
                </Typography>
                
                <Link to='/signUp'>
                    <Box mt={3}>
                        <Button variant="contained" sx={{
                            bgcolor: 'black',
                            color: 'white',
                            borderRadius: 50,
                            width: '8rem',
                            fontSize: 15,
                            '&:hover': {
                                backgroundColor: '#fff',
                                color: 'black',
                            },
                        }}>
                            Sign Up
                        </Button>
                    </Box>
                </Link>
            </Box>

            {/* Image Section */}

            <Box
                sx={{
                    width: { xs: '100%', md: '50%' },
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    component="img"
                    src={img1}
                    alt="Hero"
                    sx={{
                        width: { xs: '100%', sm: 400, md: 500 },
                        height: 'auto',
                        maxWidth: '100%',
                        borderRadius: 2,
                    }}
                />
            </Box>

        </Box>

    );
}

export default Hero;
