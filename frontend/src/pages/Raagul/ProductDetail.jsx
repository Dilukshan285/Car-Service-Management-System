import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Extract the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          credentials: 'include' // Include credentials if your API requires authentication
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched product:', data); // Debug log
        if (data.success) {
          // Map API data to match component expectations
          const fetchedProduct = {
            id: data.data._id,
            name: data.data.name,
            price: data.data.price,
            category: data.data.category,
            rating: 4.5, // Default since not in schema
            reviews: [], // Default empty array since not in schema
            description: data.data.description || 'No description available',
            inStock: data.data.stock > 0, // Derive from stock
            soldBy: data.data.seller, // Use seller as soldBy
            image: data.data.images || 'https://via.placeholder.com/150' // Base64 or fallback
          };
          setProduct(fetchedProduct);
        } else {
          throw new Error(data.message || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewModalToggle = () => {
    setIsReviewModalOpen(!isReviewModalOpen);
  };

  const handleReviewSubmit = () => {
    // Add the new review to the product's reviews (client-side only)
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [
        ...prevProduct.reviews,
        { ...newReview, user: 'Anonymous', date: new Date().toISOString().split('T')[0] },
      ],
    }));
    setIsReviewModalOpen(false);
    setNewReview({ rating: 0, comment: '' });
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

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <div className="mt-4">
          <Link to="/" className="text-blue-600">Back to Products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-600">
        Product not found.
        <div className="mt-4">
          <Link to="/" className="text-blue-600">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <div className="flex justify-between mb-6">
        <Link to="/" className="text-blue-600">
          Back to Products
        </Link>
      </div>

      <div className="flex">
        {/* Product Image */}
        <div className="w-1/2 pr-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover mb-4 rounded-lg"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} // Fallback for invalid images
          />
        </div>

        {/* Product Info */}
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
          <div className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</div>
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
              max={product.inStock ? product.stock : 0} // Limit by stock
              defaultValue="1"
              className="w-16 px-3 py-2 border border-gray-300 rounded-lg"
              disabled={!product.inStock}
            />
            <button
              className={`px-6 py-2 rounded-lg ${product.inStock ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
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
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
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
          ))
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to write one!</p>
        )}
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
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
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