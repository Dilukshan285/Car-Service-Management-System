import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("All Time");

  // Fetch orders from the backend on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
          date: new Date(order.orderDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          items: order.items.reduce((total, item) => total + item.quantity, 0),
          amount: order.totals.total,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize status
        }));

        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error(err.message || "Failed to load orders");
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle filtering based on search query, status, and date
  useEffect(() => {
    let filtered = [...orders];

    // Filter by search query (order ID)
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter !== "All Time") {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        if (dateFilter === "Last 7 Days") {
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
        } else if (dateFilter === "Last 30 Days") {
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
        } else if (dateFilter === "Last 6 Months") {
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 180;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, dateFilter, orders]);

  const handleContinueShopping = () => {
    navigate("/ProductDisplay");
  };

  const handleViewDetails = (orderId) => {
    navigate(`/OrderDetail/${orderId}`);
  };

  if (loading) {
    return <div className="bg-gray-100 min-h-screen p-6"><p>Loading orders...</p></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">My Orders</h1>
        <button
          onClick={handleContinueShopping}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>

      {/* Order Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Filters</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by order ID..."
            className="px-4 py-2 w-80 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <span className="text-lg font-semibold">Order History</span>
          <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
        </div>
        {filteredOrders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm text-gray-600">Order ID</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Items</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Amount</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-sm">{order.id}</td>
                  <td className="px-4 py-2 text-sm">{order.date}</td>
                  <td className="px-4 py-2 text-sm">{order.items}</td>
                  <td className="px-4 py-2 text-sm">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Shipped"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Pending"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;