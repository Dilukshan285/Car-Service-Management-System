import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();  // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // State for the modal visibility
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    // Simulate fetching product data based on the ID
    const fetchedProduct = {
      id: parseInt(id), // Ensuring ID is an integer
      name: 'Performance Brake Pads',
      price: 89.99,
      category: 'Brakes',
      rating: 4.5,
      reviews: [
        { user: 'John D.', rating: 5, comment: 'Excellent stopping power and very little dust. Much better than OEM pads.', date: '2023-12-15' },
        { user: 'Sarah M.', rating: 3, comment: 'Good performance but a bit noisy for the first 100 miles until they were broken in.', date: '2023-11-22' },
      ],
      description:
        'High-performance ceramic brake pads for sports cars. These premium brake pads offer superior stopping power and reduced brake dust compared to standard pads. Designed for high-performance vehicles and spirited driving, they provide consistent braking performance even under high-temperature conditions. Compatible with most sports and performance vehicles.',
      inStock: true,
      soldBy: 'AutoPro Supplies',
    };

    setProduct(fetchedProduct); // Set the product data after fetching
  }, [id]);

  const handleReviewModalToggle = () => {
    setIsReviewModalOpen(!isReviewModalOpen); // Toggle the modal visibility
  };

  const handleReviewSubmit = () => {
    // Add the new review to the product's reviews
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [
        ...prevProduct.reviews,
        { ...newReview, user: 'Anonymous', date: new Date().toISOString().split('T')[0] }, // Add review with current date
      ],
    }));

    setIsReviewModalOpen(false); // Close the modal after submitting
    setNewReview({ rating: 0, comment: '' }); // Reset the review form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      rating: rating,
    }));
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading state while the product is being fetched
  }

  return (
    <div className="bg-gray-100 p-6">
      <div className="flex justify-between mb-6">
        <Link to="/" className="text-blue-600">
          Back to Products
        </Link>
      </div>

      <div className="flex">
        {/* Product Image and Details */}
        <div className="w-1/2 pr-6">
          <img
            src="https://via.placeholder.com/150"
            alt={product.name}
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
          <div className="text-xl font-semibold mb-4">${product.price}</div>
          <div className="text-sm text-gray-500 mb-4">Category: {product.category}</div>
          <div className="mb-4">
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Availability */}
          <div className="text-sm mb-6">
            <strong>Status:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>

          <div className="text-sm mb-6">
            <strong>Sold by:</strong> {product.soldBy}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm text-gray-700">Quantity:</label>
            <input
              type="number"
              min="1"
              max="10"
              defaultValue="1"
              className="w-16 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Add to Cart</button>
          </div>

          {/* Product Rating */}
          <div className="flex items-center mb-4">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={index < Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2">({product.reviews.length} reviews)</span>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={handleReviewModalToggle}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg mb-6"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
        {product.reviews.map((review, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{review.user}</span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`cursor-pointer ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-4"
              >
                Submit
              </button>
              <button
                onClick={handleReviewModalToggle}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default ProductDetail;
