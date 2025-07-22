import { createSlice } from '@reduxjs/toolkit'



const LoadCartFromLocalStorage = () => {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : {
            cartItems: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    } catch {
        return {
            cartItems: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }
};



const saveCartToLocalStorage = (state) => {
    const cartData = {
        cartItems: state.cartItems,
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice,
    }

    localStorage.setItem('cart', JSON.stringify(cartData))
}

const initialState = LoadCartFromLocalStorage() || {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existing = state.cartItems.find(i => i.id === item.id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.cartItems.push({ ...item, quantity: 1 })
            }

            state.totalQuantity += 1;
            state.totalPrice += item.price;
            saveCartToLocalStorage(state);
        },

        incremental: (state, action) => {
            const id = action.payload;
            const item = state.cartItems.find(i => i.id === id);

            if (item) {
                item.quantity += 1;
                state.totalQuantity += 1;
                state.totalPrice += item.price;
                saveCartToLocalStorage(state);
            }
        },
        
        decrement: (state, action) => {
            const id = action.payload;
            const item = state.cartItems.find(i => i.id === id);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    state.totalQuantity -= 1;
                    state.totalPrice -= item.price;
                } else {
                    state.totalQuantity -= 1;
                    state.totalPrice -= item.price;
                    state.cartItems = state.cartItems.filter(i => i.id !== id);
                }

                saveCartToLocalStorage(state);
            }
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            const item = state.cartItems.find(i => i.id === id);

            if (item) {
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.cartItems = state.cartItems.filter(i => i.id !== id);
                saveCartToLocalStorage(state);
            }
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;

            saveCartToLocalStorage(state);
        }
    }
})

export const { addToCart, incremental, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
