import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { formatPrice, calculateDiscount } from "@/utils/formatters";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isInWishlist = useSelector(state => selectIsInWishlist(state, product.Id));

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.Id));
    } else {
      dispatch(addToWishlist({
        productId: product.Id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        discountPrice: product.discountPrice,
        inStock: product.inStock,
      }));
    }
  };

  const discountPercent = calculateDiscount(product.price, product.discountPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-surface rounded-lg shadow-sm hover:shadow-lg transition-all duration-250 cursor-pointer overflow-hidden group product-grid-item"
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <Badge 
            variant="sale" 
            className="absolute top-3 left-3 text-xs font-bold"
          >
            {discountPercent}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
        >
          <ApperIcon 
            name={isInWishlist ? "Heart" : "Heart"} 
            className={`w-4 h-4 transition-colors ${
              isInWishlist 
                ? "text-accent fill-current" 
                : "text-secondary hover:text-accent"
            }`}
          />
        </button>
        
        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="text-xs font-medium text-secondary uppercase tracking-wider">
          {product.brand}
        </div>
        
        <h3 className="font-display font-medium text-primary text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && product.discountPrice < product.price && (
            <span className="text-sm text-secondary line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center">
            <ApperIcon name="Star" className="w-3 h-3 text-warning fill-current" />
            <span className="ml-1 font-medium text-primary">{product.rating}</span>
          </div>
          <span className="text-secondary">({product.reviewCount})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;