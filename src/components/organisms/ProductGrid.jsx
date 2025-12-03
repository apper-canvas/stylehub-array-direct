import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import FilterChip from "@/components/molecules/FilterChip";
import ProductCard from "@/components/molecules/ProductCard";
import { 
  clearError, 
  fetchProducts, 
  selectProducts, 
  selectProductsError, 
  selectProductsLoading 
} from "@/store/slices/productsSlice";
import { 
  clearAllFilters,
  selectActiveFilterCount, 
  selectFilters, 
  toggleBrand, 
  toggleCategory, 
  toggleColor, 
  toggleSize
} from "@/store/slices/filtersSlice";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectFilters);
  const activeFilterCount = useSelector(selectActiveFilterCount);

// Stabilize dispatch reference to prevent unnecessary re-renders
  const stableDispatch = useCallback((action) => dispatch(action), [dispatch]);
  
  useEffect(() => {
    stableDispatch(fetchProducts(filters));
  }, [stableDispatch, filters]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchProducts(filters));
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    
    filters.categories.forEach(category => {
      activeFilters.push({
        type: 'category',
        value: category,
        label: category,
        onRemove: () => dispatch(toggleCategory(category))
      });
    });
    
    filters.brands.forEach(brand => {
      activeFilters.push({
        type: 'brand',
        value: brand,
        label: brand,
        onRemove: () => dispatch(toggleBrand(brand))
      });
    });
    
    filters.sizes.forEach(size => {
      activeFilters.push({
        type: 'size',
        value: size,
        label: `Size: ${size}`,
        onRemove: () => dispatch(toggleSize(size))
      });
    });
    
    filters.colors.forEach(color => {
      activeFilters.push({
        type: 'color',
        value: color,
        label: `Color: ${color}`,
        onRemove: () => dispatch(toggleColor(color))
      });
    });

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={handleRetry}
        className="col-span-full"
      />
    );
  }

  return (
    <div className="flex-1">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {activeFilters.map((filter, index) => (
                <FilterChip
                  key={`${filter.type}-${filter.value}`}
                  label={filter.label}
                  onRemove={filter.onRemove}
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-2 text-sm text-secondary">
            {products.length} products found {activeFilterCount > 0 && `with ${activeFilterCount} filters applied`}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <Empty
          title="No products found"
          description="Try adjusting your filters or search for something else."
          icon="Search"
          actionText="Clear Filters"
          onAction={() => dispatch(clearAllFilters())}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.Id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;