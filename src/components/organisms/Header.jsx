import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistItems } from "@/store/slices/wishlistSlice";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector(selectWishlistItems);

  const categories = [
    {
      name: "Men",
      href: "/category/men",
      subcategories: [
        { name: "T-Shirts", href: "/category/men?sub=t-shirts" },
        { name: "Shirts", href: "/category/men?sub=shirts" },
        { name: "Jeans", href: "/category/men?sub=jeans" },
        { name: "Shoes", href: "/category/men?sub=shoes" },
      ]
    },
    {
      name: "Women",
      href: "/category/women",
      subcategories: [
        { name: "Dresses", href: "/category/women?sub=dresses" },
        { name: "Tops", href: "/category/women?sub=tops" },
        { name: "Bags", href: "/category/women?sub=bags" },
        { name: "Shoes", href: "/category/women?sub=shoes" },
      ]
    },
    {
      name: "Kids",
      href: "/category/kids",
      subcategories: [
        { name: "Boys", href: "/category/kids?sub=boys" },
        { name: "Girls", href: "/category/kids?sub=girls" },
        { name: "Uniforms", href: "/category/kids?sub=uniforms" },
        { name: "Shoes", href: "/category/kids?sub=shoes" },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-gray-200 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StyleHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  to={category.href}
                  className="text-primary hover:text-accent transition-colors duration-200 font-medium"
                >
                  {category.name}
                </Link>
                
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className="block px-4 py-2 text-sm text-secondary hover:text-accent hover:bg-gray-50 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button 
              className="md:hidden text-secondary hover:text-accent transition-colors"
              onClick={() => navigate('/search')}
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link 
              to="/wishlist"
              className="relative text-secondary hover:text-accent transition-colors"
            >
              <ApperIcon name="Heart" className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart"
              className="relative text-secondary hover:text-accent transition-colors"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-secondary hover:text-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-surface">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchBar />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    to={category.href}
                    className="block text-primary font-medium py-2 hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <div className="ml-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className="block text-secondary text-sm py-1 hover:text-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;