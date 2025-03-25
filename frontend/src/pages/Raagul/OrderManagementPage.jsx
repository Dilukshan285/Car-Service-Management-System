import React, { useState } from 'react';

const OrderManagementPage = () => {
  // Sample orders data
  const [orders, setOrders] = useState([
    { id: 'ORD-1234', customer: 'John Doe', date: '2023-05-15', items: 3, amount: 129.99, status: 'Pending' },
    { id: 'ORD-1235', customer: 'Jane Smith', date: '2023-05-16', items: 1, amount: 49.99, status: 'Processing' },
    { id: 'ORD-1236', customer: 'Robert Johnson', date: '2023-05-14', items: 5, amount: 249.50, status: 'Shipped' },
    { id: 'ORD-1237', customer: 'Emily Davis', date: '2023-05-12', items: 2, amount: 89.99, status: 'Delivered' },
    { id: 'ORD-1238', customer: 'Michael Wilson', date: '2023-05-17', items: 4, amount: 179.95, status: 'Pending' },
    { id: 'ORD-1239', customer: 'Sarah Brown', date: '2023-05-16', items: 2, amount: 99.98, status: 'Processing' },
    { id: 'ORD-1240', customer: 'David Miller', date: '2023-05-15', items: 1, amount: 299.99, status: 'Shipped' },
  ]);

  // Function to update order status
  const handleUpdateStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: status } : order
      )
    );
  };

  // Function to delete an order
  const handleDeleteOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

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
                      order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
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
