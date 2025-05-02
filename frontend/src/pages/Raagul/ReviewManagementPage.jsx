import React, { useState } from 'react';

const ReviewManagementPage = () => {
  // Sample review data
  const [reviews, setReviews] = useState([
    {
      productId: 'PROD-1234',
      productName: 'Wireless Headphones',
      rating: 5,
      user: 'John Doe',
      comment: 'Excellent sound quality and very comfortable to wear.',
      date: '2023-05-15',
    },
    {
      productId: 'PROD-1234',
      productName: 'Wireless Headphones',
      rating: 3,
      user: 'Jane Smith',
      comment: 'Good sound but the ear cushions could be more comfortable.',
      date: '2023-05-16',
    },
    {
      productId: 'PROD-5678',
      productName: 'Smart Watch',
      rating: 4,
      user: 'Robert Johnson',
      comment: 'Great features and battery life. The screen is a bit small.',
      date: '2023-05-14',
    },
    {
      productId: 'PROD-5678',
      productName: 'Smart Watch',
      rating: 2,
      user: 'Emily Davis',
      comment: 'The watch looks nice but the battery drains quickly.',
      date: '2023-05-12',
    },
    {
      productId: 'PROD-9012',
      productName: 'Bluetooth Speaker',
      rating: 5,
      user: 'Michael Wilson',
      comment: 'Amazing sound quality for such a compact speaker.',
      date: '2023-05-17',
    },
    {
      productId: 'PROD-3456',
      productName: 'Laptop Backpack',
      rating: 4,
      user: 'Sarah Brown',
      comment: 'Spacious and comfortable to carry. Lots of compartments.',
      date: '2023-05-16',
    },
    {
      productId: 'PROD-7890',
      productName: 'Coffee Maker',
      rating: 2,
      user: 'David Miller',
      comment: 'Broke after just two weeks of use. Very disappointed.',
      date: '2023-05-15',
    },
  ]);

  const [searchProductId, setSearchProductId] = useState('');

  // Function to delete review
  const handleDeleteReview = (productId) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.productId !== productId));
  };

  // Filter reviews by product ID
  const filteredReviews = reviews.filter((review) =>
    review.productId.toLowerCase().includes(searchProductId.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-semibold mb-6">Review Management</h1>
      <p className="mb-6 text-lg">View and manage product reviews</p>

      {/* Search by Product ID */}
      <div className="mb-6">
        <input
          type="text"
          value={searchProductId}
          onChange={(e) => setSearchProductId(e.target.value)}
          placeholder="Search by Product ID..."
          className="px-4 py-2 w-80 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Review Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm text-gray-600">Product ID</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Product Name</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Rating</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">User</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Comment</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.productId} className="border-b border-gray-200">
                <td className="px-4 py-2 text-sm">{review.productId}</td>
                <td className="px-4 py-2 text-sm">{review.productName}</td>
                <td className="px-4 py-2 text-sm">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 text-sm">{review.user}</td>
                <td className="px-4 py-2 text-sm">{review.comment}</td>
                <td className="px-4 py-2 text-sm">{review.date}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleDeleteReview(review.productId)}
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

export default ReviewManagementPage;
