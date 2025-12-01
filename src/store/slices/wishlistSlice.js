import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('stylehub-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error('Error loading wishlist from storage:', error);
    return [];
  }
};

const saveWishlistToStorage = (items) => {
  try {
    localStorage.setItem('stylehub-wishlist', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const { productId, name, brand, image, price, discountPrice, inStock } = action.payload;
      const exists = state.items.find(item => item.productId === productId);
      
      if (!exists) {
        state.items.push({
          productId,
          name,
          brand,
          image,
          price,
          discountPrice: discountPrice || price,
          inStock,
        });
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (state, productId) => {
  return state.wishlist.items.some(item => item.productId === productId);
};

export default wishlistSlice.reducer;