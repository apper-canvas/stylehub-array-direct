import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import WriteReviewForm from '@/components/molecules/WriteReviewForm';
import * as ReviewService from '@/services/api/ReviewService';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWriteForm, setShowWriteForm] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await ReviewService.getReviewsByProductId(productId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setTotalCount(prev => prev + 1);
    setShowWriteForm(false);
    // Recalculate average rating
    const newTotal = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating;
    setAverageRating(Math.round((newTotal / (reviews.length + 1)) * 10) / 10);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">
            Reviews ({totalCount})
          </h2>
          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-warning fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-primary">{averageRating}</span>
              <span className="text-sm text-secondary">out of 5</span>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowWriteForm(!showWriteForm)}
          className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors duration-200"
        >
          {showWriteForm ? 'Cancel' : 'Write Review'}
        </motion.button>
      </div>

      {showWriteForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <WriteReviewForm
            productId={productId}
            onReviewAdded={handleReviewAdded}
            onCancel={() => setShowWriteForm(false)}
          />
        </motion.div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-secondary text-lg mb-2">No reviews yet</p>
            <p className="text-secondary text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-surface rounded-lg p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">{review.userName}</h4>
                    <p className="text-sm text-secondary">{formatDate(review.date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-warning fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-secondary leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default ReviewSection;