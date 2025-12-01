import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import * as ReviewService from '@/services/api/ReviewService';

const WriteReviewForm = ({ productId, onReviewAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 0,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!formData.comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      const newReview = await ReviewService.addReview({
        productId,
        userName: formData.userName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim()
      });
      
      onReviewAdded(newReview);
      toast.success('Review submitted successfully!');
      
      // Reset form
      setFormData({
        userName: '',
        rating: 0,
        comment: ''
      });
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-surface rounded-lg p-6 border border-gray-200"
    >
      <h3 className="text-xl font-display font-semibold text-primary mb-6">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-primary mb-2">
            Your Name
          </label>
          <Input
            id="userName"
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-full"
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-3">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors duration-150"
                disabled={submitting}
              >
                <ApperIcon
                  name="Star"
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || formData.rating)
                      ? "text-warning fill-current"
                      : "text-gray-300 hover:text-warning/50"
                  } transition-colors duration-150`}
                />
              </motion.button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-3 text-sm text-secondary">
                {formData.rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-primary mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your thoughts about this product..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 resize-none"
            disabled={submitting}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            className="text-secondary border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default WriteReviewForm;