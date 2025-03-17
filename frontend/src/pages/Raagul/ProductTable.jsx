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
  };

  const handleCancelAddProduct = () => {
    setShowAddProduct(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
      </div>
    </div>
  );
};

export default ProductTable;
