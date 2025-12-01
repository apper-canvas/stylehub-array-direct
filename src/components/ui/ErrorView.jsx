import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong",
  onRetry,
  showRetry = true,
  className = ""
}) => {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-display font-semibold text-primary mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-secondary font-body">
            {message}
          </p>
        </div>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;