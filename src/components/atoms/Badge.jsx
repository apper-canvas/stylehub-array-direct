import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default",
  size = "md",
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";
  
  const variants = {
    default: "bg-secondary/10 text-secondary",
    primary: "bg-accent text-white",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    sale: "bg-accent text-white font-bold",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;