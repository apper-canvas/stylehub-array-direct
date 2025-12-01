import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 hover:scale-105 focus:ring-accent/50 shadow-md hover:shadow-lg",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    outline: "border border-secondary text-secondary hover:border-primary hover:text-primary focus:ring-secondary/50",
    ghost: "text-secondary hover:bg-secondary/10 hover:text-primary focus:ring-secondary/50",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const disabledStyles = "opacity-50 cursor-not-allowed hover:scale-100";

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && disabledStyles,
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;