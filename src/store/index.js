import { configureStore } from '@reduxjs/toolkit';
import cartSlice from '@/store/slices/cartSlice';
import wishlistSlice from '@/store/slices/wishlistSlice';
import productsSlice from '@/store/slices/productsSlice';
import filtersSlice from '@/store/slices/filtersSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishlistSlice,
    products: productsSlice,
    filters: filtersSlice,
  },
});