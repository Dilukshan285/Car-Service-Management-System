import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from React Router

const ProductPage = () => {
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

  const filteredProducts = products.filter((product) => {
    const inCategory = category === 'All' || product.category === category;
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inStock = availability ? product.inStock : true;
    return inCategory && inPriceRange && inStock;
  });

  return (
    <div className="bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">Car Parts & Accessories</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">Cart (0)</button>
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
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Availability</h3>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={availability}
                onChange={() => setAvailability(!availability)}
                className="form-checkbox"
              />
              <span className="ml-2">In stock only</span>
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
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add to Cart</button>
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
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© 2024 AutoParts. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductPage;
