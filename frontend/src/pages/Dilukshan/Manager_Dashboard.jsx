import React, { useState } from "react";
import Sidebar from '../../components/Dilukshan/Sidebar';
import AppointmentCard from "./AppointmentCard";
import { sampleAppointments, sampleWorkers } from "../../data/sampleData";

const Manager_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Filter appointments based on the active tab
  const filteredAppointments = sampleAppointments.filter((appointment) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending" && !appointment.worker) return true;
    if (activeTab === "In Progress" && appointment.worker && appointment.worker._id === "worker-1") return true;
    if (activeTab === "Completed" && appointment.worker && appointment.worker._id !== "worker-1") return true;
    return false;
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="h-screen sticky top-0 bg-gray-900">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Manage your car service appointments</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-4 bg-gray-900">
          <div className="flex justify-around items-center border-b border-gray-700 bg-gray-800 rounded-t-lg p-1">
            {["All", "Pending", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeTab === tab ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-600"
                } focus:outline-none`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ({
                  sampleAppointments.filter((a) =>
                    tab === "All" ? true : tab === "Pending" ? !a.worker : tab === "In Progress" ? a.worker && a.worker._id === "worker-1" : a.worker && a.worker._id !== "worker-1"
                  ).length
                })
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="p-6 pt-0 bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                activeTab={activeTab}
                sampleWorkers={sampleWorkers}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager_Dashboard;