import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "We couldn't find what you're looking for.",
  actionText,
  onAction,
  icon = "Package",
  className = ""
}) => {
  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-secondary/10 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-xl font-display font-semibold text-primary mb-3">
            {title}
          </h3>
          <p className="text-secondary font-body leading-relaxed">
            {description}
          </p>
        </div>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ApperIcon name="ShoppingBag" className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;