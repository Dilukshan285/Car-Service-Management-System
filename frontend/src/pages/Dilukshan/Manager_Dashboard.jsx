import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Dilukshan/Sidebar";
import AppointmentCard from "./AppointmentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";

const Manager_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAppointments();
        const workerResponse = await fetch("http://localhost:5000/api/workers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!workerResponse.ok) {
          const errorText = await workerResponse.text();
          throw new Error(`Failed to fetch workers: ${workerResponse.status} ${workerResponse.statusText} - ${errorText}`);
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

    const interval = setInterval(() => {
      fetchAppointments();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateReport = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(33, 150, 243);
      doc.text("Revup Appointments Report", 20, 20);
      
      // Date and Filter Info
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Status Filter: ${activeTab}`, 20, 40);
      
      // Table Headers
      doc.setFontSize(12);
      const headers = ["Number Plate", "Owner", "Service", "Date", "Status"];
      let currentY = 60;
      
      // Draw table headers
      doc.setFillColor(33, 150, 243);
      doc.rect(20, currentY, 170, 10, "F");
      doc.setTextColor(255);
      headers.forEach((header, index) => {
        doc.text(header, 22 + (index * 35), currentY + 7);
      });
      
      // Table Content
      currentY += 10;
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      filteredAppointments.forEach((appointment, index) => {
        const rowColor = index % 2 === 0 ? 240 : 255;
        doc.setFillColor(rowColor, rowColor, rowColor);
        doc.rect(20, currentY, 170, 10, "F");
        
        doc.text(appointment.carNumberPlate || "N/A", 22, currentY + 7);
        doc.text(appointment.user || "N/A", 57, currentY + 7);
        doc.text(appointment.serviceType || "N/A", 92, currentY + 7);
        doc.text(new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }), 127, currentY + 7);
        doc.text(appointment.status || "N/A", 162, currentY + 7);
        
        currentY += 10;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Total Appointments: ${filteredAppointments.length}`, 20, currentY + 10);
      
      doc.save(`Revup_Appointments_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab = activeTab === "All" || appointment.status === activeTab;
    const matchesSearch = searchQuery === "" || 
      appointment.carNumberPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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
      <div className="h-screen sticky top-0 bg-gray-900">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Manager Dashboard</h1>
              <p className="text-gray-400">Manage your car service appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by number plate or owner..."
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
        </div>
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
        <div className="p-6 pt-0 bg-gray-900">
          {filteredAppointments.length === 0 ? (
            <p className="text-gray-400 text-center">No appointments found for {activeTab} status.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  activeTab={activeTab}
                  workers={workers}
                  onWorkerAssigned={fetchAppointments}
                  onWorkerUnassigned={fetchAppointments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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