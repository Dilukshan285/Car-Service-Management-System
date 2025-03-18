import React, { useState } from 'react';

const MyOrdersPage = () => {
  const [orders] = useState([
    {
      id: 'ORD-2024-1001',
      date: 'March 15, 2024',
      items: 3,
      amount: 232.97,
      status: 'Delivered',
    },
    {
      id: 'ORD-2024-0892',
      date: 'March 2, 2024',
      items: 1,
      amount: 599.99,
      status: 'Shipped',
    },
    {
      id: 'ORD-2024-0765',
      date: 'February 18, 2024',
      items: 2,
      amount: 162.98,
      status: 'Processing',
    },
    {
      id: 'ORD-2024-0654',
      date: 'February 5, 2024',
      items: 4,
      amount: 445.96,
      status: 'Delivered',
    },
    {
      id: 'ORD-2024-0543',
      date: 'January 20, 2024',
      items: 2,
      amount: 219.98,
      status: 'Delivered',
    },
  ]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">My Orders</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Continue Shopping</button>
      </div>

      {/* Order Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Filters</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by order ID..."
            className="px-4 py-2 w-80 border border-gray-300 rounded-lg"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Statuses</option>
            <option>Delivered</option>
            <option>Shipped</option>
            <option>Processing</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
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
          <span className="text-sm text-gray-500">5 orders</span>
        </div>
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200">
                <td className="px-4 py-2 text-sm">{order.id}</td>
                <td className="px-4 py-2 text-sm">{order.date}</td>
                <td className="px-4 py-2 text-sm">{order.items}</td>
                <td className="px-4 py-2 text-sm">${order.amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <button className="text-blue-600 hover:text-blue-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
