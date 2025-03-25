
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate from React Router

const ProductPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook for navigation
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Performance Brake Pads',
      price: 89.99,
      category: 'Brakes',
      rating: 4.5,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'High-performance ceramic brake pads for sports cars',
    },
    {
      id: 2,
      name: 'Alloy Wheel Set',
      price: 599.99,
      category: 'Wheels',
      rating: 4.9,
      image: 'https://via.placeholder.com/150',
      inStock: false,
      description: '18-inch lightweight alloy wheels, set of 4',
    },
    {
      id: 3,
      name: 'Car Battery',
      price: 129.99,
      category: 'Electrical',
      rating: 4.6,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'High-performance car battery with 3-year warranty',
    },
    {
      id: 4,
      name: 'LED Headlight Kit',
      price: 129.99,
      category: 'Lighting',
      rating: 4.2,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'Ultra-bright LED headlight conversion kit',
    },
    {
      id: 5,
      name: 'Oil Filter Premium',
      price: 12.99,
      category: 'Engine',
      rating: 4.8,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'Premium oil filter for extended engine life',
    },
    {
      id: 6,
      name: 'Performance Air Filter',
      price: 49.99,
      category: 'Engine',
      rating: 4.3,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'High-flow air filter for improved engine performance',
    },
    {
      id: 7,
      name: 'Synthetic Motor Oil',
      price: 32.99,
      category: 'Engine',
      rating: 4.7,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'Full synthetic motor oil for maximum engine protection',
    },
    {
      id: 8,
      name: 'Suspension Kit',
      price: 349.99,
      category: 'Suspension',
      rating: 4.4,
      image: 'https://via.placeholder.com/150',
      inStock: true,
      description: 'Complete suspension upgrade kit for improved handling',
    },
  ]);

  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [availability, setAvailability] = useState(false);
  const [cart, setCart] = useState([]); // Cart state to store added items


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [availability, setAvailability] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          credentials: 'include' // Include credentials if your API requires authentication
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched products:', data); // Debug log
        if (data.success) {
          // Map API data to match component expectations
          const mappedProducts = (data.data || []).map((product) => ({
            id: product._id, // Use _id from MongoDB as id
            name: product.name,
            price: product.price,
            category: product.category,
            rating: 4.5, // Default rating (not in schema)
            image: product.images || 'https://via.placeholder.com/150', // Use Base64 or fallback
            inStock: product.stock > 0, // Derive from stock
            description: product.description || 'No description available',
            stock: product.stock // Keep stock for reference
          }));
          setProducts(mappedProducts);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category, price range, availability, and search query

  const filteredProducts = products.filter((product) => {
    const inCategory = category === 'All' || product.category === category;
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inStock = availability ? product.inStock : true;

    return inCategory && inPriceRange && inStock;
  });

  // Function to handle adding products to the cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // If the product already exists in the cart, increase the quantity

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()); // Case-insensitive search
    return inCategory && inPriceRange && inStock && matchesSearch;
  });

  // Handle adding products to the cart
  const handleAddToCart = (product) => {
    if (!product.inStock) return; // Prevent adding out-of-stock items
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {

        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };


  // Navigate to Cart Page when the Cart button is clicked
  const handleGoToCart = () => {
    navigate('/cart'); // Redirect to the Cart page

  // Navigate to Cart Page
  const handleGoToCart = () => {
    navigate('/cart');

  };

  return (
    <div className="bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">Car Parts & Accessories</h1>
        <div className="flex items-center space-x-4">
          <button

            onClick={handleGoToCart} // Cart button click handler
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"

            onClick={handleGoToCart}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105"

          >
            Cart ({cart.reduce((total, product) => total + product.quantity, 0)})
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Filters Section */}

        <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCategory('All')}
                  className={`block text-lg ${category === 'All' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Engine')}
                  className={`block text-lg ${category === 'Engine' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Brakes')}
                  className={`block text-lg ${category === 'Brakes' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Brakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Wheels')}
                  className={`block text-lg ${category === 'Wheels' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Wheels
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Electrical')}
                  className={`block text-lg ${category === 'Electrical' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Electrical
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Lighting')}
                  className={`block text-lg ${category === 'Lighting' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Lighting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory('Suspension')}
                  className={`block text-lg ${category === 'Suspension' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}
                >
                  Suspension
                </button>
              </li>
            </ul>

        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Filters</h2>

          {/* Categories Dropdown */}
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
              <option value="Lighting">Lighting</option>
            </select>

          </div>

          {/* Price Range */}
          <div className="mb-6">

            <h3 className="text-lg font-medium mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max="600"
              step="1"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, e.target.value])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">

            <h3 className="text-lg font-medium mb-2 text-gray-700">Price Range</h3>
            <input
              type="range"
              min="0"
              max="1500"
              step="1"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none transition-all duration-300 hover:bg-gray-300"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">

              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">

            <h3 className="text-lg font-medium mb-2">Availability</h3>

            <h3 className="text-lg font-medium mb-2 text-gray-700">Availability</h3>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={availability}
                onChange={() => setAvailability(!availability)}

                className="form-checkbox"
              />
              <span className="ml-2">In stock only</span>

                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">In stock only</span>

            </label>
          </div>
        </div>

        {/* Product List */}
        <div className="w-3/4 pl-6">

          <h3 className="text-xl font-semibold mb-6">Browse our selection of high-quality automotive parts and accessories</h3>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />
                <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">${product.price}</span>
                  {product.inStock ? (
                    <button
                      onClick={() => handleAddToCart(product)} // Add product to the cart
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="text-red-500 text-sm">Low Stock</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="mr-1">⭐</span>{product.rating}
                  </span>
                  <span>{product.category}</span>
                </div>
                {/* View Details Button */}
                <Link to={`/ProductDetails/${product.id}`} className="text-blue-600 mt-2 block text-center">
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Search Bar and Heading */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-4 rounded-lg"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} // Fallback for invalid images
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

