import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  CalendarIcon, 
  PackageIcon, 
  TruckIcon, 
  CreditCardIcon 
} from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch order");
        }

        const data = await response.json();
        setOrder(data.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error(err.message || "Failed to load order details");
        navigate("/myorders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-gray-600 text-xl">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-blue-100">Order ID: {order._id}</p>
          </div>
          <button
            onClick={() => navigate("/myorders")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back to My Orders
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <CalendarIcon className="text-blue-600" />
              <div>
                <p className="text-gray-500 text-sm">Order Date</p>
                <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <PackageIcon className="text-blue-600" />
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <CreditCardIcon className="text-blue-600" />
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="font-semibold text-green-600">${order.totals.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <PackageIcon className="mr-2 text-blue-600" /> Order Items
            </h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.productId._id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TruckIcon className="mr-2 text-blue-600" /> Shipping Information
              </h3>
              <div className="space-y-2">
                <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.area}</p>
                <p><strong>City:</strong> {order.shippingInfo.city}, {order.shippingInfo.state}</p>
                <p><strong>Postal Code:</strong> {order.shippingInfo.postalCode}</p>
                <p><strong>Country:</strong> {order.shippingInfo.country}</p>
                <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCardIcon className="mr-2 text-blue-600" /> Payment Information
              </h3>
              <div className="space-y-2">
                <p><strong>Payment Method:</strong> {order.paymentInfo.paymentMethod}</p>
                {order.paymentInfo.transactionId && (
                  <p><strong>Transaction ID:</strong> {order.paymentInfo.transactionId}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;