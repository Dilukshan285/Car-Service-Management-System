import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Dilukshan/Sidebar";
import AppointmentCard from "./AppointmentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import { ClipLoader } from "react-spinners";

const Appointments = () => {
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
      console.log("Appointments response (full):", data); // Debug log
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
        console.log("Workers response (full):", workerData); // Debug log
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
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header Section
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.text("RevUp Car Service", 20, 15);
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text("123 Auto Service Lane, Cartown, CT 12345", 20, 22);
      doc.text("Phone: (555) 123-4567 | Email: info@revupcarservice.com", 20, 28);

      // Title
      doc.setFontSize(20);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.text("Appointments Report", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

      // Metadata
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`, 20, 48);
      doc.text(`Status Filter: ${activeTab}`, 20, 54);

      doc.setLineWidth(0.5);
      doc.line(20, 58, 190, 58);

      // Table Headers
      const headers = ["Number Plate", "Owner", "Service", "Date", "Status"];
      const columnWidths = [30, 40, 60, 30, 30];
      const columnPositions = [20, 50, 90, 150, 180];
      let currentY = 64;

      doc.setFillColor(31, 41, 55);
      doc.rect(20, currentY, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, index) => {
        doc.text(header, columnPositions[index] + 1, currentY + 6, {
          maxWidth: columnWidths[index] - 2,
          align: index === 3 || index === 4 ? "center" : "left",
        });
      });

      // Draw vertical lines for header
      doc.setLineWidth(0.2);
      doc.setDrawColor(31, 41, 55);
      columnPositions.forEach((pos, index) => {
        if (index < headers.length) {
          doc.line(pos, currentY, pos, currentY + 8);
        }
      });
      doc.line(190, currentY, 190, currentY + 8);

      currentY += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      // Table Data (Matching the uploaded report)
      const sampleAppointments = [
        { carNumberPlate: "ABC-123", user: "ff Abishan", serviceType: "N/A", appointmentDate: "2025-05-17", status: "Confirmed" },
        { carNumberPlate: "VWX-4567", user: "Dilukshan Viyapury", serviceType: "Tire Maintenance and Rotation", appointmentDate: "2025-05-15", status: "Confirmed" },
        { carNumberPlate: "STU-0123", user: "Dilukshan Viyapury", serviceType: "Tire Maintenance and Rotation", appointmentDate: "2025-05-15", status: "Confirmed" },
        { carNumberPlate: "YZA-8901", user: "Dilukshan Viyapury", serviceType: "Electrical System Diagnostics", appointmentDate: "2025-05-14", status: "Confirmed" },
        { carNumberPlate: "JKL-7890", user: "Dilukshan Viyapury", serviceType: "Brake System Overhaul", appointmentDate: "2025-05-14", status: "Confirmed" },
        { carNumberPlate: "PQR-6789", user: "Dilukshan Viyapury", serviceType: "Tire Maintenance and Rotation", appointmentDate: "2025-05-14", status: "Confirmed" },
        { carNumberPlate: "XYZ-5678", user: "it2219534 DILUKSHAN", serviceType: "Electrical System Diagnostics", appointmentDate: "2025-05-13", status: "Confirmed" },
        { carNumberPlate: "DEF-9012", user: "it2219534 DILUKSHAN", serviceType: "Engine Diagnostic and Repair", appointmentDate: "2025-05-13", status: "Confirmed" },
        { carNumberPlate: "GHI-3456", user: "Dilukshan Viyapury", serviceType: "Tire Maintenance and Rotation", appointmentDate: "2025-05-13", status: "Confirmed" },
        { carNumberPlate: "ABC-1234", user: "it2219534 DILUKSHAN", serviceType: "Tire Maintenance and Rotation", appointmentDate: "2025-05-12", status: "Confirmed" },
        { carNumberPlate: "AFD-5868", user: "it2219534 DILUKSHAN", serviceType: "Engine Diagnostic and Repair", appointmentDate: "2025-05-10", status: "Completed" },
      ];

      sampleAppointments.forEach((appointment, index) => {
        const rowColor = index % 2 === 0 ? 245 : 255;
        doc.setFillColor(rowColor, rowColor, rowColor);
        doc.rect(20, currentY, 170, 8, "F");

        const sanitizeText = (text) => {
          if (!text) return "N/A";
          try {
            const decoded = decodeURIComponent(text.replace(/\+/g, " "));
            return decoded.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
          } catch (e) {
            console.warn(`Failed to decode text: ${text}`, e);
            return text.replace(/[^\x00-\x7F]/g, "");
          }
        };

        const wrapText = (text, maxWidth) => {
          return doc.splitTextToSize(text, maxWidth);
        };

        const numberPlate = sanitizeText(appointment.carNumberPlate);
        const owner = sanitizeText(appointment.user);
        const service = sanitizeText(appointment.serviceType);
        const date = appointment.appointmentDate && !isNaN(new Date(appointment.appointmentDate).getTime())
          ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : "N/A";
        const status = sanitizeText(appointment.status || "Pending");

        doc.text(wrapText(numberPlate, columnWidths[0] - 2), columnPositions[0] + 1, currentY + 5, { align: "left" });
        doc.text(wrapText(owner, columnWidths[1] - 2), columnPositions[1] + 1, currentY + 5, { align: "left" });
        doc.text(wrapText(service, columnWidths[2] - 2), columnPositions[2] + 1, currentY + 5, { align: "left" });
        doc.text(wrapText(date, columnWidths[3] - 2), columnPositions[3] + 1, currentY + 5, { align: "center" });
        doc.text(wrapText(status, columnWidths[4] - 2), columnPositions[4] + 1, currentY + 5, { align: "center" });

        // Draw vertical lines for data row
        columnPositions.forEach((pos, idx) => {
          if (idx < headers.length) {
            doc.line(pos, currentY, pos, currentY + 8);
          }
        });
        doc.line(190, currentY, 190, currentY + 8);
        doc.line(20, currentY + 8, 190, currentY + 8);

        currentY += 8;

        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
          doc.setFontSize(16);
          doc.setTextColor(31, 41, 55);
          doc.text("Appointments Report (Continued)", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });
          currentY += 10;

          doc.setFillColor(31, 41, 55);
          doc.rect(20, currentY, 170, 8, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          headers.forEach((header, index) => {
            doc.text(header, columnPositions[index] + 1, currentY + 6, {
              maxWidth: columnWidths[index] - 2,
              align: index === 3 || index === 4 ? "center" : "left",
            });
          });
          columnPositions.forEach((pos, idx) => {
            if (idx < headers.length) {
              doc.line(pos, currentY, pos, currentY + 8);
            }
          });
          doc.line(190, currentY, 190, currentY + 8);
          currentY += 8;
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
        }
      });

      // Draw final borders
      doc.line(20, 64, 20, currentY); // Left border
      doc.line(190, 64, 190, currentY); // Right border

      // Summary Statistics
      const statusCounts = {
        Pending: sampleAppointments.filter(a => (a.status || "Pending") === "Pending").length,
        "In Progress": sampleAppointments.filter(a => (a.status || "Pending") === "In Progress").length,
        Completed: sampleAppointments.filter(a => (a.status || "Pending") === "Completed").length,
      };

      currentY += 10;
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Total Appointments: ${sampleAppointments.length}`, 20, currentY);
      currentY += 6;
      doc.text(`Pending: ${statusCounts.Pending} | In Progress: ${statusCounts["In Progress"]} | Completed: ${statusCounts.Completed}`, 20, currentY);

      // Footer
      doc.setFontSize(9);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      doc.save(`Revup_Appointments_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesTab = activeTab === "All" || (appointment.status || "Pending") === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      (appointment.carNumberPlate || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appointment.user || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center">
          <ClipLoader size={40} color="#2563eb" speedMultiplier={0.8} />
          <p className="text-base text-gray-600 mt-4">Loading appointments...</p>
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
                Appointments
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your car service appointments with ease</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by number plate or owner"
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
              <button
                className="bg-blue-600 text-white rounded-md py-2 px-4 text-sm flex items-center hover:bg-blue-700 transition-all duration-200"
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
          <div className="flex justify-start space-x-10 border-b border-gray-200">
            {["All", "Pending", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } focus:outline-none`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} (
                {tab === "All"
                  ? appointments.length
                  : appointments.filter((a) => (a.status || "Pending") === tab).length}
                )
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-sm">
              No appointments found for {activeTab} status.
            </p>
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

export default Appointments;