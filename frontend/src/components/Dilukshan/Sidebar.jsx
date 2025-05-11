import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Calendar, Users, Clock, List, BarChart2, Package } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col min-h-screen p-6">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <svg
          className="h-8 w-8 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span className="text-xl font-bold">Revup</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <NavLink
          to="/manager_dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <Calendar className="h-5 w-5" />
          <span>Appointments</span>
        </NavLink>
        <NavLink
          to="/workers"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <Users className="h-5 w-5" />
          <span>Workers</span>
        </NavLink>
        <NavLink
          to="/service"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <Clock className="h-5 w-5" />
          <span>Services</span>
        </NavLink>
        <NavLink
          to="/get"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <List className="h-5 w-5" />
          <span>All Services</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <BarChart2 className="h-5 w-5" />
          <span>Analytics</span>
        </NavLink>
         <NavLink
          to="/Product"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"
            }`
          }
        >
          <Package className="h-5 w-5" />
          <span>Products</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;