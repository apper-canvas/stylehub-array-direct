import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import {
  selectFilters,
  selectActiveFilterCount,
  toggleCategory,
  toggleBrand,
  toggleSize,
  toggleColor,
  setPriceRange,
  setSortBy,
  clearAllFilters,
} from "@/store/slices/filtersSlice";

const FilterSidebar = ({ isOpen, onClose, className = "" }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const activeFilterCount = useSelector(selectActiveFilterCount);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    size: true,
    color: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPriceRange({
      ...filters.priceRange,
      [name]: parseInt(value)
    }));
  };

  const availableOptions = {
    categories: ["Men", "Women", "Kids", "T-Shirts", "Shirts", "Jeans", "Dresses", "Shoes"],
    brands: ["StyleCo", "UrbanFit", "FloralChic", "ElegantWear", "FunKids", "SportMax", "LuxeBags", "BusinessWear"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"],
    colors: ["Black", "White", "Navy", "Blue", "Red", "Pink", "Grey", "Brown"],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "rating", label: "Highest Rated" },
      { value: "discount", label: "Highest Discount" },
    ]
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <h3 className="font-medium text-primary">{title}</h3>
        <ApperIcon 
          name={expandedSections[sectionKey] ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-secondary" 
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ checked, onChange, label, count }) => (
    <label className="flex items-center space-x-2 cursor-pointer hover:text-accent transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded text-accent focus:ring-accent border-gray-300"
      />
      <span className="text-sm text-secondary flex-1">{label}</span>
      {count && <span className="text-xs text-secondary">({count})</span>}
    </label>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-display font-semibold text-lg text-primary">Filters</h2>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={() => dispatch(clearAllFilters())}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden text-secondary hover:text-primary transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-medium text-primary mb-3">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {availableOptions.sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <FilterSection title="Categories" sectionKey="category">
          {availableOptions.categories.map((category) => (
            <CheckboxOption
              key={category}
              checked={filters.categories.includes(category)}
              onChange={() => dispatch(toggleCategory(category))}
              label={category}
            />
          ))}
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="min"
                value={filters.priceRange.min}
                onChange={handlePriceChange}
                placeholder="Min"
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
              <span className="text-secondary">-</span>
              <input
                type="number"
                name="max"
                value={filters.priceRange.max}
                onChange={handlePriceChange}
                placeholder="Max"
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="text-xs text-secondary">
              ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
            </div>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brand" sectionKey="brand">
          {availableOptions.brands.map((brand) => (
            <CheckboxOption
              key={brand}
              checked={filters.brands.includes(brand)}
              onChange={() => dispatch(toggleBrand(brand))}
              label={brand}
            />
          ))}
        </FilterSection>

        {/* Sizes */}
        <FilterSection title="Size" sectionKey="size">
          <div className="grid grid-cols-3 gap-2">
            {availableOptions.sizes.map((size) => (
              <label
                key={size}
                className={`border rounded-lg p-2 text-center cursor-pointer transition-colors text-sm ${
                  filters.sizes.includes(size)
                    ? "border-accent bg-accent text-white"
                    : "border-gray-300 text-secondary hover:border-accent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.sizes.includes(size)}
                  onChange={() => dispatch(toggleSize(size))}
                  className="hidden"
                />
                {size}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection title="Color" sectionKey="color">
          {availableOptions.colors.map((color) => (
            <CheckboxOption
              key={color}
              checked={filters.colors.includes(color)}
              onChange={() => dispatch(toggleColor(color))}
              label={color}
            />
          ))}
        </FilterSection>
      </div>
    </div>
  );

  // Mobile overlay
  if (isOpen) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed top-0 right-0 h-full w-80 bg-surface z-50 transform transition-transform duration-250">
          {sidebarContent}
        </div>
        
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block w-80 bg-surface border-r border-gray-200 ${className}`}>
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar (always visible)
  return (
    <div className={`hidden lg:block w-80 bg-surface border-r border-gray-200 ${className}`}>
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;