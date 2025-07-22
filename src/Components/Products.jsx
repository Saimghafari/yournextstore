import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/ProductSlice';
import { Box, Grid, Typography, Skeleton, Pagination, Stack } from '@mui/material';
import ProductsCard from './ProductsCard';
import { useSearch } from '../Context/SearchContext';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import RemoveIcon from '@mui/icons-material/Remove';



function Products() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { searchData, filteredProducts, } = useSearch();
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOption, setSortOption] = useState('');


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSort = useCallback((option) => {
        setSortOption(option);
        handleClose();
    }, [handleClose]);

    const handlePageChange = (value) => {
        setPage(value);
    }

    // const displayProducts = searchData.trim() ? filteredProducts : products;

    const displayProducts = useMemo(() => {
        return searchData.trim() ? filteredProducts : products;
    }, [searchData, filteredProducts, products]);
    

    // sorting products

    const sortedProducts = useMemo(() => {
        let sorted = [...displayProducts];
        if (sortOption === 'High to Low') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'Low to High') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'A-Z') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'Z-A') {
            sorted.sort((a, b) => b.title.localeCompare(a.title));
        }
        return sorted;
    }, [sortOption, displayProducts]);


    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setPage(1);
    }, [searchData, sortOption]);

    
    const itemPerPage = 8;
    const startIndex = (page - 1) * itemPerPage;
    const lastIndex = startIndex + itemPerPage;
    const paginationProducts = sortedProducts.slice(startIndex, lastIndex);
    const totalPages = Math.ceil(sortedProducts.length / itemPerPage);

    // const filteredData = (query) => {
    //     products.filter((product) => (
    //         product.title.toLowerCase().includes(query.toLowerCase()) ||
    //         product.category.toLowerCase().includes(query.toLowerCase())
    //     ))
    // }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" mb={4} mt={4}>
                    <strong>All Products</strong>
                </Typography>

                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    disableRipple
                >
                    <FilterListAltIcon />
                </IconButton>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 4,
                        sx: {
                            borderRadius: 2,
                            minWidth: 200,
                            px: 1,
                            mt: -4,
                        },
                    }}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => handleSort('')}
                        sx={{
                            fontWeight: sortOption === '' ? 'bold' : 'normal',
                            bgcolor: sortOption === '' ? 'rgba(0,0,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            borderRadius: 1,
                        }}
                    >
                        <RemoveIcon fontSize="small" sx={{ mr: 1 }} />
                        None
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSort('High to Low')}
                        sx={{
                            fontWeight: sortOption === 'High to Low' ? 'bold' : 'normal',
                            bgcolor: sortOption === 'High to Low' ? 'rgba(0,0,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            borderRadius: 1,
                        }}
                    >
                        <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
                        High to Low
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSort('Low to High')}
                        sx={{
                            fontWeight: sortOption === 'Low to High' ? 'bold' : 'normal',
                            bgcolor: sortOption === 'Low to High' ? 'rgba(0,0,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            borderRadius: 1,
                        }}
                    >
                        <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
                        Low to High
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSort('A-Z')}
                        sx={{
                            fontWeight: sortOption === 'A-Z' ? 'bold' : 'normal',
                            bgcolor: sortOption === 'A-Z' ? 'rgba(0,0,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            borderRadius: 1,
                        }}
                    >
                        <SortByAlphaIcon fontSize="small" sx={{ mr: 1 }} />
                        A-Z
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleSort('Z-A')}
                        sx={{
                            fontWeight: sortOption === 'Z-A' ? 'bold' : 'normal',
                            bgcolor: sortOption === 'Z-A' ? 'rgba(0,0,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' },
                            borderRadius: 1,
                        }}
                    >
                        <SortByAlphaIcon sx={{ transform: 'rotate(180deg)', mr: 1 }} fontSize="small" />
                        Z-A
                    </MenuItem>
                </Menu>
            </Box>

            {loading ? (
                <Grid container spacing={4}>
                    {Array.from(new Array(8)).map((_, index) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Skeleton variant="rectangular" height={320} />
                        </Grid>
                    ))}
                </Grid>
            ) : error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : paginationProducts?.length > 0 ? (
                <Grid container spacing={4}>
                    {paginationProducts.map((product) => (
                        <Grid item key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                            <ProductsCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            ) : (

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '300px',
                }}>
                    <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                        No Results Found
                    </Typography>
                </Box>
            )}

            <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => handlePageChange(value)}
                    hidePrevButton
                    hideNextButton
                />
            </Stack>
        </Box>
    );
}

export default Products;