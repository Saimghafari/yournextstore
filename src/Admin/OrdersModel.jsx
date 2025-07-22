import React from 'react';
import {
    Box,
    Typography,
    Modal,
    List,
    ListItem,
    Avatar,
    Stack,
    Fade,
    Chip
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 640,
    bgcolor: '#ffffff',
    borderRadius: 6,
    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    p: 4,
    maxHeight: '90vh',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
};

function OrdersModel({ openModel, handleClose, order }) {

    if (!order) return null;

    return (
        <Modal open={openModel} onClose={handleClose} closeAfterTransition>
            <Fade in={openModel}>
                <Box sx={style}>
                    {/* Header */}
                    <Box
                        mb={3}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            px: 3,
                            py: 2,
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    color: '#ffffff',
                                    letterSpacing: 0.5,
                                    mb: 0.5,
                                }}
                            >
                                Order #{order.orderNumber}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#e3f2fd' }}>
                                {new Date(order.date).toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Close icon calls handleClose prop */}
                        <Box
                            onClick={handleClose}
                            sx={{
                                cursor: 'pointer',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                },
                            }}
                        >
                            <CloseRoundedIcon fontSize="medium" />
                        </Box>
                    </Box>

                    {/* Customer Info */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            backgroundColor: '#f8f9fa',
                            p: 3,
                            borderRadius: 4,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            mb: 4,
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: '#888' }}>
                                Customer
                            </Typography>
                            <Typography fontWeight={600} sx={{ color: '#2c3e50' }}>
                                {order.userDetails?.fullName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                                {order.userDetails?.email}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                                {order.userDetails?.countryRegion}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                                {order.userDetails?.contactNo}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                                {order.userDetails?.address}
                            </Typography>
                        </Box>

                        <Box textAlign="right">
                            <Typography variant="subtitle2" sx={{ color: '#888' }}>
                                Shipping Method
                            </Typography>
                            <Chip
                                label={order.userDetails?.shippingMethod}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{ mt: 0.5 }}
                            />
                            <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 2 }}>
                                Total Amount
                            </Typography>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{ color: '#2980b9' }}
                            >
                                ${Number(order.total || 0).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Order Items */}
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ color: '#34495e', mb: 2 }}
                    >
                        Order Items
                    </Typography>

                    {order.cartItems?.length > 0 ? (
                        <List disablePadding>
                            {order.cartItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: '#ffffff',
                                        borderRadius: 3,
                                        px: 2,
                                        py: 2,
                                        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                                        mb: 2,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        <Avatar
                                            src={item.image}
                                            variant="rounded"
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                border: '1px solid #eee',
                                            }}
                                        />
                                        <Box>
                                            <Typography fontWeight={600} sx={{ color: '#2c3e50' }}>
                                                {item.title || 'Untitled'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                                Quantity: {item.quantity || 0}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Typography
                                        fontWeight={700}
                                        sx={{ color: '#27ae60', fontSize: '1rem' }}
                                    >
                                        ${item.price?.toFixed(2) || '0.00'}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{ color: '#bdc3c7' }}
                        >
                            No items found in this order.
                        </Typography>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
}

export default OrdersModel;
