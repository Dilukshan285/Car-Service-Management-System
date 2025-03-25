import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddProduct = ({ onCancel, onAddProduct, editingProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: 0,
    category: '',
    stockQuantity: 0,
    sellerName: '',
    productImages: null // Changed to 'productImages'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        productName: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price !== undefined ? editingProduct.price : 0,
        category: editingProduct.category || '',
        stockQuantity: editingProduct.stock !== undefined ? editingProduct.stock : 0,
        sellerName: editingProduct.seller || '',
        productImages: null
      });
    }
  }, [editingProduct]);

  const validateForm = (field, value) => {
    switch (field) {
      case 'productName':
        return value.trim() === '' ? 'Product name is required' : '';
      case 'price':
        if (value === '' || value === null) return 'Price is required';
        return isNaN(value) || Number(value) < 0 ? 'Price must be a valid positive number' : '';
      case 'category':
        return value.trim() === '' ? 'Category is required' : '';
      case 'stockQuantity':
        if (value === '' || value === null) return 'Stock quantity is required';
        return isNaN(value) || Number(value) < 0 ? 'Stock quantity must be a valid positive number' : '';
      case 'sellerName':
        return value.trim() === '' ? 'Seller name is required' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0] || null;
    setFormData({ ...formData, productImages: file }); // Changed to 'productImages'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentErrors = {};
    let isFieldEmpty = false;

    const requiredFields = ['productName', 'price', 'category', 'stockQuantity', 'sellerName'];
    requiredFields.forEach((field) => {
      const error = validateForm(field, formData[field]);
      if (error) {
        currentErrors[field] = error;
        if (error.includes('required')) {
          isFieldEmpty = true;
        }
      }
    });

    setErrors(currentErrors);

    if (isFieldEmpty) {
      return toast.error('Please fill out required fields.');
    }

    if (Object.keys(currentErrors).length > 0) {
      return toast.error('Please correct the errors in the form.');
    }

    const formPayload = new FormData();
    formPayload.append('productName', formData.productName);
    formPayload.append('description', formData.description);
    formPayload.append('price', formData.price);
    formPayload.append('category', formData.category);
    formPayload.append('stockQuantity', formData.stockQuantity);
    formPayload.append('sellerName', formData.sellerName);

    if (formData.productImages) {
      formPayload.append('productImages', formData.productImages); // Changed to 'productImages'
    }

    setLoading(true);

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}` 
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: formPayload,
        credentials: 'include'
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data.success) {
        onAddProduct(data.data);
        toast.success(data.message);
      } else if (res.status === 400) {
        return toast.error(data.message || 'Invalid data provided. Please check your inputs.');
      } else {
        toast.error(data.message || 'An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding/updating product:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

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
          {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
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
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
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
              min="0"
            />
            {errors.stockQuantity && <p className="text-red-500 text-sm">{errors.stockQuantity}</p>}
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
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
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
          {errors.sellerName && <p className="text-red-500 text-sm">{errors.sellerName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input 
            type="file" 
            name="productImages" // Changed to 'productImages'
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
          />
          <p className="mt-2 text-sm text-gray-500">
            {editingProduct && editingProduct.images 
              ? 'Current image uploaded. Upload a new image to replace.'
              : 'No image uploaded yet. JPG, PNG or GIF, up to 10MB.'}
          </p>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="bg-gray-600 text-white ml-4 px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;