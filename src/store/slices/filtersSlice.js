import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    categories: [],
    priceRange: { min: 0, max: 10000 },
    brands: [],
    sizes: [],
    colors: [],
    sortBy: 'newest',
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setSizes: (state, action) => {
      state.sizes = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearAllFilters: (state) => {
      state.categories = [];
      state.priceRange = { min: 0, max: 10000 };
      state.brands = [];
      state.sizes = [];
      state.colors = [];
      state.sortBy = 'newest';
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      if (index >= 0) {
        state.categories.splice(index, 1);
      } else {
        state.categories.push(category);
      }
    },
    toggleBrand: (state, action) => {
      const brand = action.payload;
      const index = state.brands.indexOf(brand);
      if (index >= 0) {
        state.brands.splice(index, 1);
      } else {
        state.brands.push(brand);
      }
    },
    toggleSize: (state, action) => {
      const size = action.payload;
      const index = state.sizes.indexOf(size);
      if (index >= 0) {
        state.sizes.splice(index, 1);
      } else {
        state.sizes.push(size);
      }
    },
    toggleColor: (state, action) => {
      const color = action.payload;
      const index = state.colors.indexOf(color);
      if (index >= 0) {
        state.colors.splice(index, 1);
      } else {
        state.colors.push(color);
      }
    },
  },
});

export const {
  setCategories,
  setPriceRange,
  setBrands,
  setSizes,
  setColors,
  setSortBy,
  clearAllFilters,
  toggleCategory,
  toggleBrand,
  toggleSize,
  toggleColor,
} = filtersSlice.actions;

export const selectFilters = (state) => state.filters;
export const selectActiveFilterCount = (state) => {
  const filters = state.filters;
  return filters.categories.length + filters.brands.length + filters.sizes.length + filters.colors.length;
};

export default filtersSlice.reducer;