import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatters';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      // Redirect to home if no order data
      navigate('/');
    }
  }, [navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading order details...</p>
        </div>
      </div>
    );
  }

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'cod':
        return { name: 'Cash on Delivery', icon: 'Truck' };
      case 'upi':
        return { name: 'UPI Payment', icon: 'Smartphone' };
      case 'stripe':
        return { name: 'Credit/Debit Card', icon: 'CreditCard' };
      default:
        return { name: 'Unknown', icon: 'AlertCircle' };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay(orderData.paymentMethod);

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (orderData.paymentMethod === 'cod' ? 7 : 5));
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ApperIcon name="CheckCircle" className="w-10 h-10 text-success" />
            </motion.div>
            
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Order Confirmed!
            </h1>
            <p className="text-secondary text-lg">
              Thank you for your order. We'll send you updates via email.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-surface rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-display font-semibold text-primary mb-1">
                    Order #{orderData.orderId}
                  </h2>
                  <p className="text-secondary">
                    Placed on {new Date(orderData.timestamp).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(orderData.totals.total)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <ApperIcon name={paymentDisplay.icon} className="w-4 h-4" />
                    <span>{paymentDisplay.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Information */}
                <div>
                  <h3 className="font-display font-semibold text-primary mb-3 flex items-center gap-2">
                    <ApperIcon name="MapPin" className="w-5 h-5" />
                    Shipping Address
                  </h3>
                  <div className="text-secondary space-y-1">
                    <p className="font-medium text-primary">{orderData.shipping.fullName}</p>
                    <p>{orderData.shipping.address}</p>
                    <p>{orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}</p>
                    <p>{orderData.shipping.country}</p>
                    <p className="mt-2">
                      <span className="text-primary font-medium">Phone:</span> {orderData.shipping.phone}
                    </p>
                    <p>
                      <span className="text-primary font-medium">Email:</span> {orderData.shipping.email}
                    </p>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="font-display font-semibold text-primary mb-3 flex items-center gap-2">
                    <ApperIcon name="Clock" className="w-5 h-5" />
                    Delivery Information
                  </h3>
                  <div className="text-secondary space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">Estimated Delivery:</span>
                      <span className="text-accent font-medium">{getEstimatedDelivery()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">Status:</span>
                      <span className="px-2 py-1 bg-info/20 text-info text-xs rounded-full">
                        Order Confirmed
                      </span>
                    </div>
                    {orderData.paymentMethod === 'cod' && (
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg mt-3">
                        <p className="text-warning text-sm font-medium">
                          Cash on Delivery: Please keep exact change ready
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-surface rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h3 className="font-display font-semibold text-primary flex items-center gap-2">
                <ApperIcon name="Package" className="w-5 h-5" />
                Order Items ({orderData.items.length} {orderData.items.length === 1 ? 'item' : 'items'})
              </h3>
            </div>
            
            <div className="divide-y">
              {orderData.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary truncate">{item.name}</h4>
                    <p className="text-secondary text-sm">
                      Size: {item.selectedSize} • Quantity: {item.quantity}
                    </p>
                    <p className="text-secondary text-sm">
                      Brand: {item.brand}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-secondary text-sm">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="space-y-2 text-sm max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span className="text-secondary">Subtotal:</span>
                  <span className="text-primary">{formatPrice(orderData.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Shipping:</span>
                  <span className="text-primary">
                    {orderData.totals.shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatPrice(orderData.totals.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Tax:</span>
                  <span className="text-primary">{formatPrice(orderData.totals.tax)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-primary">Total:</span>
                  <span className="text-primary">{formatPrice(orderData.totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Home" className="w-4 h-4" />
              Continue Shopping
            </Button>
            
            <Button
              size="lg"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Printer" className="w-4 h-4" />
              Print Order Details
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-surface rounded-lg shadow-sm text-center">
            <h3 className="font-display font-semibold text-primary mb-2">
              Need Help?
            </h3>
            <p className="text-secondary mb-4">
              If you have any questions about your order, feel free to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@stylehub.com"
                className="flex items-center justify-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <ApperIcon name="Mail" className="w-4 h-4" />
                support@stylehub.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center justify-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <ApperIcon name="Phone" className="w-4 h-4" />
                +91 123 456 7890
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;