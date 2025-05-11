import React from "react";
import Sidebar from "../../components/Dilukshan/Sidebar"; // Verify this path
import ServiceType from "../venushan/servicetype"; // Verify this path

const Services = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        {Sidebar ? (
          <Sidebar />
        ) : (
          <div className="w-64 bg-red-500 text-white p-6">
            Error: Sidebar component failed to load
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <ServiceType />
        </div>
      </div>
    </div>
  );
};

export default Services;