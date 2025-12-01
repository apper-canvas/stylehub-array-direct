import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const FilterChip = ({ label, onRemove, className = "" }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-medium ${className}`}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

export default FilterChip;