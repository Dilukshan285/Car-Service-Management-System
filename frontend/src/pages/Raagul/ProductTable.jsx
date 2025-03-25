
import React, { useState } from 'react';
import Sidebar from '../../components/Raagul/Sidebar';
import AddProduct from './AddProduct'; // Import the AddProduct component

const ProductTable = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const products = [
    { id: 1, name: 'Performance Brake Pads', price: 89.99, category: 'Brakes', stock: 45, seller: 'AutoPro Supplies' },
    { id: 2, name: 'LED Headlight Kit', price: 129.99, category: 'Lighting', stock: 32, seller: 'LightTech Auto' },
    { id: 3, name: 'Oil Filter Premium', price: 12.99, category: 'Engine', stock: 120, seller: 'FilterKing' },
    { id: 4, name: 'Alloy Wheel Set', price: 599.99, category: 'Wheels', stock: 8, seller: 'WheelDealz' },
    { id: 5, name: 'Performance Air Filter', price: 49.99, category: 'Engine', stock: 65, seller: 'TurboMax' },
  ];

  const handleAddProduct = () => {
    setShowAddProduct(true);

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Raagul/Sidebar';
import AddProduct from './AddProduct';

const ProductTable = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]); // Default to empty array
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [productToDelete, setProductToDelete] = useState(null); // State for product to delete
  const [toastMessage, setToastMessage] = useState(''); // State for toast message

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        credentials: 'include' // Include credentials if needed
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data); // Debug log
      if (data.success) {
        setProducts(data.data || []); // Use data.data, default to empty array
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setEditingProduct(null);

  };

  const handleCancelAddProduct = () => {
    setShowAddProduct(false);


    setEditingProduct(null);
    fetchProducts(); // Refresh products
  };

  const handleEditProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched product for edit:', data); // Debug log
      if (data.success) {
        setEditingProduct(data.data); // Use data.data
        setShowAddProduct(true);
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product for edit:', error);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the product list
      // Show success toast
      setToastMessage('Product deleted successfully!');
      setTimeout(() => setToastMessage(''), 3000); // Hide toast after 3 seconds
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);

  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}

      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-3xl font-semibold">Products Management</h1>
          <button 
            onClick={handleAddProduct} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add New Product
          </button>
        </div>

        {showAddProduct && (
          <AddProduct 
            onCancel={handleCancelAddProduct} 
            onAddProduct={handleCancelAddProduct} 

          />
        )}

        {/* Products Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Seller</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <img src="https://via.placeholder.com/40" alt={product.name} className="w-10 h-10 object-cover rounded-full" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className={`inline-block px-3 py-1 rounded-full ${product.stock < 10 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.seller}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button className="text-blue-500 hover:text-blue-700">Edit</button> | 
                    <button className="text-red-500 hover:text-red-700"> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

            editingProduct={editingProduct}
          />
        )}

        {loading ? (
          <div className="text-center p-6">Loading products...</div>
        ) : error ? (
          <div className="text-center p-6 text-red-600">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="text-center p-6">No products available.</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Seller</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <img 
                        src={product.images || 'https://via.placeholder.com/40?text=No+Image'} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded-full" 
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=Error')} // Fallback for invalid images
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`inline-block px-3 py-1 rounded-full ${product.stock < 10 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.seller}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button 
                        onClick={() => handleEditProduct(product._id)} 
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button> | 
                      <button 
                        onClick={() => handleDeleteClick(product)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-medium">{productToDelete?.name}</span>?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast Message */}
        {toastMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
            {toastMessage}
          </div>
        )}

      </div>
    </div>
  );
};


export default ProductTable;

export default ProductTable;

