import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Users, Settings, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-8">Auto Parts Admin</h2>
      <ul>
        <li className="mb-4">
          <Link to="/Product" className="flex items-center text-lg text-gray-300 hover:text-white">
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/Product" className="flex items-center text-lg text-gray-300 hover:text-white">
            <Package className="w-5 h-5 mr-2" />
            Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="flex items-center text-lg text-gray-300 hover:text-white">
            <Users className="w-5 h-5 mr-2" />
            Users
          </Link>
        </li>
        <li>
          <Link to="/settings" className="flex items-center text-lg text-gray-300 hover:text-white">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;