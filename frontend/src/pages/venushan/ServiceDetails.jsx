import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ServiceDetails = () => {
  const { plate } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalIssues, setAdditionalIssues] = useState("");
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    const loadServiceDetails = () => {
      try {
        // Get the task data from navigation state
        const taskData = location.state;
        console.log("Task data from navigation state:", taskData);

        if (!taskData || taskData.plate !== plate) {
          throw new Error("Service data not found or plate mismatch.");
        }

        const mappedServiceData = {
          vehicle: taskData.vehicle,
          color: "N/A", // Not provided by getCurrentSchedule
          vin: "N/A", // Not provided
          license: taskData.plate,
          mileage: "N/A", // Not provided
          owner: "N/A", // Not provided
          ownerPhone: "N/A", // Not provided
          lastService: "N/A", // Not provided
          serviceType: taskData.task,
          customerNotes: "No notes provided", // Not provided
          checklist: [
            "Oil Change",
            "Oil Filter Replacement",
            "Air Filter Check",
            "Battery Check",
            "Brake Fluid Change",
            "Brake Pad Inspection/Replacement",
            "Tire Rotation",
            "Lights and Signals Check",
          ], // Default checklist
          appointmentId: "temp-id", // Temporary ID since not provided; replace with actual ID if available
        };

        setServiceData(mappedServiceData);

        const initialChecklist = {};
        mappedServiceData.checklist.forEach((item) => {
          initialChecklist[item] = false;
        });
        setChecklist(initialChecklist);
      } catch (err) {
        console.error("Error loading service details:", err);
        setError("Error loading service details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadServiceDetails();
  }, [plate, location.state]);

  const handleChecklistChange = (item) => {
    setChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAdditionalIssuesChange = (e) => {
    setAdditionalIssues(e.target.value);
  };

  const handleCompleteService = async () => {
    try {
      const completedTasks = Object.keys(checklist).filter((task) => checklist[task]);
      // Since there's no /api/services/:id/complete endpoint, we'll simulate the action
      // In a real app, you'd need to implement this endpoint to update the service status
      console.log("Completing service with:", { status: "Completed", completedTasks, additionalIssues });
      toast.success("Service completed successfully!");
      navigate("/service-dashboard");
    } catch (err) {
      toast.error("Error completing service: " + err.message);
    }
  };

  const handleGenerateReport = () => {
    toast.info("Report generation is not implemented yet.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
        <Link to="/service-dashboard" className="text-blue-600 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <p className="text-gray-600">Service not found.</p>
        <Link to="/service-dashboard" className="text-blue-600 hover:underline mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/service-dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateReport}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Generate Report</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6zm2 2v2h8V8H6zm0 4v2h4v-2H6z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Details</h2>
        <p className="text-gray-600 mb-6">
          {serviceData.vehicle} – {serviceData.license}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-blue-600">🚗</span> Vehicle Information
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Vehicle:</strong> {serviceData.vehicle}
              </p>
              <p className="text-gray-700">
                <strong>Color:</strong> {serviceData.color}
              </p>
              <p className="text-gray-700">
                <strong>VIN:</strong> {serviceData.vin}
              </p>
              <p className="text-gray-700">
                <strong>License:</strong> {serviceData.license}
              </p>
              <p className="text-gray-700">
                <strong>Mileage:</strong> {serviceData.mileage}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">Owner</h3>
              <p className="text-gray-700">{serviceData.owner}</p>
              <p className="text-gray-700">{serviceData.ownerPhone}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">Service History</h3>
              <p className="text-gray-700">
                <strong>Last Service:</strong> {serviceData.lastService}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-yellow-600">🛠️</span> Service Information
            </h3>
            <p className="text-gray-600 mb-6">
              Complete the service checklist and note any additional issues
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800">Service Type</h4>
                <p className="text-gray-700">{serviceData.serviceType}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Customer Notes</h4>
                <p className="bg-gray-100 p-3 rounded-lg text-gray-700">
                  {serviceData.customerNotes}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Service Checklist</h4>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {serviceData.checklist.map((item, index) => (
                    <label key={index} className="flex items-center space-x-3 text-gray-700">
                      <input
                        type="checkbox"
                        checked={checklist[item] || false}
                        onChange={() => handleChecklistChange(item)}
                        className="h-5 w-5 text-gray-800 rounded"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Additional Issues Found</h4>
                <textarea
                  value={additionalIssues}
                  onChange={handleAdditionalIssuesChange}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                  placeholder="Describe any additional issues or observations..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteService}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg mt-8 font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Complete Service
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;