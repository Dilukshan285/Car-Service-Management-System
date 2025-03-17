import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AppointmentCard from "../components/AppointmentCard";
import { sampleAppointments, sampleWorkers } from "../data/sampleData";

const Manager_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Filter appointments based on the active tab
  const filteredAppointments = sampleAppointments.filter((appointment) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending" && !appointment.worker) return true;
    if (activeTab === "In Progress" && appointment.worker && appointment.worker._id === "worker-1") return true; // Example condition for In Progress
    if (activeTab === "Completed" && appointment.worker && appointment.worker._id !== "worker-1") return true; // Example condition for Completed
    return false;
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        {/* Header */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Manage your car service appointments</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none text-white"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <select className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white">
                <option>All Appointments</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button className="bg-white text-black rounded-lg py-2 px-4 flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-4">
          <div className="flex justify-around items-center border-b border-gray-700 bg-gray-800 rounded-t-lg p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "All" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
              } hover:bg-gray-600 focus:outline-none`}
              onClick={() => setActiveTab("All")}
            >
              All ({sampleAppointments.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "Pending" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
              } hover:bg-gray-600 focus:outline-none`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending ({sampleAppointments.filter((a) => !a.worker).length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "In Progress" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
              } hover:bg-gray-600 focus:outline-none`}
              onClick={() => setActiveTab("In Progress")}
            >
              In Progress ({sampleAppointments.filter((a) => a.worker && a.worker._id === "worker-1").length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "Completed" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"
              } hover:bg-gray-600 focus:outline-none`}
              onClick={() => setActiveTab("Completed")}
            >
              Completed ({sampleAppointments.filter((a) => a.worker && a.worker._id !== "worker-1").length})
            </button>
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="p-6 pt-0 pb-14">
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