import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Dilukshan/Sidebar';
import AddWorkerModal from "./AddWorkerModal";
import UpdateWorkerModal from "./UpdateWorkerModal";
import Worker_Details from "./Worker_Details";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf"; // Import jsPDF

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

  // Generate PDF Report function
  const generateReport = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243); // Blue color
      doc.text("Revup Workers Report", 20, 20);
      
      // Date
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Workers Summary
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Workers Summary", 20, 50);
      
      // Table Headers
      doc.setFontSize(12);
      const headers = ["Name", "Specialization", "Workload", "Status"];
      const startY = 60;
      let currentY = startY;
      
      // Draw table headers
      doc.setFillColor(33, 150, 243);
      doc.rect(20, currentY, 170, 10, "F");
      doc.setTextColor(255);
      headers.forEach((header, index) => {
        doc.text(header, 22 + (index * 45), currentY + 7);
      });
      
      // Table Content
      currentY += 10;
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      filteredWorkers.forEach((worker, index) => {
        const rowColor = index % 2 === 0 ? 240 : 255;
        doc.setFillColor(rowColor, rowColor, rowColor);
        doc.rect(20, currentY, 170, 10, "F");
        
        doc.text(worker.fullName, 22, currentY + 7);
        doc.text(worker.primarySpecialization || "N/A", 67, currentY + 7);
        doc.text(`${worker.tasks?.length || worker.workload || 0} tasks`, 112, currentY + 7);
        doc.text(worker.status || "Available", 157, currentY + 7);
        
        currentY += 10;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Total Workers: ${filteredWorkers.length}`, 20, currentY + 10);
      
      // Save the PDF
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

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Workers Management</h1>
              <p className="text-gray-300 mt-1">View and manage your service technicians</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-64"
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
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option>All Specializations</option>
                <option>Engine Specialist</option>
                <option>Brake Specialist</option>
                <option>Electrical Systems</option>
                <option>General Mechanic</option>
                <option>Transmission Specialist</option>
              </select>
              <button
                className="bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-blue-700 transition-all duration-200 shadow-md"
                onClick={() => setIsAddModalOpen(true)}
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
              <button
                className="bg-green-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-green-700 transition-all duration-200 shadow-md"
                onClick={generateReport}
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
                    d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m-3-8v4m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Generate Report
              </button>
            </div>
          </div>
          {/* Rest of the JSX remains the same */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === "Grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setViewMode("Grid")}
              >
                Grid
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === "List"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setViewMode("List")}
              >
                List
              </button>
            </div>
            <p className="text-gray-300">Showing {filteredWorkers.length} workers</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-400 bg-gray-800 rounded-lg shadow-md">
              <p>{error}</p>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                onClick={() => fetchWorkers()}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {viewMode === "Grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker, index) => (
                      <div
                        key={getWorkerKey(worker, index)}
                        className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {/* Grid view content remains the same */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-14 w-14 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mr-4 flex items-center justify-center overflow-hidden shadow-md">
                              {worker.profilePicture ? (
                                <img
                                  src={worker.profilePicture}
                                  alt={worker.fullName}
                                  className="h-full w-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-2xl font-semibold text-white">
                                  {worker.fullName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-xl text-white">{worker.fullName}</p>
                              <div className="flex items-center text-gray-300 mt-1">
                                <svg
                                  className="h-5 w-5 mr-2 text-blue-400"
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
                                <span>{worker.primarySpecialization}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            <svg
                              className="h-6 w-6 cursor-pointer hover:text-gray-200 transition-colors duration-200"
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
                          <p className="text-gray-400">Current Workload:</p>
                          <div className="flex justify-between items-center">
                            <div className="w-full bg-gray-700 rounded-full h-2 mt-1 mr-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${((worker.tasks?.length || worker.workload || 0) / 5) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-300">
                              {worker.tasks?.length || worker.workload || 0} tasks
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-all duration-200 shadow-md"
                            onClick={() => handleViewDetails(worker)}
                          >
                            View Details
                          </button>
                          <button
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                            onClick={() => handleEditWorker(worker)}
                          >
                            <svg
                              className="h-5 w-5 text-blue-400 hover:text-blue-300"
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
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                            onClick={() => handleDeleteWorker(worker)}
                          >
                            <svg
                              className="h-5 w-5 text-red-400 hover:text-red-300"
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
                    ))
                  ) : (
                    <div className="col-span-3 text-center p-6 text-gray-400 bg-gray-800 rounded-lg shadow-md">
                      <p>No workers found. Add a new worker to get started.</p>
                      <button
                        className="mt-4 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-all duration-200"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        Add Worker
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  {/* List view content remains the same */}
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 text-gray-200">
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Specialization</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Workload</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkers.length > 0 ? (
                        filteredWorkers.map((worker, index) => (
                          <tr
                            key={getWorkerKey(worker, index)}
                            className="border-t border-gray-700 hover:bg-gray-750 transition-all duration-200"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mr-3 flex items-center justify-center overflow-hidden shadow-md">
                                  {worker.profilePicture ? (
                                    <img
                                      src={worker.profilePicture}
                                      alt={worker.fullName}
                                      className="h-full w-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <span className="text-lg font-semibold text-white">
                                      {worker.fullName?.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-white">{worker.fullName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{worker.primarySpecialization}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  worker.status === "available"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {worker.status || "available"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${((worker.tasks?.length || worker.workload || 0) / 5) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-300">
                                  {worker.tasks?.length || worker.workload || 0} tasks
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                  onClick={() => handleViewDetails(worker)}
                                >
                                  <svg
                                    className="h-5 w-5 text-gray-400 hover:text-gray-200"
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
                                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                  onClick={() => handleEditWorker(worker)}
                                >
                                  <svg
                                    className="h-5 w-5 text-blue-400 hover:text-blue-300"
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
                                  className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                  onClick={() => handleDeleteWorker(worker)}
                                >
                                  <svg
                                    className="h-5 w-5 text-red-400 hover:text-red-300"
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-gray-400">
                            <p>No workers found. Add a new worker to get started.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default Workers;