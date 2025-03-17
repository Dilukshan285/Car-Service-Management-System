import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AddWorkerModal from "./AddWorkerModal";
import { sampleWorkers } from "../../data/sampleData";

const Workers = () => {
  const [viewMode, setViewMode] = useState("Grid");
  const [workers, setWorkers] = useState(sampleWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    primarySpecialization: "",
    skills: [],
    certifications: [],
    hireDate: "",
    weeklyAvailability: [],
    hourlyRate: "",
    additionalNotes: "",
    status: "busy",
    workload: 0,
    rating: 4.5,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        primarySpecialization: "",
        skills: [],
        certifications: [],
        hireDate: "",
        weeklyAvailability: [],
        hourlyRate: "",
        additionalNotes: "",
        status: "busy",
        workload: 0,
        rating: 4.5,
      });
    }
  };

  const handleSubmit = (newWorker) => {
    // Generate a unique ID (simplified for demo)
    const id = Date.now().toString();
    setWorkers([...workers, { ...newWorker, _id: id }]);
  };

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
              <h1 className="text-2xl font-bold">Workers Management</h1>
              <p className="text-gray-400">View and manage your service technicians</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search workers"
                  className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white"
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
              <select className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white">
                <option>All Specializations</option>
                <option>Engine Specialist</option>
                <option>Brake Specialist</option>
                <option>Electrical Systems</option>
                <option>General Mechanic</option>
                <option>Transmission Specialist</option>
              </select>
              <button
                className="bg-orange-500 text-white rounded-lg py-2 px-4 flex items-center"
                onClick={toggleModal}
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
        </div>

        {/* View Toggle and Showing Info */}
        <div className="px-6 pb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                viewMode === "Grid" ? "bg-gray-700" : "bg-gray-800"
              } text-white hover:bg-gray-600`}
              onClick={() => setViewMode("Grid")}
            >
              Grid
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                viewMode === "List" ? "bg-gray-700" : "bg-gray-800"
              } text-white hover:bg-gray-600`}
              onClick={() => setViewMode("List")}
            >
              List
            </button>
          </div>
          <p className="text-gray-400">Showing {workers.length} workers</p>
        </div>

        {/* Worker Cards (Grid View) */}
        <div className="p-6 pt-0 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div key={worker._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-600 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">{worker.fullName}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-200">
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
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Availability:</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`h-4 w-4 rounded-full mr-2 ${
                        worker.status === "available" ? "bg-green-500" : "bg-pink-500"
                      }`}
                    ></div>
                    <p className="text-sm">
                      {worker.status === "available" ? "Available" : "Busy"}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Current Workload:</p>
                  <p className="text-sm">{worker.workload} tasks</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(worker.workload / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <p className="text-gray-400 text-sm">Rating:</p>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(worker.rating || 4.5) ? "text-yellow-400" : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <button className="mt-4 w-full bg-gray-700 text-white rounded-lg py-2 px-4 hover:bg-gray-600">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Worker Modal */}
        <AddWorkerModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Workers;