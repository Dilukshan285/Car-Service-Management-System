import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Raagul/Sidebar";
import AddProduct from "./AddProduct";
import { toast } from "react-toastify";

const ProductTable = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched products:", data);
      if (data.success) {
        setProducts(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setEditingProduct(null);
  };

  const handleCancelAddProduct = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh products after adding/editing
  };

  const handleEditProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched product for edit:", data);
      if (data.success) {
        setEditingProduct(data.data);
        setShowAddProduct(true);
      } else {
        throw new Error(data.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      toast.error(error.message || "Failed to fetch product for editing");
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
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the product list
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.error(error.message || "Failed to delete product");
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
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Products Management</h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            + Add New Product
          </button>
        </div>

        {showAddProduct && (
          <AddProduct
            onCancel={handleCancelAddProduct}
            onAddProduct={handleCancelAddProduct}
            editingProduct={editingProduct}
          />
        )}

        {loading ? (
          <div className="text-center p-6 text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-center p-6 text-red-600">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="text-center p-6 text-gray-600">No products available.</div>
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
                        src={product.images || "https://via.placeholder.com/40?text=No+Image"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-full"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=Error")}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-block px-3 py-1 rounded-full ${
                          product.stock < 10 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.seller}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      |
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-500 hover:text-red-700 ml-2"
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{productToDelete?.name}</span>?
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
      </div>
    </div>
  );
};

export default ProductTable;