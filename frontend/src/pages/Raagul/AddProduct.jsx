import React, { useState } from 'react';

const AddProduct = ({ onCancel, onAddProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: 0,
    category: '',
    stockQuantity: 0,
    sellerName: '',
    productImages: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, productImages: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can call the `onAddProduct` function to save the product data
    console.log(formData);
    // Clear form after submission or close the form
    onAddProduct();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Product Name</label>
          <input 
            type="text" 
            name="productName"
            value={formData.productName}
            onChange={handleInputChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
            placeholder="Enter product name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
            placeholder="Enter product description"
          ></textarea>
        </div>

        <div className="mb-4 flex items-center">
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price}
              onChange={handleInputChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
              placeholder="Enter price"
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block text-gray-700">Stock Quantity</label>
            <input 
              type="number" 
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
              placeholder="Enter stock quantity"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select category</option>
            <option value="Brakes">Brakes</option>
            <option value="Lighting">Lighting</option>
            <option value="Engine">Engine</option>
            <option value="Wheels">Wheels</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Seller Name</label>
          <input 
            type="text" 
            name="sellerName"
            value={formData.sellerName}
            onChange={handleInputChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
            placeholder="Enter seller name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Product Images</label>
          <input 
            type="file" 
            onChange={handleImageUpload}
            multiple 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
          />
          <p className="mt-2 text-sm text-gray-500">
            No images uploaded yet. JPG, PNG or GIF, up to 10MB each.
          </p>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Add Product
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="bg-gray-600 text-white ml-4 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
