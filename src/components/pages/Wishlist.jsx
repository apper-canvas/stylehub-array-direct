import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import { 
  selectWishlistItems, 
  removeFromWishlist, 
  clearWishlist 
} from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { formatPrice, calculateDiscount } from "@/utils/formatters";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item) => {
    if (!item.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(addToCart({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      image: item.image,
      size: "", // Will need to select size on product page
      color: "", // Will need to select color on product page
      price: item.price,
      discountPrice: item.discountPrice,
    }));
    
    toast.success("Added to cart!");
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    toast.success("Wishlist cleared");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Empty
            title="Your wishlist is empty"
            description="Save items you love to your wishlist. Start shopping and add items to your wishlist for easy access later!"
            icon="Heart"
            actionText="Start Shopping"
            onAction={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-surface border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary">
                My Wishlist
              </h1>
              <p className="text-secondary mt-1">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearWishlist}
                className="text-error hover:bg-error/10"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Wishlist Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item, index) => {
              const discountPercent = calculateDiscount(item.price, item.discountPrice);
              
              return (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-surface rounded-lg shadow-sm hover:shadow-lg transition-all duration-250 overflow-hidden group"
                >
                  {/* Image Container */}
                  <div 
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
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
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.productId);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors duration-200"
                    >
                      <ApperIcon name="X" className="w-4 h-4 text-secondary hover:text-error" />
                    </button>
                    
                    {/* Stock Status Overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="text-xs font-medium text-secondary uppercase tracking-wider">
                      {item.brand}
                    </div>
                    
                    <h3 
                      className="font-display font-medium text-primary text-sm leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                      onClick={() => handleProductClick(item.productId)}
                    >
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {formatPrice(item.discountPrice || item.price)}
                      </span>
                      {item.discountPrice && item.discountPrice < item.price && (
                        <span className="text-sm text-secondary line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex items-center gap-1 text-xs">
                      <ApperIcon
                        name={item.inStock ? "CheckCircle" : "XCircle"}
                        className={`w-3 h-3 ${
                          item.inStock ? "text-success" : "text-error"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          item.inStock ? "text-success" : "text-error"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    
                    {/* Action Button */}
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.inStock) {
                          handleProductClick(item.productId); // Go to product page to select size/color
                        }
                      }}
                      disabled={!item.inStock}
                      className="w-full mt-3"
                    >
                      {item.inStock ? (
                        <>
                          <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      ) : (
                        <>
                          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-2" />
                          Out of Stock
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;