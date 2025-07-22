import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material'
import { fetchProducts } from '../Redux/ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProductsCard from '../Components/ProductsCard';
import { useSearch } from '../Context/SearchContext';


function Digital() {

    const { products, loading, error } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const [categoryProducts, setCategoryProducts] = useState([]);
    const { searchData } = useSearch();

    const filterCategoryProducts = useCallback(() => {
        return products.filter((p) => p.category === 'electronics');
    }, [products]);

    useEffect(() => {
        setCategoryProducts(filterCategoryProducts());
    }, [filterCategoryProducts]);

    // const displayProducts = searchData ?
    //     categoryProducts.filter((product) =>  // category base search method
    //         product.title.toLowerCase().includes(searchData.toLowerCase())
    //     ) : categoryProducts;


    // useEffect(() => {

    //     const filtered = products.filter((p) => p.category === "electronics");
    //     setCategoryProducts(filtered);

    // }, [products])

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const displayProducts = useMemo(() => {
        return searchData
            ? categoryProducts.filter((product) =>
                product.title.toLowerCase().includes(searchData.toLowerCase())
            )
            : categoryProducts;
    }, [searchData, categoryProducts]);

    if (loading) return <CircularProgress />
    if (error) return <Typography>Error: {error}</Typography>

    return (
        <Box>
            <Box>
                <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 3, }}>
                    Digital
                </Typography>
                <Typography variant='body1' sx={{ color: 'gray', fontWeight: 'bold' }}>
                    Category
                </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Grid container spacing={4}>

                    {displayProducts.length === 0 ? (
                        <>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '300px',
                            }}>
                                <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                                    No Results Found for '{searchData}'
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            {displayProducts.map((product) => (
                                <Grid item key={product.id} size={{ xs: 12, sm: 6, md: 3 }} >
                                    <ProductsCard product={product} />
                                </Grid>
                            ))}
                        </>
                    )}
                </Grid>
            </Box>
        </Box>
    )
}

export default Digital