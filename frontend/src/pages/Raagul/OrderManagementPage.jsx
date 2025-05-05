import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await response.json();
        const fetchedOrders = data.data.map((order) => ({
          id: order._id,
          customer: order.userId.email || "Unknown", // Adjust based on your User model
          date: new Date(order.orderDate).toLocaleDateString("en-US"),
          items: order.items.reduce((total, item) => total + item.quantity, 0),
          amount: order.totals.total,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: status.toLowerCase() }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: status } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.message || "Failed to update status");
    }
  };

  // Function to delete an order
  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete order");
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error(err.message || "Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <p className="text-center text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-semibold mb-6">Order Management</h1>
      <p className="mb-6 text-lg">View and manage customer orders</p>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm text-gray-600">Order ID</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Customer</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Items</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200">
                <td className="px-4 py-2 text-sm">{order.id}</td>
                <td className="px-4 py-2 text-sm">{order.customer}</td>
                <td className="px-4 py-2 text-sm">{order.date}</td>
                <td className="px-4 py-2 text-sm">{order.items}</td>
                <td className="px-4 py-2 text-sm">${order.amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm flex space-x-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementPage;