import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 h-screen p-6 text-white">
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
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <span>Appointments</span>
        </NavLink>
        <NavLink
          to="/workers"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <span>Workers</span>
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <span>Customers</span>
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
            ></path>
          </svg>
          <span>Services</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg ${
              isActive ? "bg-gray-700 text-white" : "text-gray-400"
            }`
          }
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <span>Analytics</span>
        </NavLink>
      </nav>

      {/* User Section */}
      <div className="absolute pt-52 left-6 flex items-center space-x-2">
        <div className="h-10 w-10 bg-gray-600 rounded-full"></div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-gray-400 text-sm">Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;