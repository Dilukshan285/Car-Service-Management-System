import React, { useState } from "react";
import Sidebar from '../../components/Dilukshan/Sidebar';
import AddWorkerModal from "./AddWorkerModal";
import { sampleWorkers } from "../../data/sampleData";

const Workers = () => {
  const [viewMode, setViewMode] = useState("Grid");
  const [workers, setWorkers] = useState(sampleWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddWorker = (data) => {
    const id = Date.now().toString();
    setWorkers([...workers, { ...data, _id: id }]);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-900 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Workers Management</h1>
            <p className="text-gray-400">View and manage your service technicians</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search workers"
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:ring-2 focus:ring-orange-500"
              />
              <svg
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
                />
              </svg>
            </div>
            <select className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-orange-500">
              <option>All Specializations</option>
              <option>Engine Specialist</option>
              <option>Brake Specialist</option>
              <option>Electrical Systems</option>
              <option>General Mechanic</option>
              <option>Transmission Specialist</option>
            </select>
            <button
              className="bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-orange-700 transition"
              onClick={() => setIsModalOpen(true)}
            >
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
                />
              </svg>
              Add Worker
            </button>
          </div>
        </div>
        <div className="px-6 pb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "Grid" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
              } text-white`}
              onClick={() => setViewMode("Grid")}
            >
              Grid
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "List" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
              } text-white`}
              onClick={() => setViewMode("List")}
            >
              List
            </button>
          </div>
          <p className="text-gray-400">Showing {workers.length} workers</p>
        </div>
        <div className="p-6 pt-0 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div key={worker._id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-600 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-lg">{worker.name}</p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 text-sm">Availability:</p>
                <div className="flex items-center mt-1">
                  <div
                    className={`h-4 w-4 rounded-full mr-2 ${worker.status === "available" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <p className="text-sm">{worker.status === "available" ? "Available" : "Busy"}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 text-sm">Current Workload:</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(worker.workload / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button className="mt-4 w-full bg-gray-700 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
        <AddWorkerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddWorker={handleAddWorker}
        />
      </div>
    </div>
  );
};

export default Workers;
