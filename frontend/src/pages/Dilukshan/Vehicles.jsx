import React from "react";
import Sidebar from "../../components/Sidebar";

const Vehicles = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-white">Vehicles</h1>
        <p className="text-gray-400">Manage vehicles here.</p>
      </div>
    </div>
  );
};

export default Vehicles;