import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [quantity, setQuantity] = useState(1);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) navigate("/sign-in");
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setProduct({
            id: data.data._id,
            name: data.data.name,
            price: data.data.price,
            category: data.data.category,
            rating: 4.5,
            reviews: data.data.reviews || [],
            description: data.data.description || "No description available",
            inStock: data.data.stock > 0,
            stock: data.data.stock,
            soldBy: data.data.seller,
            images: data.data.images || "https://via.placeholder.com/150",
          });
        } else {
          throw new Error(data.message || "Failed to fetch product");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewModalToggle = () => {
    setIsReviewModalOpen(!isReviewModalOpen);
    if (isReviewModalOpen) setNewReview({ rating: 0, comment: "" });
  };

  const handleReviewSubmit = async () => {
    try {
      const reviewData = {
        rating: newReview.rating,
        comment: newReview.comment,
        user: currentUser?.email || "Anonymous",
        date: new Date().toISOString().split("T")[0],
      };
      toast.info("Review submission not implemented in backend yet.");
      setProduct((prev) => ({
        ...prev,
        reviews: [...prev.reviews, reviewData],
      }));
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    }
    setIsReviewModalOpen(false);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast.error("Product is out of stock!");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items in stock!`);
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, quantity: parseInt(quantity) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add to cart");
      if (data.success) toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  if (!currentUser) return null;
  if (loading) return <div className="p-6 text-center text-gray-600 animate-pulse">Loading...</div>;
  if (error) return (
    <div className="p-6 text-center text-red-600 bg-red-100 rounded-lg shadow-md">
      Error: {error}
      <div className="mt-4">
        <Link to="/ProductDisplay" className="text-blue-600 hover:underline font-medium">Back to Products</Link>
      </div>
    </div>
  );
  if (!product) return (
    <div className="p-6 text-center text-gray-600 bg-gray-100 rounded-lg shadow-md">
      Product not found.
      <div className="mt-4">
        <Link to="/ProductDisplay" className="text-blue-600 hover:underline font-medium">Back to Products</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 min-h-screen">
      <div className="flex justify-between mb-6">
        <Link to="/accessories" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300">
          ← Back to Products
        </Link>
      </div>
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        <div className="w-full md:w-1/2 p-6">
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg shadow-md border border-gray-100 bg-white p-4 transform hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        </div>
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {product.name}
          </h2>
          <div className="text-2xl font-semibold mb-4 text-gray-900">${product.price.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mb-4 italic">Category: {product.category}</div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 text-lg">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          <div className="text-sm mb-4">
            <strong className="text-gray-800">Status:</strong>{" "}
            <span className={product.inStock ? "text-green-600" : "text-red-600"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="text-sm mb-6">
            <strong className="text-gray-800">Sold by:</strong> {product.soldBy}
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <label className="text-sm text-gray-800 font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.inStock ? product.stock : 0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              disabled={!product.inStock}
            />
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                product.inStock
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-800 font-medium">Rating:</span>
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-2xl transition-transform duration-200 ${
                    i < Math.round(product.rating) ? "text-yellow-400 scale-110" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-600">({product.reviews.length} reviews)</span>
          </div>
          <button
            onClick={handleReviewModalToggle}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105"
          >
            Write a Review
          </button>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Customer Reviews
        </h3>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, i) => (
            <div key={i} className="mb-4 border-b pb-4 transform hover:translate-x-2 transition-transform duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">{review.user}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < review.rating ? "text-yellow-400 scale-110" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              <span className="text-sm text-gray-500 italic">{review.date}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">No reviews yet. Be the first to write one!</p>
        )}
      </div>
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl w-96 shadow-2xl transform scale-100 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Write a Review
            </h2>
            <div className="mb-4">
              <label className="block text-gray-800 mb-2 font-semibold">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`cursor-pointer text-3xl transition-transform duration-200 ${
                      newReview.rating >= star ? "text-yellow-400 scale-110" : "text-gray-300"
                    } hover:scale-125`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 mb-2 font-semibold">Review</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Write your review here..."
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReviewSubmit}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  newReview.rating === 0 || !newReview.comment.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                }`}
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
              >
                Submit
              </button>
              <button
                onClick={handleReviewModalToggle}
                className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-black transition-all duration-300 transform hover:scale-105"
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