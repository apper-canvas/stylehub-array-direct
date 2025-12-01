import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import * as ProductService from "@/services/api/ProductService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await ProductService.getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: "Men's Fashion",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      href: "/category/men",
      description: "Trendy styles for modern men"
    },
    {
      name: "Women's Collection",
      image: "https://images.unsplash.com/photo-1494790108755-2616c96d9333?w=400&h=300&fit=crop",
      href: "/category/women",
      description: "Elegant fashion for every occasion"
    },
    {
      name: "Kids Wear",
      image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=300&fit=crop",
      href: "/category/kids",
      description: "Comfortable styles for little ones"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                Fashion
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Forward
                </span>
              </h1>
              <p className="text-xl text-white/90 mt-6 leading-relaxed">
                Discover the latest trends and express your unique style with our curated collection of premium fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
                  onClick={() => navigate('/category/women')}
                >
                  Shop Women
                  <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                  onClick={() => navigate('/category/men')}
                >
                  Shop Men
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop"
                  alt="Fashion Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent rounded-xl p-4 shadow-lg">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm">OFF</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every style and occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => navigate(category.href)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-display font-semibold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/90 mb-3">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-sm font-medium">
                      Explore Collection
                      <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Handpicked favorites that are trending right now.
            </p>
          </motion.div>

          {loading ? (
            <Loading type="grid" />
          ) : error ? (
            <ErrorView 
              message={error} 
              onRetry={loadFeaturedProducts}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate('/category/women')}
            >
              View All Products
              <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Stay in Style
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to get notified about new arrivals, exclusive offers, and fashion tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;