import React, { useState } from 'react';
import {
  Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import OrdersModel from './OrdersModel';

function Orders() {
  const initialOrders = JSON.parse(localStorage.getItem('orders')) || [];

  const [orderItems, setOrderItems] = useState(initialOrders);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null); // ID or orderNumber
  const [openModel, setOpenModel] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteItem = () => {
    const updated = orderItems.filter(
      (item) => (item.id || item.orderNumber) !== selectedId
    );
    setOrderItems(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    handleMenuClose();
  };

  // Find selected order for model view
  const selectedOrder = orderItems.find(
    (item) => (item.id || item.orderNumber) === selectedId
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4" fontWeight="bold">Orders</Typography>
      </Box>

      <TableContainer sx={{ mt: 4, boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderItems.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{item.orderNumber}</TableCell>
                <TableCell>{item.userDetails?.fullName}</TableCell>
                <TableCell>{item.userDetails?.email}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography>{item.totalQuantity || item.cartItems?.length}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{item.total}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        fontWeight: 'bold',
                        color: '#00796B',
                        backgroundColor: '#C8E6C9',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                      }}
                    >
                      Completed
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item.id || item.orderNumber)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            mt: 1.5,
            minWidth: 180,
            p: 1.5,
            bgcolor: '#fff',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          handleOpen();
        }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>

        <MenuItem onClick={deleteItem}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* OrdersModel should be outside the Menu */}
      <OrdersModel
        openModel={openModel}
        handleClose={handleClose}
        order={selectedOrder}
      />
    </Box>
  );
}

export default Orders;
