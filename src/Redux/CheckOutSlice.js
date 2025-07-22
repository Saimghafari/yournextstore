import { createSlice } from '@reduxjs/toolkit';

const loadCheckOutFormLocalStorage = () => {
  try {
    const data = localStorage.getItem('checkout');
    return data
      ? JSON.parse(data)
      : {
          fullName: '',
          email: '',
          address: '',
          contactNo: '',
          countryRegion: '',
          cardNumber: '',
          expirationDate: '',
          securityCode: '',
          shippingMethod: '',
          billingAddress: '',
          billingCity: '',
          billingState: '',
          billingCountry: '',
          postal: '',
          billingPhoneNumber: '',
          sameAsShipping: true,
        };
  } catch {
    return {
      fullName: '',
      email: '',
      address: '',
      contactNo: '',
      countryRegion: '',
      cardNumber: '',
      expirationDate: '',
      securityCode: '',
      shippingMethod: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingCountry: '',
      postal: '',
      billingPhoneNumber: '',
      sameAsShipping: true,
    };
  }
};

const saveCheckOutLocalStorage = (state) => {
  const checkOutData = {
    fullName: state.fullName,
    email: state.email,
    address: state.address,
    contactNo: state.contactNo,
    countryRegion: state.countryRegion,
    shippingMethod: state.shippingMethod,
    billingAddress: state.billingAddress,
    billingCity: state.billingCity,
    billingState: state.billingState,
    billingCountry: state.billingCountry,
    postal: state.postal,
    billingPhoneNumber: state.billingPhoneNumber,
    sameAsShipping: state.sameAsShipping,
    // Do NOT store cardNumber, expirationDate, or securityCode
  };

  localStorage.setItem('checkout', JSON.stringify(checkOutData));
};

const saveOrderToLocalStorage = (order) => {
  try {
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];

    const year = new Date().getFullYear();
    const yearOrders = orders.filter(o => o.orderNumber?.includes(`ORD-${year}`));
    const nextOrderNum = yearOrders.length + 1;
    const paddedNumber = String(nextOrderNum).padStart(3, '0');
    const orderNumber = `ORD-${year}-${paddedNumber}`;

    const orderWithNumber = { ...order, orderNumber };
    orders.push(orderWithNumber);
    localStorage.setItem('orders', JSON.stringify(orders));

    return orderWithNumber; //  return the order with number
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
    return order;
  }
};

const initialUserDetails = loadCheckOutFormLocalStorage();

const checkOutSlice = createSlice({
  name: 'checkout',
  initialState: {
    order: null,
    status: 'idle',
    error: null,
    userDetails: initialUserDetails,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
      saveCheckOutLocalStorage(state.userDetails);
    },
    checkOut: (state, action) => {
      state.status = 'processing';
      state.error = null;

      const { cartItems, userDetails } = action.payload;

      if (!cartItems?.length) {
        state.status = 'error';
        state.error = 'Cart is empty. Add items before checking out.';
        return;
      }

      const requiredFields = [
        'fullName',
        'email',
        'address',
        'contactNo',
        'countryRegion',
        'cardNumber',
        'expirationDate',
        'securityCode',
        'shippingMethod',
      ];
      const missingField = requiredFields.find((field) => !userDetails[field]);

      if (missingField) {
        state.status = 'error';
        state.error = `Please fill the ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
        return;
      }

      const total = cartItems
        .reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = item.quantity || 1;
          return sum + price * quantity;
        }, 0)
        .toFixed(2);

      const totalQuantity = cartItems.reduce((sum, item) => {
        return sum + (item.quantity || 1);
      }, 0);

      const newOrder = {
        cartItems,
        userDetails,
        total,
        totalQuantity,
        date: new Date().toISOString(),
      };

      const orderWithNumber = saveOrderToLocalStorage(newOrder); //  Save and return with number
      state.order = orderWithNumber; //  Save in state
      state.status = 'success';

      saveCheckOutLocalStorage(state.userDetails);
    },
    resetCheckout: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = null;
      state.userDetails = {
        fullName: '',
        email: '',
        address: '',
        contactNo: '',
        countryRegion: '',
        cardNumber: '',
        expirationDate: '',
        securityCode: '',
        shippingMethod: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingCountry: '',
        postal: '',
        billingPhoneNumber: '',
        sameAsShipping: true,
      };
      localStorage.removeItem('checkout');
    },
  },
});

export const { setUserDetails, checkOut, resetCheckout } = checkOutSlice.actions;
export default checkOutSlice.reducer;