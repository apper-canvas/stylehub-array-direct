import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartCount,
  removeFromCart, 
  updateQuantity,
  clearCart 
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/utils/formatters";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: newQuantity
    }));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({
      productId: item.productId,
      size: item.size,
      color: item.color
    }));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // In a real app, this would navigate to checkout
  };

  const subtotal = cartTotal;
  const shipping = cartTotal > 1500 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.08);
  const finalTotal = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Empty
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
            icon="ShoppingCart"
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
                Shopping Cart
              </h1>
              <p className="text-secondary mt-1">
                {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-error hover:bg-error/10"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-semibold text-primary leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-sm text-secondary mt-1">
                            {item.brand}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-secondary">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="p-2 text-secondary hover:text-error transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-accent transition-colors"
                          >
                            <ApperIcon name="Minus" className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-accent transition-colors"
                          >
                            <ApperIcon name="Plus" className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {formatPrice(item.discountPrice * item.quantity)}
                          </div>
                          {item.discountPrice < item.price && (
                            <div className="text-sm text-secondary line-through">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-surface rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-display font-semibold text-primary mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Subtotal ({cartCount} items)</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary">Shipping</span>
                  <span className="text-primary">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary">Tax</span>
                  <span className="text-primary">{formatPrice(tax)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-primary">Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-4 p-3 bg-info/10 rounded-lg">
                  <p className="text-sm text-info">
                    Add {formatPrice(1500 - subtotal)} more to get FREE shipping!
                  </p>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <ApperIcon name="Shield" className="w-4 h-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;