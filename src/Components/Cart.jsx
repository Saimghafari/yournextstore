import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    TableFooter,
    Checkbox,
    FormControlLabel,
    Paper,
    Input,
    FormLabel,
    InputAdornment,
    Alert,
    Snackbar,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, checkOut, resetCheckout } from '../Redux/CheckOutSlice';
import { addToCart, incremental, decrement, removeFromCart, clearCart } from '../Redux/CartSlice';
import { useNavigate, Link } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import image2 from '../assets/img2.png';
import image3 from '../assets/img3.png';
import image4 from '../assets/img4.png';
import image5 from '../assets/img5.png';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import store from '../Redux/store'

// Yup Validation Schema
const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    fullName: Yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
    address: Yup.string().min(5, 'Address must be at least 5 characters').required('Address is required'),
    contactNo: Yup.string().matches(/^\+?\d{10,15}$/, 'Invalid phone number').required('Contact number is required'),
    countryRegion: Yup.string().required('Country or region is required'),
    shippingMethod: Yup.string().required('Shipping method is required'),
    cardNumber: Yup.string().matches(/^\d{15,16}$/, 'Card number must be 15 or 16 digits').required('Card number is required'),
    expirationDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Invalid expiration date (MM/YY)')
        .test('is-not-expired', 'Card has expired', (value) => {
            if (!value) return false;
            const [month, year] = value.split('/');
            const expDate = dayjs(`20${year}-${month}-01`, 'YYYY-MM-DD');
            return expDate.isAfter(dayjs());
        })
        .required('Expiration date is required'),
    securityCode: Yup.string().matches(/^\d{3,4}$/, 'Security code must be 3 or 4 digits').required('Security code is required'),
    billingAddress: Yup.string().when('sameAsShipping', {
        is: false,
        then: Yup.string().min(5, 'Billing address must be at least 5 characters').required('Billing address is required'),
    }),
    billingCity: Yup.string().when('sameAsShipping', {
        is: false,
        then: Yup.string().required('City is required'),
    }),
    billingState: Yup.string().when('sameAsShipping', {
        is: false,
        then: Yup.string().required('State/Region is required'),
    }),
    billingCountry: Yup.string().when('sameAsShipping', {
        is: false,
        then: Yup.string().required('Country is required'),
    }),
    postal: Yup.string().when('sameAsShipping', {
        is: false,
        then: Yup.string().matches(/^\d{5}(-\d{4})?$/, 'Invalid postal code').required('Postal code is required'),
    }),
});

function Cart() {
    const [shippingMethod, setShippingMethod] = useState('');
    const [shippingDuration, setShippingDuration] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [localSuccess, setLocalSuccess] = useState(null);

    const { userDetails, status, error, order } = useSelector((state) => state.checkout);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart.cartItems) || [];
    const total = (useSelector((state) => state.cart.totalPrice) || 0).toFixed(2);

    const formik = useFormik({
        initialValues: {
            email: userDetails.email || '',
            fullName: userDetails.fullName || '',
            address: userDetails.address || '',
            contactNo: userDetails.contactNo || '',
            countryRegion: userDetails.countryRegion || '',
            shippingMethod: userDetails.shippingMethod || '',
            cardNumber: userDetails.cardNumber || '',
            expirationDate: userDetails.expirationDate || '',
            securityCode: userDetails.securityCode || '',
            billingAddress: userDetails.billingAddress || '',
            billingCity: userDetails.billingCity || '',
            billingState: userDetails.billingState || '',
            billingCountry: userDetails.billingCountry || '',
            postal: userDetails.postal || '',
            billingPhoneNumber: userDetails.billingPhoneNumber || '',
            sameAsShipping: !showForm,
        },
        validationSchema,
        onSubmit: async (values) => {
            if (cart.length === 0) {
                setLocalError('Cart is empty. Add items before checking out.');
                setTimeout(() => setLocalError(null), 2000);
                return;
            }

            try {
                dispatch(setUserDetails(values));
                dispatch(checkOut({ cartItems: cart, userDetails: values }));

                setTimeout(() => {
                    const checkoutState = store.getState().checkout;
                    if (checkoutState.status === 'success') {
                        // Show snackbar message
                        setLocalSuccess(`Order placed successfully! Total: $${checkoutState.order?.total}. Redirecting...`);

                        setTimeout(() => {
                            dispatch(clearCart());
                            dispatch(resetCheckout());
                            navigate('/');
                            setLocalSuccess(null); 
                        }, 3000); 
                    } else {
                        setLocalError(checkoutState.error || 'Checkout failed. Please try again.');
                        setTimeout(() => setLocalError(null), 2000);
                    }
                }, 100); // small wait for state update
            } catch (error) {
                console.error('Checkout error:', error);
                setLocalError('An error occurred during checkout. Please try again.');
                setTimeout(() => setLocalError(null), 2000);
            }
        },

    });

    const handleCheckBoxChange = (event) => {
        setShowForm(event.target.checked);
        formik.setFieldValue('sameAsShipping', !event.target.checked);
    };

    const handleShippingOptionClick = (option) => {
        formik.setFieldValue('shippingMethod', option.method);
        setShippingMethod(option.method);
        setShippingDuration(option.duration);
        setShippingCost(option.cost.toFixed(2));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column', lg: 'row' }, gap: 3 }}>
            <Snackbar
                open={Boolean(localError)}
                autoHideDuration={2500}
                onClose={() => setLocalError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setLocalError(null)} severity="error" sx={{ width: '100%' }}>
                    {localError}
                </Alert>
            </Snackbar>

            {status === 'processing' && <Alert severity="info" sx={{ mb: 2 }}>Processing your order...</Alert>}
            <Snackbar
                open={Boolean(localSuccess)}
                autoHideDuration={2500}
                onClose={() => setLocalSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setLocalSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {localSuccess}
                </Alert>
            </Snackbar>

            {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ width: { xs: '100%', md: '100%', lg: '60%' } }}>
                {cart.length === 0 ? (
                    <Box
                        sx={{
                            mt: { xs: 4, md: 8 },
                            px: 2,
                            minHeight: '60vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: { xs: '3rem', md: '4rem' }, color: 'gray', mb: 2 }}>
                            <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: 60, md: 80 } }} />
                        </Box>
                        <Stack spacing={2} alignItems="center">
                            <Typography variant="h5" fontWeight={600}>Your cart is empty</Typography>
                            <Typography sx={{ maxWidth: 400, color: 'text.secondary' }}>
                                Looks like you haven't added anything to your cart yet.
                            </Typography>
                            <Link to={'/'}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'black',
                                        color: '#fff',
                                        border: '1px solid black',
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        mt: 2,
                                        fontSize: '1rem',
                                        '&:hover': { backgroundColor: '#fff', color: 'black' },
                                    }}
                                >
                                    Continue Shopping
                                </Button>
                            </Link>
                        </Stack>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 4 }}>Your Cart</Typography>
                        <TableContainer sx={{ position: 'sticky', top: 0, mt: 6, boxShadow: 3, borderRadius: 2, overflowY: 'auto', }}>
                            <Table stickyHeader>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box
                                                        component="img"
                                                        src={item.image}
                                                        alt={item.title}
                                                        sx={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 1, border: '1px solid #eee', backgroundColor: '#fafafa' }}
                                                    />
                                                    <Typography variant="body1" fontWeight={500}>{item.title}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">${item.price.toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton size="small" onClick={() => dispatch(decrement(item.id))}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography>{item.quantity}</Typography>
                                                    <IconButton size="small" onClick={() => dispatch(incremental(item.id))}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.primary">${(item.price * item.quantity).toFixed(2)}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box display="flex" flexDirection="row" gap={1}>
                                                    <Typography variant="body1" fontWeight="bold" color="black">{shippingMethod}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{shippingDuration}</Typography>
                                                </Box>
                                                <Typography variant="body1" fontWeight="medium">${shippingCost}</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ paddingTop: 2 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Button
                                                    onClick={() => dispatch(clearCart())}
                                                    sx={{ color: 'gray', fontWeight: 'bold', fontSize: '1.2rem', background: 'transparent', '&:hover': { color: 'black' } }}
                                                >
                                                    Clear Cart
                                                </Button>
                                                <Typography variant="h6" fontWeight="bold">TOTAL</Typography>
                                                <Typography variant="h6" fontWeight="bold">${(parseFloat(total) + parseFloat(shippingCost)).toFixed(2)}</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
            {cart.length > 0 && (
                <Box sx={{ width: { xs: '100%', md: '100%', lg: '40%' }, mt: { xs: 2, md: 2, lg: 0 } }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 4 }}>Checkout</Typography>
                        <Typography variant="subtitle2" color="gray">Provide billing and shipping details below.</Typography>
                    </Box>
                    <Box sx={{ width: '100%', mt: 3 }}>
                        <TextField
                            id="email"
                            label="Email"
                            name="email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && !!formik.errors.email}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            id="fullName"
                            label="Full Name"
                            name="fullName"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 3 }}
                            required
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullName && !!formik.errors.fullName}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                        />
                        <FormControl fullWidth sx={{ mt: 3 }} required>
                            <InputLabel>Country or Region</InputLabel>
                            <Select
                                name="countryRegion"
                                label="Country or Region"
                                value={formik.values.countryRegion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.countryRegion && !!formik.errors.countryRegion}
                            >
                                <MenuItem value="Pakistan">Pakistan</MenuItem>
                                <MenuItem value="UK">UK</MenuItem>
                                <MenuItem value="USA">USA</MenuItem>
                                <MenuItem value="China">China</MenuItem>
                                <MenuItem value="Australia">Australia</MenuItem>
                            </Select>
                            {formik.touched.countryRegion && formik.errors.countryRegion && (
                                <Typography color="error" variant="caption">{formik.errors.countryRegion}</Typography>
                            )}
                        </FormControl>
                        <TextField
                            label="Address Line 1"
                            name="address"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mt: 3 }}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && !!formik.errors.address}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                        <TextField
                            label="Contact NO"
                            name="contactNo"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mt: 3 }}
                            value={formik.values.contactNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.contactNo && !!formik.errors.contactNo}
                            helperText={formik.touched.contactNo && formik.errors.contactNo}
                        />
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Shipping Method</Typography>
                        <Grid container spacing={1}>
                            {[
                                { method: 'USPS', duration: '6-60 days', cost: 0.99 },
                                { method: 'DHL', duration: '2-15 days', cost: 5.00 },
                                { method: 'USPS2', duration: '4-44 days', cost: 9.99 },
                                { method: 'USPS3', duration: '3-33 days', cost: 10.99 },
                                { method: 'Space Shipping', duration: '1 day', cost: 213.37 },
                                { method: 'Ground Shipping', duration: '3-5 days', cost: 20.00 },
                            ].map((option, index) => (
                                <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 4 }} key={index}>
                                    <Box
                                        sx={{
                                            border: 1,
                                            borderRadius: 2,
                                            p: 2,
                                            cursor: 'pointer',
                                            color: formik.values.shippingMethod === option.method ? 'blue' : 'gray',
                                        }}
                                        onClick={() => handleShippingOptionClick(option)}
                                    >
                                        <Typography variant="body2" color="black">{option.method}</Typography>
                                        <Typography variant="body2" color="text.secondary">{option.duration}</Typography>
                                        <Typography variant="body2" color="black">${option.cost.toFixed(2)}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        {formik.touched.shippingMethod && formik.errors.shippingMethod && (
                            <Typography color="error" variant="caption">{formik.errors.shippingMethod}</Typography>
                        )}
                    </Box>
                    <Box>
                        <FormControlLabel
                            sx={{ mt: 3 }}
                            control={<Checkbox checked={showForm} onChange={handleCheckBoxChange} />}
                            label={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Billing address same as shipping</Typography>}
                        />
                    </Box>
                    {showForm && (
                        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                            <FormControl fullWidth>
                                <Typography variant="h6" gutterBottom>Billing Address</Typography>
                                <TextField
                                    id="billing-fullName"
                                    label="Full Name"
                                    name="fullName"
                                    variant="outlined"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    required
                                    sx={{ mt: 3 }}
                                    error={formik.touched.fullName && !!formik.errors.fullName}
                                    helperText={formik.touched.fullName && formik.errors.fullName}
                                />
                                <TextField
                                    label="Address"
                                    name="billingAddress"
                                    variant="outlined"
                                    value={formik.values.billingAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    error={formik.touched.billingAddress && !!formik.errors.billingAddress}
                                    helperText={formik.touched.billingAddress && formik.errors.billingAddress}
                                />
                                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                    <TextField
                                        label="Postal Code"
                                        name="postal"
                                        variant="outlined"
                                        value={formik.values.postal}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        fullWidth
                                        required
                                        error={formik.touched.postal && !!formik.errors.postal}
                                        helperText={formik.touched.postal && formik.errors.postal}
                                    />
                                    <TextField
                                        label="City"
                                        name="billingCity"
                                        variant="outlined"
                                        value={formik.values.billingCity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        fullWidth
                                        required
                                        error={formik.touched.billingCity && !!formik.errors.billingCity}
                                        helperText={formik.touched.billingCity && formik.errors.billingCity}
                                    />
                                </Stack>
                                <TextField
                                    label="State/Region"
                                    name="billingState"
                                    variant="outlined"
                                    value={formik.values.billingState}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    required
                                    sx={{ mt: 3 }}
                                    error={formik.touched.billingState && !!formik.errors.billingState}
                                    helperText={formik.touched.billingState && formik.errors.billingState}
                                />
                                <FormControl fullWidth required sx={{ mt: 3 }}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        name="billingCountry"
                                        label="Country"
                                        value={formik.values.billingCountry}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.billingCountry && !!formik.errors.billingCountry}
                                    >
                                        <MenuItem value="Pakistan">Pakistan</MenuItem>
                                        <MenuItem value="UK">UK</MenuItem>
                                        <MenuItem value="USA">USA</MenuItem>
                                        <MenuItem value="China">China</MenuItem>
                                        <MenuItem value="Australia">Australia</MenuItem>
                                    </Select>
                                    {formik.touched.billingCountry && formik.errors.billingCountry && (
                                        <Typography color="error" variant="caption">{formik.errors.billingCountry}</Typography>
                                    )}
                                </FormControl>
                                <TextField
                                    label="Phone Number"
                                    name="billingPhoneNumber"
                                    variant="outlined"
                                    value={formik.values.billingPhoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    error={formik.touched.billingPhoneNumber && !!formik.errors.billingPhoneNumber}
                                    helperText={formik.touched.billingPhoneNumber && formik.errors.billingPhoneNumber}
                                />
                            </FormControl>
                        </Paper>
                    )}
                    <Box>
                        <Paper elevation={3} sx={{ mt: 4, borderRadius: 2, border: '1px solid #e0e0e0', p: 3, backgroundColor: '#fff' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600}>Card</Typography>
                            </Box>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <FormLabel>Card number</FormLabel>
                                <TextField
                                    placeholder="1234 1234 1234 1234"
                                    variant="outlined"
                                    name="cardNumber"
                                    value={formik.values.cardNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Box display="flex" gap={0.5}>
                                                    <img src={image2} alt="cvv" style={{ width: 30, height: 'auto' }} />
                                                    <img src={image3} alt="mastercard" style={{ width: 30 }} />
                                                    <img src={image4} alt="union" style={{ width: 30 }} />
                                                    <img src={image5} alt="visa" style={{ width: 30 }} />
                                                </Box>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ borderRadius: 1 }}
                                    error={formik.touched.cardNumber && !!formik.errors.cardNumber}
                                    helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                                />
                            </FormControl>
                            <Box display="flex" gap={2} mb={2}>
                                <FormControl fullWidth>
                                    <FormLabel>Expiration date</FormLabel>
                                    <Input
                                        name="expirationDate"
                                        placeholder="MM/YY"
                                        value={formik.values.expirationDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        sx={{ borderRadius: 1 }}
                                        error={formik.touched.expirationDate && !!formik.errors.expirationDate}
                                    />
                                    {formik.touched.expirationDate && formik.errors.expirationDate && (
                                        <Typography color="error" variant="caption">{formik.errors.expirationDate}</Typography>
                                    )}
                                </FormControl>
                                <FormControl fullWidth>
                                    <FormLabel>Security code</FormLabel>
                                    <Input
                                        name="securityCode"
                                        placeholder="CVC"
                                        value={formik.values.securityCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        sx={{ borderRadius: 1 }}
                                        error={formik.touched.securityCode && !!formik.errors.securityCode}
                                        InputProps={{ endAdornment: <CreditCardIcon /> }}
                                    />
                                    {formik.touched.securityCode && formik.errors.securityCode && (
                                        <Typography color="error" variant="caption">{formik.errors.securityCode}</Typography>
                                    )}
                                </FormControl>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: '#0a2540',
                                    color: '#fff',
                                    borderRadius: 10,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#081c33' },
                                }}
                                disabled={status === 'processing'}
                                onClick={formik.handleSubmit}
                            >
                                Pay now
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default Cart;