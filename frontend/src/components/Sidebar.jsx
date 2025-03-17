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
          to="/vehicles"
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m-10 4H4a2 2 0 01-2-2V7a2 2 0 012-2h2m0 0V3a2 2 0 012-2h8a2 2 0 012 2v2m-2 14h2a2 2 0 002-2V9a2 2 0 00-2-2h-2"
            ></path>
          </svg>
          <span>Vehicles</span>
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

      {/* System Section */}
      <div className="mt-8">
        <h3 className="text-gray-500 uppercase text-sm">System</h3>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg mt-2 ${
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
            ></path>
          </svg>
          <span>Settings</span>
        </NavLink>
      </div>

      {/* User Section */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-2">
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