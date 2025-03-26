import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddProduct = ({ onCancel, onAddProduct, editingProduct }) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: 0,
    category: "",
    stockQuantity: 0,
    sellerName: "",
    productImages: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form data when editing a product
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        productName: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price !== undefined ? editingProduct.price : 0,
        category: editingProduct.category || "",
        stockQuantity: editingProduct.stock !== undefined ? editingProduct.stock : 0,
        sellerName: editingProduct.seller || "",
        productImages: null, // Reset image field for editing
      });
    }
  }, [editingProduct]);

  // Validate individual form fields
  const validateForm = (field, value) => {
    switch (field) {
      case "productName":
        return value.trim() === "" ? "Product name is required" : "";
      case "description":
        return value.trim() === "" ? "Description is required" : "";
      case "price":
        if (value === "" || value === null) return "Price is required";
        return isNaN(value) || Number(value) < 0 ? "Price must be a valid positive number" : "";
      case "category":
        return value.trim() === "" ? "Category is required" : "";
      case "stockQuantity":
        if (value === "" || value === null) return "Stock quantity is required";
        return isNaN(value) || Number(value) < 0
          ? "Stock quantity must be a valid positive number"
          : "";
      case "sellerName":
        return value.trim() === "" ? "Seller name is required" : "";
      case "productImages":
        if (!editingProduct && !value) return "Product image is required";
        return "";
      default:
        return "";
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being edited
    const error = validateForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0] || null;
    setFormData({ ...formData, productImages: file });

    // Validate image field
    const error = validateForm("productImages", file);
    setErrors((prev) => ({ ...prev, productImages: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let currentErrors = {};
    let isFieldEmpty = false;

    const requiredFields = [
      "productName",
      "description",
      "price",
      "category",
      "stockQuantity",
      "sellerName",
      "productImages",
    ];
    requiredFields.forEach((field) => {
      const error = validateForm(field, formData[field]);
      if (error) {
        currentErrors[field] = error;
        if (error.includes("required")) {
          isFieldEmpty = true;
        }
      }
    });

    setErrors(currentErrors);

    if (isFieldEmpty) {
      return toast.error("Please fill out all required fields.");
    }

    if (Object.keys(currentErrors).length > 0) {
      return toast.error("Please correct the errors in the form.");
    }

    // Prepare form data for API submission
    const formPayload = new FormData();
    formPayload.append("productName", formData.productName);
    formPayload.append("description", formData.description);
    formPayload.append("price", formData.price);
    formPayload.append("category", formData.category);
    formPayload.append("stockQuantity", formData.stockQuantity);
    formPayload.append("sellerName", formData.sellerName);

    if (formData.productImages) {
      formPayload.append("productImages", formData.productImages);
    }

    setLoading(true);

    try {
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : "http://localhost:5000/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formPayload,
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data.success) {
        onAddProduct(data.data);
        toast.success(data.message);
      } else if (res.status === 400) {
        return toast.error(data.message || "Invalid data provided. Please check your inputs.");
      } else {
        toast.error(data.message || "An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 font-semibold text-gray-800">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter product name"
          />
          {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter product description"
            rows="4"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter stock quantity"
              min="0"
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="">Select category</option>
            <option value="Brakes">Brakes</option>
            <option value="Lighting">Lighting</option>
            <option value="Engine">Engine</option>
            <option value="Wheels">Wheels</option>
            <option value="Electrical">Electrical</option>
            <option value="Suspension">Suspension</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Seller Name</label>
          <input
            type="text"
            name="sellerName"
            value={formData.sellerName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter seller name"
          />
          {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product Image</label>
          <input
            type="file"
            name="productImages"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <p className="mt-2 text-sm text-gray-500">
            {editingProduct && editingProduct.images
              ? "Current image uploaded. Upload a new image to replace."
              : "No image uploaded yet. JPG, PNG, or GIF, up to 10MB."}
          </p>
          {errors.productImages && (
            <p className="text-red-500 text-sm mt-1">{errors.productImages}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : editingProduct ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
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