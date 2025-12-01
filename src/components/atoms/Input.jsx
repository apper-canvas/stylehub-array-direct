import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2 font-body">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-300 bg-surface px-4 py-3 text-sm text-primary placeholder:text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;