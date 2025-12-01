import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import {
  searchProducts,
  clearSearchResults,
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
} from "@/store/slices/productsSlice";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const query = searchParams.get("q") || "";
  const searchResults = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchProducts(query.trim()));
    } else {
      dispatch(clearSearchResults());
    }

    return () => {
      dispatch(clearSearchResults());
    };
  }, [query, dispatch]);

  const handleRetry = () => {
    if (query.trim()) {
      dispatch(searchProducts(query.trim()));
    }
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, '<mark class="bg-accent/20 text-accent">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-surface border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary text-center mb-6">
              Search Products
            </h1>
            <SearchBar />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-xl font-display font-semibold text-primary"
                  dangerouslySetInnerHTML={{
                    __html: `Search results for "${highlightSearchTerm(query, query)}"`
                  }}
                />
                {!loading && searchResults.length > 0 && (
                  <p className="text-secondary mt-1">
                    Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              {query && (
                <button
                  onClick={() => navigate("/search")}
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  Clear Search
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && <Loading type="grid" />}

        {/* Error State */}
        {error && !loading && (
          <ErrorView
            message={error}
            onRetry={handleRetry}
          />
        )}

        {/* No Query State */}
        {!query && !loading && (
          <Empty
            title="Start your search"
            description="Enter keywords in the search bar above to find products you're looking for."
            icon="Search"
            actionText="Browse Categories"
            onAction={() => navigate("/")}
          />
        )}

        {/* No Results State */}
        {query && !loading && !error && searchResults.length === 0 && (
          <Empty
            title="No products found"
            description={`We couldn't find any products matching "${query}". Try different keywords or browse our categories.`}
            icon="Search"
            actionText="Browse Categories"
            onAction={() => navigate("/")}
          />
        )}

        {/* Search Results */}
        {!loading && !error && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {searchResults.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Popular Searches */}
        {!query && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h3 className="text-lg font-display font-semibold text-primary mb-6">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "T-shirts", "Jeans", "Dresses", "Shoes", 
                "Formal wear", "Casual wear", "Winter collection", "Summer styles"
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-2 bg-surface border border-gray-200 rounded-lg text-sm text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Search;