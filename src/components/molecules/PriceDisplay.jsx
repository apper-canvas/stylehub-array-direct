import React from "react";
import { formatPrice, calculateDiscount } from "@/utils/formatters";

const PriceDisplay = ({ price, discountPrice, className = "", size = "md" }) => {
  const discountPercent = calculateDiscount(price, discountPrice);
  const hasDiscount = discountPrice && discountPrice < price;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`font-bold text-primary ${sizeClasses[size]}`}>
        {formatPrice(discountPrice || price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={`text-secondary line-through ${size === 'xl' ? 'text-base' : 'text-sm'}`}>
            {formatPrice(price)}
          </span>
          <span className="text-accent font-medium text-sm">
            ({discountPercent}% OFF)
          </span>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;