import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { selectCartItems, selectCartTotal, selectCartCount, startCheckout, completeCheckout } from '@/store/slices/cartSlice';
import { formatPrice } from '@/utils/formatters';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showUPIQR, setShowUPIQR] = useState(false);
  const [upiPaymentId, setUpiPaymentId] = useState(null);

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = cartTotal > 1500 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.08);
  const finalTotal = subtotal + shipping + tax;

  useEffect(() => {
    if (cartCount === 0) {
      toast.error("Your cart is empty");
      navigate('/cart');
      return;
    }

    // Initialize checkout data
    dispatch(startCheckout({
      subtotal,
      shipping,
      tax,
      total: finalTotal
    }));
  }, [cartCount, navigate, dispatch, subtotal, shipping, tax, finalTotal]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Invalid email format';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateUPIQR = () => {
    const upiId = "merchant@paytm"; // Replace with actual UPI ID
    const amount = finalTotal;
    const orderId = `ORDER_${Date.now()}`;
    
    // UPI URL format
    const upiUrl = `upi://pay?pa=${upiId}&pn=StyleHub&am=${amount}&cu=INR&tn=Payment for Order ${orderId}`;
    
    // Generate QR code URL (using QR Server API)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    
    setUpiPaymentId(orderId);
    return qrUrl;
  };

  const handleUPIPayment = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setShowUPIQR(true);
    toast.info('Scan the QR code to pay via UPI');

    // Simulate payment verification after 10 seconds
    setTimeout(() => {
      toast.success('UPI payment verified!');
      completeOrder();
    }, 10000);
  };

  const handleCODOrder = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      toast.success('Order placed successfully! Cash on Delivery selected.');
      completeOrder();
    }, 2000);
  };

  const handleStripePayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, you would:
      // 1. Create payment intent on your server
      // 2. Use Stripe Elements for card input
      // 3. Confirm payment with Stripe
      
      // For demo purposes, we'll simulate the process
      toast.info('Redirecting to Stripe payment...');
      
      setTimeout(() => {
        // Simulate successful payment
        toast.success('Payment successful!');
        completeOrder();
      }, 3000);

    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const completeOrder = () => {
    const orderData = {
      orderId: `ORDER_${Date.now()}`,
      items: cartItems,
      shipping: shippingInfo,
      paymentMethod,
      totals: {
        subtotal,
        shipping,
        tax,
        total: finalTotal
      },
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };

    // Store order data for confirmation page
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart and complete checkout
    dispatch(completeCheckout());
    
    // Navigate to confirmation
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Checkout
            </h1>
            <p className="text-secondary">
              Complete your order with secure payment
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="space-y-6">
              <div className="bg-surface rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold text-primary mb-4">
                  Shipping Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="Enter your email"
                  />
                  
                  <Input
                    label="Phone Number"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="Enter phone number"
                  />
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      error={errors.address}
                      placeholder="Enter your address"
                    />
                  </div>
                  
                  <Input
                    label="City"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="Enter city"
                  />
                  
                  <Input
                    label="State"
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    error={errors.state}
                    placeholder="Enter state"
                  />
                  
                  <Input
                    label="ZIP Code"
                    value={shippingInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    error={errors.zipCode}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-surface rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold text-primary mb-4">
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <ApperIcon name="Truck" className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-primary">Cash on Delivery</p>
                        <p className="text-sm text-secondary">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>

                  {/* UPI Payment */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <ApperIcon name="Smartphone" className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-primary">UPI Payment</p>
                        <p className="text-sm text-secondary">Pay instantly using UPI apps</p>
                      </div>
                    </div>
                  </label>

                  {/* Stripe Payment */}
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-accent"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <ApperIcon name="CreditCard" className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-primary">Credit/Debit Card</p>
                        <p className="text-sm text-secondary">Secure payment via Stripe</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* UPI QR Code */}
                {showUPIQR && paymentMethod === 'upi' && (
                  <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                    <div className="text-center">
                      <p className="font-medium text-primary mb-3">Scan QR Code to Pay</p>
                      <img
                        src={generateUPIQR()}
                        alt="UPI QR Code"
                        className="w-48 h-48 mx-auto border rounded-lg"
                      />
                      <p className="text-sm text-secondary mt-2">
                        Payment ID: {upiPaymentId}
                      </p>
                      <p className="text-sm text-info mt-1">
                        Waiting for payment confirmation...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-surface rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold text-primary mb-4">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.Id}-${item.selectedSize}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-secondary">
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm border-t pt-4">
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

                {/* Place Order Button */}
                <div className="mt-6">
                  {paymentMethod === 'cod' && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleCODOrder}
                      disabled={loading}
                    >
                      <ApperIcon name="Truck" className="w-4 h-4 mr-2" />
                      {loading ? 'Processing...' : 'Place Order (COD)'}
                    </Button>
                  )}
                  
                  {paymentMethod === 'upi' && !showUPIQR && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleUPIPayment}
                    >
                      <ApperIcon name="Smartphone" className="w-4 h-4 mr-2" />
                      Pay via UPI
                    </Button>
                  )}
                  
                  {paymentMethod === 'stripe' && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleStripePayment}
                      disabled={loading}
                    >
                      <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                      {loading ? 'Processing...' : 'Pay with Card'}
                    </Button>
                  )}
                </div>

                {/* Security Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <ApperIcon name="Shield" className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;