import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from "@/store/slices/wishlistSlice";
import { fetchProductById, selectCurrentProduct, selectProductsLoading, selectProductsError, clearError } from "@/store/slices/productsSlice";
import * as ProductService from "@/services/api/ProductService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const isInWishlist = useSelector(state => selectIsInWishlist(state, parseInt(id)));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      loadSimilarProducts();
    }
  }, [product]);

  const loadSimilarProducts = async () => {
    if (!product) return;
    
    try {
      setSimilarLoading(true);
      const similar = await ProductService.getSimilarProducts(product.Id, product.category);
      setSimilarProducts(similar);
    } catch (err) {
      console.error("Failed to load similar products:", err);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchProductById(id));
  };

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor && product?.colors?.length > 0) {
      toast.error("Please select a color");
      return;
    }

    if (!product?.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(addToCart({
      productId: product.Id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      discountPrice: product.discountPrice,
    }));

    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.Id));
      toast.success("Removed from wishlist");
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
      toast.success("Added to wishlist!");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (product?.inStock && selectedSize && selectedColor) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="detail" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView 
          message={error || "Product not found"} 
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-secondary mb-8">
        <button onClick={() => navigate("/")} className="hover:text-accent transition-colors">
          Home
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <button 
          onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
          className="hover:text-accent transition-colors"
        >
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-primary">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-surface shadow-lg">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-accent" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Brand */}
          <div className="text-sm font-medium text-secondary uppercase tracking-wider">
            {product.brand}
          </div>

          {/* Name */}
          <h1 className="text-3xl font-display font-bold text-primary leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-warning fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-primary">
                {product.rating}
              </span>
            </div>
            <span className="text-sm text-secondary">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            size="xl"
          />

          {/* Description */}
          <div className="prose prose-sm text-secondary">
            <p>{product.description}</p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-primary">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-white"
                        : "border-gray-300 text-secondary hover:border-accent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-primary">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-accent bg-accent text-white"
                        : "border-gray-300 text-secondary hover:border-accent"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-accent transition-colors"
              >
                <ApperIcon name="Minus" className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-accent transition-colors"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <ApperIcon
              name={product.inStock ? "CheckCircle" : "XCircle"}
              className={`w-5 h-5 ${
                product.inStock ? "text-success" : "text-error"
              }`}
            />
            <span
              className={`font-medium ${
                product.inStock ? "text-success" : "text-error"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full"
              >
                Buy Now
              </Button>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
              className="w-full"
            >
              <ApperIcon 
                name="Heart" 
                className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-current" : ""}`} 
              />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-display font-bold text-primary mb-8">
            You Might Also Like
          </h2>
          {similarLoading ? (
            <Loading type="grid" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.Id} product={product} />
              ))}
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
};

export default ProductDetail;