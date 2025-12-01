import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ProductService from '@/services/api/ProductService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}) => {
    return await ProductService.getFilteredProducts(filters);
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    return await ProductService.getById(id);
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query) => {
    return await ProductService.searchProducts(query);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    searchResults: [],
    loading: false,
    error: null,
    searchLoading: false,
    searchError: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message;
      });
  },
});

export const { clearCurrentProduct, clearSearchResults, clearError } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectSearchResults = (state) => state.products.searchResults;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSearchLoading = (state) => state.products.searchLoading;
export const selectSearchError = (state) => state.products.searchError;

export default productsSlice.reducer;