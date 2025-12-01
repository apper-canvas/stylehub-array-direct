import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-9xl font-display font-bold text-accent/20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                <ApperIcon name="Search" className="w-12 h-12 text-accent" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-display font-bold text-primary">
              Page Not Found
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or doesn't exist.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Home" className="w-4 h-4" />
                Go Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-secondary mb-3">
                Or try these popular pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => navigate("/category/women")}
                  className="px-3 py-1 text-xs bg-surface border border-gray-200 rounded-lg text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  Women's Fashion
                </button>
                <button
                  onClick={() => navigate("/category/men")}
                  className="px-3 py-1 text-xs bg-surface border border-gray-200 rounded-lg text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  Men's Fashion
                </button>
                <button
                  onClick={() => navigate("/search")}
                  className="px-3 py-1 text-xs bg-surface border border-gray-200 rounded-lg text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;