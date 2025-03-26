import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Dilukshan/Sidebar";
import AppointmentCard from "./AppointmentCard";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify

const Manager_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch appointments and workers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        await fetchAppointments();

        // Fetch workers
        const workerResponse = await fetch("http://localhost:5000/api/workers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!workerResponse.ok) {
          throw new Error("Failed to fetch workers");
        }

        const workerData = await workerResponse.json();
        setWorkers(workerData.data || []);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending" && appointment.status === "Pending") return true;
    if (activeTab === "In Progress" && appointment.status === "In Progress") return true;
    if (activeTab === "Completed" && appointment.status === "Completed") return true;
    return false;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

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
                {tab} (
                {tab === "All"
                  ? appointments.length
                  : appointments.filter((a) => a.status === tab).length}
                )
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
                workers={workers}
                onWorkerAssigned={fetchAppointments}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add ToastContainer to render toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Manager_Dashboard;