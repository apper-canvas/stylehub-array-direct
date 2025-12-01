import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import Button from "@/components/atoms/Button";
import { setCategories } from "@/store/slices/filtersSlice";
import { selectActiveFilterCount } from "@/store/slices/filtersSlice";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("sub");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const activeFilterCount = useSelector(selectActiveFilterCount);

  useEffect(() => {
    // Set category filter when component mounts
    const categories = [category];
    if (subcategory) {
      categories.push(subcategory);
    }
    dispatch(setCategories(categories));
  }, [category, subcategory, dispatch]);

  const getCategoryTitle = () => {
    let title = category.charAt(0).toUpperCase() + category.slice(1);
    if (subcategory) {
      title += ` - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
    }
    return title;
  };

  const getCategoryDescription = () => {
    const descriptions = {
      men: "Discover the latest trends in men's fashion. From casual wear to formal attire, find everything you need to express your style.",
      women: "Explore our stunning collection of women's fashion. From elegant dresses to trendy accessories, we have everything for the modern woman.",
      kids: "Fun and comfortable clothing for your little ones. Quality materials and playful designs that kids love.",
    };
    
    return descriptions[category.toLowerCase()] || "Browse our amazing collection of fashion items.";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              {getCategoryTitle()}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {getCategoryDescription()}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <FilterSidebar 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-primary">
                Products
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Product Grid */}
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;