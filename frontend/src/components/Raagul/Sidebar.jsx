import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-8">Auto Parts Admin</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="text-lg">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/products" className="text-lg text-gray-300">Products</Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="text-lg">Users</Link>
        </li>
        <li>
          <Link to="/settings" className="text-lg">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
