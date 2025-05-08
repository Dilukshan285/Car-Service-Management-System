import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Dilukshan/Sidebar";
import { Chart as ChartJS, LineElement, BarElement, ArcElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register Chart.js components
ChartJS.register(LineElement, BarElement, ArcElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [workers, setWorkers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [selectedWorker, setSelectedWorker] = useState("all");
  const [selectedServiceType, setSelectedServiceType] = useState("all");

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
        console.error("Error fetching analytics data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique service types
  const serviceTypes = [...new Set(appointments.map((appt) => appt.serviceType?.name || appt.serviceType || "Unknown"))];

  // Filter appointments based on date range and selections
  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.appointmentDate);
    const matchesDate =
      (!startDate || (apptDate && !isNaN(apptDate.getTime()) && apptDate >= startDate)) &&
      (!endDate || (apptDate && !isNaN(apptDate.getTime()) && apptDate <= endDate));
    const matchesWorker = selectedWorker === "all" || (appt.worker && appt.worker._id === selectedWorker);
    const matchesServiceType =
      selectedServiceType === "all" || (appt.serviceType?.name || appt.serviceType || "Unknown") === selectedServiceType;
    return matchesDate && matchesWorker && matchesServiceType;
  });

  // Calculate key metrics
  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter((appt) => (appt.status || "Pending") === "Completed").length;
  const completionRate = totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0;
  const avgCompletionTime =
    completedAppointments > 0
      ? (
          filteredAppointments
            .filter((appt) => (appt.status || "Pending") === "Completed")
            .reduce((sum, appt) => {
              const createdAt = new Date(appt.createdAt);
              const updatedAt = new Date(appt.updatedAt);
              return !isNaN(createdAt.getTime()) && !isNaN(updatedAt.getTime())
                ? sum + (updatedAt - createdAt) / (1000 * 60 * 60) // Convert to hours
                : sum;
            }, 0) / completedAppointments
        ).toFixed(1)
      : 0;

  // Simulate revenue (adjust if your backend provides pricing data)
  const totalRevenue = completedAppointments * 100; // Assume $100 per completed appointment

  // Appointment trend over time
  const daysInRange = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 30;
  const trendLabels = Array.from({ length: daysInRange }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const trendData = trendLabels.map((label) => {
    const date = new Date(label);
    return filteredAppointments.filter((appt) => {
      const apptDate = new Date(appt.appointmentDate);
      return apptDate && !isNaN(apptDate.getTime()) && apptDate.toLocaleDateString() === date.toLocaleDateString();
    }).length;
  });

  const appointmentTrendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Appointments",
        data: trendData,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, family: "Inter, sans-serif" },
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
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: "#4B5563",
          stepSize: 1,
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  // Worker performance
  const workerPerformanceData = {
    labels: workers.map((worker) => worker.fullName || "Unknown Worker"),
    datasets: [
      {
        label: "Completed Appointments",
        data: workers.map((worker) =>
          filteredAppointments.filter(
            (appt) => (appt.status || "Pending") === "Completed" && appt.worker && appt.worker._id === worker._id
          ).length
        ),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const workerPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, family: "Inter, sans-serif" },
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
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: "#4B5563",
          stepSize: 1,
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  // Appointment status distribution
  const statusData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Appointment Status",
        data: [
          filteredAppointments.filter((appt) => (appt.status || "Pending") === "Pending").length,
          filteredAppointments.filter((appt) => (appt.status || "Pending") === "In Progress").length,
          filteredAppointments.filter((appt) => (appt.status || "Pending") === "Completed").length,
        ],
        backgroundColor: [
          "rgba(234, 179, 8, 0.6)", // Yellow for Pending
          "rgba(59, 130, 246, 0.6)", // Blue for In Progress
          "rgba(34, 197, 94, 0.6)", // Green for Completed
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12, family: "Inter, sans-serif" },
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
  };

  // Service type breakdown over time
  const serviceTypeData = {
    labels: trendLabels,
    datasets: serviceTypes.map((type, index) => ({
      label: type,
      data: trendLabels.map((label) => {
        const date = new Date(label);
        return filteredAppointments.filter((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          return (
            apptDate &&
            !isNaN(apptDate.getTime()) &&
            apptDate.toLocaleDateString() === date.toLocaleDateString() &&
            (appt.serviceType?.name || appt.serviceType || "Unknown") === type
          );
        }).length;
      }),
      backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
      borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
      borderWidth: 1,
    })),
  };

  const serviceTypeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, family: "Inter, sans-serif" },
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
        stacked: true,
        ticks: {
          font: { size: 10 },
          color: "#4B5563",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: "#4B5563",
          stepSize: 1,
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  // Export analytics as PDF
  const exportAnalytics = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(31, 41, 55);
      doc.text("Analytics Report", 20, 20);

      // Subheader
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(
        `Date Range: ${startDate ? startDate.toLocaleDateString() : "N/A"} - ${
          endDate ? endDate.toLocaleDateString() : "N/A"
        }`,
        20,
        38
      );

      // Key Metrics
      doc.setFontSize(12);
      doc.setTextColor(0);
      let currentY = 50;
      doc.text("Key Metrics", 20, currentY);
      currentY += 8;
      doc.setFontSize(10);
      doc.text(`Total Appointments: ${totalAppointments}`, 20, currentY);
      currentY += 6;
      doc.text(`Completion Rate: ${completionRate}%`, 20, currentY);
      currentY += 6;
      doc.text(`Average Completion Time: ${avgCompletionTime} hours`, 20, currentY);
      currentY += 6;
      doc.text(`Total Revenue: $${totalRevenue}`, 20, currentY);
      currentY += 10;

      // Appointment Status
      doc.setFontSize(12);
      doc.text("Appointment Status Distribution", 20, currentY);
      currentY += 8;
      doc.setFontSize(10);
      doc.text(`Pending: ${filteredAppointments.filter((appt) => (appt.status || "Pending") === "Pending").length}`, 20, currentY);
      currentY += 6;
      doc.text(`In Progress: ${filteredAppointments.filter((appt) => (appt.status || "Pending") === "In Progress").length}`, 20, currentY);
      currentY += 6;
      doc.text(`Completed: ${completedAppointments}`, 20, currentY);
      currentY += 10;

      // Worker Performance
      doc.setFontSize(12);
      doc.text("Worker Performance", 20, currentY);
      currentY += 8;
      doc.setFontSize(10);
      workers.forEach((worker) => {
        const completed = filteredAppointments.filter(
          (appt) => (appt.status || "Pending") === "Completed" && appt.worker && appt.worker._id === worker._id
        ).length;
        doc.text(`${worker.fullName || "Unknown Worker"}: ${completed} completed appointments`, 20, currentY);
        currentY += 6;
      });

      doc.save(`Analytics_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Analytics report exported successfully");
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast.error("Failed to export analytics report");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-base text-gray-600 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p className="text-base text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap');
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="h-screen sticky top-0 bg-white shadow-sm">
        <Sidebar />
      </div>
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 mb-8 shadow-lg animate-slide-in">
          <div className="flex justify-between items-center">
            <div>
              <h1
                className="text-3xl font-semibold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Analytics Dashboard
              </h1>
              <p className="text-sm mt-1 opacity-90">
                In-depth insights into your operations
              </p>
            </div>
            <button
              className="bg-white text-blue-600 rounded-md py-2 px-4 text-sm flex items-center hover:bg-gray-100 transition-all duration-200"
              onClick={exportAnalytics}
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
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-slide-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Date Range
              </label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                dateFormat="MMM d, yyyy"
                className="bg-gray-50 border border-gray-200 rounded-md py-2 px-4 text-sm text-gray-700 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholderText="Select date range"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Worker
              </label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md py-2 px-4 text-sm text-gray-700 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Workers</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.fullName || "Unknown Worker"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Service Type
              </label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md py-2 px-4 text-sm text-gray-700 w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Service Types</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Total Appointments
                </p>
                <p className="text-2xl font-semibold text-gray-800 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {totalAppointments}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Completion Rate
                </p>
                <p className="text-2xl font-semibold text-gray-800 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {completionRate}%
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Avg. Completion Time
                </p>
                <p className="text-2xl font-semibold text-gray-800 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {avgCompletionTime} hrs
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-800 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  ${totalRevenue}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Appointment Trend Over Time
            </h2>
            <div className="h-80">
              {totalAppointments > 0 ? (
                <Line data={appointmentTrendData} options={trendOptions} />
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  No appointments available for the selected period.
                </p>
              )}
            </div>
          </div>

          {/* Worker Performance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Worker Performance
            </h2>
            <div className="h-80">
              {workers.length > 0 ? (
                <Bar data={workerPerformanceData} options={workerPerformanceOptions} />
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  No workers available to display performance.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Appointment Status Distribution
            </h2>
            <div className="h-64">
              {totalAppointments > 0 ? (
                <Pie data={statusData} options={statusOptions} />
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  No appointments available for the selected period.
                </p>
              )}
            </div>
          </div>

          {/* Service Type Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Service Type Breakdown Over Time
            </h2>
            <div className="h-64">
              {totalAppointments > 0 ? (
                <Bar data={serviceTypeData} options={serviceTypeOptions} />
              ) : (
                <p className="text-gray-600 text-sm text-center">
                  No appointments available for the selected period.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
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
  );
};

export default Analytics;