import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Dilukshan/Sidebar";
import { ClipLoader } from "react-spinners";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Manager_Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch workers
        const workersResponse = await fetch("http://localhost:5000/api/workers/");
        if (!workersResponse.ok) {
          throw new Error(`Failed to fetch workers: ${workersResponse.status} ${workersResponse.statusText}`);
        }
        const workersData = await workersResponse.json();
        console.log("Workers response (full):", workersData); // Debug log
        setWorkers(workersData.data || []);

        // Fetch appointments
        const appointmentsResponse = await fetch("http://localhost:5000/api/appointments/");
        if (!appointmentsResponse.ok) {
          throw new Error(`Failed to fetch appointments: ${appointmentsResponse.status} ${appointmentsResponse.statusText}`);
        }
        const appointmentsData = await appointmentsResponse.json();
        console.log("Appointments response (full):", appointmentsData); // Debug log
        setAppointments(appointmentsData.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate key metrics
  const totalWorkers = workers.length;
  const availableWorkers = workers.filter((worker) => (worker.status || "unavailable") === "available").length;
  const busyWorkers = totalWorkers - availableWorkers;
  const averageWorkload =
    totalWorkers > 0
      ? (workers.reduce((sum, worker) => sum + (worker.workload || 0), 0) / totalWorkers).toFixed(1)
      : 0;

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((appt) => (appt.status || "Pending") === "Pending").length;
  const inProgressAppointments = appointments.filter((appt) => (appt.status || "Pending") === "In Progress").length;
  const completedAppointments = appointments.filter((appt) => (appt.status || "Pending") === "Completed").length;

  // Prepare data for workload distribution chart
  const workloadData = {
    labels: workers.map((worker) => worker.fullName || "Unknown Worker"),
    datasets: [
      {
        label: "Workload (Tasks)",
        data: workers.map((worker) => worker.workload || 0),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const workloadOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "sans-serif",
          },
          color: "#4B5563",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 },
          color: "#4B5563",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: "#4B5563",
          stepSize: 1,
        },
        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  // Get recent appointments (last 5)
  const recentAppointments = appointments
    .sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return !isNaN(dateB.getTime()) && !isNaN(dateA.getTime()) ? dateB - dateA : 0;
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <ClipLoader size={40} color="#2563eb" speedMultiplier={0.8} />
          <p className="text-base text-gray-600 mt-4">Loading dashboard...</p>
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
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <h1
            className="text-3xl font-semibold text-gray-800"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Manager Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your workforce and appointments
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Workers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Workers</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{totalWorkers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-blue-600"
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
              </div>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{totalAppointments}</p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs text-gray-600">Pending: {pendingAppointments}</span>
                  <span className="text-xs text-gray-600">In Progress: {inProgressAppointments}</span>
                  <span className="text-xs text-gray-600">Completed: {completedAppointments}</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Worker Availability */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Worker Availability</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {availableWorkers} / {totalWorkers}
                </p>
                <div className="flex space-x-2 mt-2">
                  <span className="text-xs text-green-600">Available: {availableWorkers}</span>
                  <span className="text-xs text-red-600">Busy: {busyWorkers}</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Workload */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Workload</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{averageWorkload} tasks</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Distribution Chart and Recent Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Workload Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Workload Distribution
            </h2>
            <div className="h-64">
              {workers.length > 0 ? (
                <Bar data={workloadData} options={workloadOptions} />
              ) : (
                <p className="text-gray-500 text-sm text-center">
                  No workers available to display workload.
                </p>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Appointments
            </h2>
            {recentAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="px-4 py-3 text-left font-medium">Car Number Plate</th>
                      <th className="px-4 py-3 text-left font-medium">Service Type</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Worker</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appt) => (
                      <tr
                        key={appt._id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-4 py-3 text-gray-800">{appt.carNumberPlate || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-600">{appt.serviceType?.name || appt.serviceType || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {appt.appointmentDate && !isNaN(new Date(appt.appointmentDate).getTime())
                            ? new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              (appt.status || "Pending") === "Pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : (appt.status || "Pending") === "In Progress"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : (appt.status || "Pending") === "Completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {appt.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {appt.worker?.fullName || "Unassigned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No recent appointments available.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <button
              className="bg-blue-600 text-white rounded-md py-2 px-4 text-sm flex items-center hover:bg-blue-700 transition-all duration-200"
              onClick={() => navigate("/workers")}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Workers
            </button>
            <button
              className="bg-green-600 text-white rounded-md py-2 px-4 text-sm flex items-center hover:bg-green-700 transition-all duration-200"
              onClick={() => navigate("/appointments")}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Manage Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager_Dashboard;