import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('stylehub-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('stylehub-cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, brand, image, size, color, price, discountPrice } = action.payload;
      const existingItem = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          productId,
          name,
          brand,
          image,
          size,
          color,
          quantity: 1,
          price,
          discountPrice: discountPrice || price,
        });
      }
      
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload;
      const item = state.items.find(
        item => item.productId === productId && item.size === size && item.color === color
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
};
export const selectCartCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export default cartSlice.reducer;