import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [availability, setAvailability] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) navigate("/sign-in");
  }, [currentUser, navigate]);

  const fetchCartCount = async () => {
    if (!currentUser) return;
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        const total = data.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            rating: 4.5,
            images: product.images || "https://via.placeholder.com/150",
            inStock: product.stock > 0,
            description: product.description || "No description available",
            stock: product.stock,
          })));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchCartCount();
  }, [currentUser]);

  const filteredProducts = products.filter((product) => {
    const inCategory = category === "All" || product.category === category;
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inStock = availability ? product.inStock : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return inCategory && inPriceRange && inStock && matchesSearch;
  });

  const handleAddToCart = async (product) => {
    if (!product.inStock) {
      toast.error("Product is out of stock!");
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
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add to cart");
      if (data.success) {
        toast.success(`${product.name} added to cart!`);
        fetchCartCount();
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleGoToCart = () => navigate("/cart");

  if (!currentUser) return null;

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-800">Car Parts & Accessories</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoToCart}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105"
          >
            Cart ({cartCount})
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Filters</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">Categories</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            >
              <option value="All">All</option>
              <option value="Engine">Engine</option>
              <option value="Brakes">Brakes</option>
              <option value="Wheels">Wheels</option>
              <option value="Electrical">Electrical</option>
              <option value="Lighting">Lighting</option>
              <option value="Suspension">Suspension</option>
            </select>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">Price Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1500"
                step="1"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-400"
                style={{ accentColor: "#3b82f6" }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">Availability</h3>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={availability}
                onChange={() => setAvailability(!availability)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">In stock only</span>
            </label>
          </div>
        </div>

        <div className="w-3/4 pl-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Browse our selection of high-quality automotive parts and accessories
            </h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-600">Error: {error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-600">No products available.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={product.images}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-4 rounded-lg"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                  />
                  <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
                    {product.inStock ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <span className="text-red-500 text-sm">Out of Stock</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="mr-1">⭐</span>{product.rating}
                    </span>
                    <span>{product.category}</span>
                  </div>
                  <Link
                    to={`/ProductDetails/${product.id}`}
                    className="mt-2 block text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:from-blue-600 hover:to-blue-800 hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;