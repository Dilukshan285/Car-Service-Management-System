import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Dilukshan/Sidebar';
import AddWorkerModal from "./AddWorkerModal";
import UpdateWorkerModal from "./UpdateWorkerModal";
import Worker_Details from "./Worker_Details";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import { ClipLoader } from "react-spinners";

const Workers = () => {
  const [viewMode, setViewMode] = useState("Grid");
  const [workers, setWorkers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All Specializations");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/workers/");
        if (!response.ok) {
          throw new Error(`Failed to fetch workers: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data && typeof data === "object" && Array.isArray(data.data)) {
          setWorkers(data.data);
        } else {
          setWorkers([]);
          throw new Error("API response does not contain a valid 'data' array");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setError(err.message);
        setWorkers([]);
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const generateReport = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setTextColor(31, 41, 55);
      doc.text("Revup Workers Report", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      doc.setFontSize(12);
      const headers = ["Name", "Specialization", "Workload", "Status"];
      let currentY = 50;
      
      doc.setFillColor(31, 41, 55);
      doc.rect(20, currentY, 170, 8, "F");
      doc.setTextColor(255);
      headers.forEach((header, index) => {
        doc.text(header, 22 + (index * 45), currentY + 6);
      });
      
      currentY += 8;
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      filteredWorkers.forEach((worker, index) => {
        const rowColor = index % 2 === 0 ? 243 : 255;
        doc.setFillColor(rowColor, rowColor, rowColor);
        doc.rect(20, currentY, 170, 8, "F");
        
        doc.text(worker.fullName, 22, currentY + 6);
        doc.text(worker.primarySpecialization || "N/A", 67, currentY + 6);
        doc.text(`${worker.tasks?.length || worker.workload || 0} tasks`, 112, currentY + 6);
        doc.text(worker.status || "Available", 157, currentY + 6);
        
        currentY += 8;
      });
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text(`Total Workers: ${filteredWorkers.length}`, 20, currentY + 10);
      
      doc.save(`Revup_Workers_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const handleAddWorker = (newWorker) => {
    try {
      setWorkers((prevWorkers) => [...prevWorkers, newWorker]);
      toast.success("Worker added successfully");
    } catch (err) {
      console.error("Error adding worker to state:", err);
      toast.error("Failed to add worker to the list.");
    }
  };

  const handleUpdateWorker = async (updatedWorker) => {
    try {
      setWorkers(workers.map((worker) => (worker._id === updatedWorker._id ? updatedWorker : worker)));
      toast.success("Worker updated successfully");
    } catch (err) {
      console.error("Error updating worker in state:", err);
      toast.error("Failed to update worker in the list.");
    }
  };

  const handleDeleteWorker = (worker) => {
    setWorkerToDelete(worker);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteWorker = async () => {
    if (!workerToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/workers/delete/${workerToDelete._id}`);
      setWorkers(workers.filter((worker) => worker._id !== workerToDelete._id));
      toast.success("Worker deleted successfully");
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setWorkerToDelete(null);
      }, 500);
    } catch (err) {
      console.error("Error deleting worker:", err);
      toast.error("Failed to delete worker. Please try again.");
      setIsDeleteModalOpen(false);
      setWorkerToDelete(null);
    }
  };

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
    setIsDetailsModalOpen(true);
  };

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setIsUpdateModalOpen(true);
  };

  const getWorkerKey = (worker, index) => {
    return worker._id || worker.id || `worker-${index}`;
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      specializationFilter === "All Specializations" ||
      worker.primarySpecialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <ClipLoader size={40} color="#2563eb" speedMultiplier={0.8} />
          <p className="text-base text-gray-600 mt-4">Loading workers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-base text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
        `}
      </style>
      <div className="h-screen sticky top-0 bg-white shadow-sm">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                Workers Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">View and manage your service technicians</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-md py-2 px-4 pl-10 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-64"
                />
                <svg
                  className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 transform -translate-y-1/2"
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
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md py-2 px-4 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>All Specializations</option>
                <option>Engine Specialist</option>
                <option>Brake Specialist</option>
                <option>Electrical Systems</option>
                <option>General Mechanic</option>
                <option>Transmission Specialist</option>
              </select>
              <button
                className="bg-blue-600 text-white rounded-md py-2 px-4 text-sm flex items-center hover:bg-blue-700 transition-all duration-200"
                onClick={() => setIsAddModalOpen(true)}
              >
                <svg
                  className="h-5 w-5 mr-2 text-white"
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
              <button
                className="bg-green-600 text-white rounded-md py-2 px-4 text-sm flex items-center hover:bg-green-700 transition-all duration-200"
                onClick={generateReport}
              >
                <svg
                  className="h-5 w-5 mr-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m-3-8v4m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Generate Report
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === "Grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } focus:outline-none`}
                onClick={() => setViewMode("Grid")}
              >
                Grid
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === "List"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } focus:outline-none`}
                onClick={() => setViewMode("List")}
              >
                List
              </button>
            </div>
            <p className="text-sm text-gray-500">Showing {filteredWorkers.length} workers</p>
          </div>
        </div>
        <div className="p-4">
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No workers found. Add a new worker to get started.</p>
              <button
                className="mt-4 bg-blue-600 text-white rounded-md py-2 px-4 text-sm hover:bg-blue-700 transition-all duration-200"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Worker
              </button>
            </div>
          ) : viewMode === "Grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker, index) => (
                <div
                  key={getWorkerKey(worker, index)}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-gray-200 rounded-full mr-4 flex items-center justify-center overflow-hidden shadow-sm">
                        {worker.profilePicture ? (
                          <img
                            src={worker.profilePicture}
                            alt={worker.fullName}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-gray-600">
                            {worker.fullName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-gray-800">{worker.fullName}</p>
                        <div className="flex items-center text-gray-600 mt-1">
                          <svg
                            className="h-5 w-5 mr-2 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm">{worker.primarySpecialization}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <svg
                        className="h-6 w-6 cursor-pointer hover:text-gray-700 transition-colors duration-200"
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
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Current Workload:</p>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((worker.tasks?.length || worker.workload || 0) / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {worker.tasks?.length || worker.workload || 0} tasks
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-600 text-white rounded-md py-2 px-4 text-sm hover:bg-blue-700 transition-all duration-200"
                      onClick={() => handleViewDetails(worker)}
                    >
                      View Details
                    </button>
                    <button
                      className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200"
                      onClick={() => handleEditWorker(worker)}
                    >
                      <svg
                        className="h-5 w-5 text-blue-500 hover:text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200"
                      onClick={() => handleDeleteWorker(worker)}
                    >
                      <svg
                        className="h-5 w-5 text-red-500 hover:text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Specialization</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Workload</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((worker, index) => (
                    <tr
                      key={getWorkerKey(worker, index)}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden shadow-sm">
                            {worker.profilePicture ? (
                              <img
                                src={worker.profilePicture}
                                alt={worker.fullName}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-gray-600">
                                {worker.fullName?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-800">{worker.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{worker.primarySpecialization}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            worker.status === "available"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {worker.status || "available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${((worker.tasks?.length || worker.workload || 0) / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {worker.tasks?.length || worker.workload || 0} tasks
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200"
                            onClick={() => handleViewDetails(worker)}
                          >
                            <svg
                              className="h-5 w-5 text-gray-500 hover:text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <svg
                              className="h-5 w-5 text-blue-500 hover:text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-all duration-200"
                            onClick={() => handleDeleteWorker(worker)}
                          >
                            <svg
                              className="h-5 w-5 text-red-500 hover:text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <AddWorkerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddWorker={handleAddWorker}
        />
        <UpdateWorkerModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          worker={selectedWorker}
          onUpdateWorker={handleUpdateWorker}
        />
        {isDetailsModalOpen && selectedWorker && (
          <Worker_Details
            worker={selectedWorker}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setWorkerToDelete(null);
          }}
          onConfirm={confirmDeleteWorker}
          workerName={workerToDelete?.fullName || ""}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Workers;