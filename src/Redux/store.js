import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './ProductSlice'
import cartReducer from './CartSlice'
import checkOutReducer from './CheckOutSlice'

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        checkout: checkOutReducer,
    }
})

export default store