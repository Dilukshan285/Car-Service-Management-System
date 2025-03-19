import React from "react";
import Sidebar from '../../components/Dilukshan/Sidebar';

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage settings here.</p>
      </div>
    </div>
  );
};

export default Settings;