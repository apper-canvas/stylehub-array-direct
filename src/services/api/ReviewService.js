const reviews = [
  {
    Id: 1,
    productId: 1,
    userName: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely love this jacket! The quality is exceptional and it fits perfectly. The fabric feels premium and the construction is solid. Definitely worth the investment.",
    date: "2024-01-15T10:30:00Z"
  },
  {
    Id: 2,
    productId: 1,
    userName: "Michael Chen",
    rating: 4,
    comment: "Great jacket overall. The design is stylish and it's comfortable to wear. Only minor complaint is that it runs slightly small, so I'd recommend ordering a size up.",
    date: "2024-01-10T14:22:00Z"
  },
  {
    Id: 3,
    productId: 1,
    userName: "Emma Wilson",
    rating: 5,
    comment: "Perfect for the winter season! Keeps me warm without being too bulky. The color is exactly as shown in the photos. Fast shipping and excellent customer service.",
    date: "2024-01-08T16:45:00Z"
  },
  {
    Id: 4,
    productId: 2,
    userName: "David Rodriguez",
    rating: 4,
    comment: "Comfortable sneakers with great support. Perfect for daily wear and light workouts. The design is clean and goes well with most outfits.",
    date: "2024-01-12T09:15:00Z"
  },
  {
    Id: 5,
    productId: 2,
    userName: "Lisa Thompson",
    rating: 5,
    comment: "Best sneakers I've purchased in years! Super comfortable from day one, no break-in period needed. The quality is outstanding and they look great.",
    date: "2024-01-06T11:30:00Z"
  }
];

let nextId = 6;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReviewsByProductId = async (productId) => {
  await delay(300);
  const productReviews = reviews.filter(review => review.productId === parseInt(productId));
  
  // Calculate average rating
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
  
  return {
    reviews: productReviews.sort((a, b) => new Date(b.date) - new Date(a.date)),
    averageRating: Math.round(averageRating * 10) / 10,
    totalCount: productReviews.length
  };
};

export const addReview = async (reviewData) => {
  await delay(500);
  
  const newReview = {
    Id: nextId++,
    productId: parseInt(reviewData.productId),
    userName: reviewData.userName,
    rating: reviewData.rating,
    comment: reviewData.comment,
    date: new Date().toISOString()
  };
  
  reviews.push(newReview);
  return newReview;
};