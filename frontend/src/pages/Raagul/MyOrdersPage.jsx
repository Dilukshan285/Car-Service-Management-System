import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportRef = useRef(null);

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
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
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

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

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
    navigate("/accessories");
  };

  const handleViewDetails = (orderId) => {
    navigate(`/OrderDetail/${orderId}`);
  };

  const handleGenerateReport = () => {
    setIsReportOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  const handleDownloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const canvasHeight = (canvas.height * width) / canvas.width;

      if (canvasHeight > height) {
        const ratio = height / canvasHeight;
        pdf.addImage(imgData, "PNG", 0, 0, width * ratio, height);
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, width, canvasHeight);
      }

      pdf.save(`Order_History_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    }).catch((err) => {
      toast.error("Failed to generate PDF: " + err.message);
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
        <p className="text-center text-gray-600 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">My Orders</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateReport}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Generate Report
          </button>
          <button
            onClick={handleContinueShopping}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Filters */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Order Filters</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by order ID..."
            className="px-4 py-3 w-80 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300 text-gray-700o"
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
            className="px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300 text-gray-700"
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-900">Order History</span>
          <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
        </div>
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-lg">No orders found.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Items</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{order.items}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
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

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300">
            <div ref={reportRef} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg">
              <div className="border-b-2 border-teal-300 pb-4 mb-6">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-500 to-blue-600">
                  Order History Report
                </h2>
                <p className="text-sm text-gray-600 italic mt-1">
                  Generated on {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Summary
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl shadow-md border border-green-100">
                    <p className="text-sm text-gray-700 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-green-700">{filteredOrders.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl shadow-md border border-green-100">
                    <p className="text-sm text-gray-700 font-medium">Total Items</p>
                    <p className="text-3xl font-bold text-green-700">
                      {filteredOrders.reduce((sum, order) => sum + order.items, 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl shadow-md border border-green-100">
                    <p className="text-sm text-gray-700 font-medium">Total Amount</p>
                    <p className="text-3xl font-bold text-green-700">
                      ${filteredOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Order Details
                </h3>
                {filteredOrders.length === 0 ? (
                  <p className="text-gray-600 text-center italic">No orders to display in this report.</p>
                ) : (
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 text-gray-800">
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b-2 border-teal-300">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b-2 border-teal-300">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b-2 border-teal-300">Items</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b-2 border-teal-300">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b-2 border-teal-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr
                          key={order.id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } border-b border-gray-200`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800 font-mono">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{order.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{order.items}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 font-semibold">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                order.status === "Delivered"
                                  ? "bg-green-200 text-green-900"
                                  : order.status === "Shipped"
                                  ? "bg-yellow-200 text-yellow-900"
                                  : order.status === "Processing"
                                  ? "bg-blue-200 text-blue-900"
                                  : order.status === "Pending"
                                  ? "bg-gray-200 text-gray-900"
                                  : "bg-red-200 text-red-900"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Download PDF
              </button>
              <button
                onClick={handleCloseReport}
                className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-700 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;