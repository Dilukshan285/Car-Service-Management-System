import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginWorkerSuccess } from "../../redux/user/workerSlice.js";

const ServiceDetails = () => {
  const { plate } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { worker } = useSelector((state) => state.worker);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalIssues, setAdditionalIssues] = useState("");
  const [checklist, setChecklist] = useState({});
  const readOnly = location.state?.readOnly || false;

  // Fetch worker details if token exists but worker is null, but only if NOT in readOnly mode
  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (readOnly) return;

      const token = localStorage.getItem("access_token");
      if (!worker && token) {
        try {
          const response = await fetch("http://localhost:5000/api/workers/current-schedule", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            dispatch(loginWorkerSuccess(data.data.worker));
          } else {
            throw new Error(data.message || "Failed to fetch worker details");
          }
        } catch (err) {
          console.error("Error fetching worker details:", err);
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }
      } else if (!worker && !token && !readOnly) {
        console.log("No worker or token, redirecting to sign-in");
        navigate("/sign-in");
      }
    };

    fetchWorkerDetails();
  }, [worker, dispatch, navigate, readOnly]);

  // Function to map appointment data to serviceData
  const mapAppointmentToServiceData = (appointment) => {
    const mappedServiceData = {
      vehicle: `${appointment.make} ${appointment.model} (${appointment.year})`,
      color: "N/A",
      vin: "N/A",
      license: appointment.carNumberPlate,
      mileage: appointment.mileage.toString(),
      owner: appointment.user,
      ownerPhone: "N/A",
      lastService: "N/A",
      serviceType: appointment.serviceType,
      customerNotes: appointment.notes || "No notes provided",
      checklist: appointment.serviceType.features || [], // Use features as checklist
      appointmentId: appointment.id || appointment._id,
      status: appointment.status,
    };
    setServiceData(mappedServiceData);

    const savedChecklist = appointment.checklist || {};
    const initialChecklist = {};
    mappedServiceData.checklist.forEach((item) => {
      initialChecklist[item] = savedChecklist[item] || false;
    });
    setChecklist(initialChecklist);

    setAdditionalIssues(appointment.additionalIssues || "");
  };

  // Initial load of service details from navigation state
  useEffect(() => {
    const loadServiceDetails = () => {
      try {
        const appointment = location.state;
        console.log("Appointment data from navigation state:", appointment);

        if (!appointment || appointment.carNumberPlate !== plate) {
          throw new Error("Service data not found or plate mismatch.");
        }
        mapAppointmentToServiceData(appointment);
      } catch (err) {
        console.error("Error loading service details:", err);
        setError("Error loading service details: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadServiceDetails();
  }, [plate, location.state]);

  // Memoized function to fetch updated service details
  const fetchUpdatedServiceDetails = useCallback(async () => {
    if (!serviceData?.appointmentId) {
      toast.error("Appointment ID is missing.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token missing. Please sign in again.");
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/workers/current-schedule", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const updatedAppointment = data.data.schedule.find(
          (appt) => appt.id === serviceData.appointmentId
        );
        if (updatedAppointment) {
          mapAppointmentToServiceData(updatedAppointment);
        } else {
          throw new Error("Updated appointment not found in schedule.");
        }
      } else {
        throw new Error(data.message || "Failed to fetch updated schedule");
      }
    } catch (err) {
      console.error("Error fetching updated service details:", err);
      toast.error("Error fetching updated service details: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [serviceData?.appointmentId, navigate]);

  const handleChecklistChange = (item) => {
    if (readOnly) return;
    setChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAdditionalIssuesChange = (e) => {
    if (readOnly) return;
    setAdditionalIssues(e.target.value);
  };

  const handleCompleteService = async () => {
    if (readOnly) return;

    const confirmComplete = window.confirm(
      "Are you sure you want to mark this service as completed? This action cannot be undone."
    );
    if (!confirmComplete) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token missing. Please sign in again.");
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/workers/complete-service/${serviceData.appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            checklist,
            additionalIssues,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          toast.error("Unauthorized: Please sign in again.");
          localStorage.removeItem("access_token");
          navigate("/sign-in");
          return;
        }
        throw new Error(data.message || "Failed to complete service");
      }

      toast.success("Service completed successfully!");
      await fetchUpdatedServiceDetails();
      setTimeout(() => navigate("/service-dashboard"), 1500);
    } catch (err) {
      console.error("Error completing service:", err);
      toast.error("Error completing service: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async () => {
    if (readOnly) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token missing. Please sign in again.");
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/workers/update-service/${serviceData.appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            checklist,
            additionalIssues,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          toast.error("Unauthorized: Please sign in again.");
          navigate("/sign-in");
          return;
        }
        throw new Error(data.message || "Failed to update service");
      }

      toast.success("Service updated successfully!");
      await fetchUpdatedServiceDetails();
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error("Error updating service: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    toast.info("Report generation is not implemented yet.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/service-dashboard")}
            className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!worker && !readOnly) {
    return null;
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8 flex justify-center items-center">
        <p className="text-gray-600">Service not found.</p>
        <button
          onClick={() => navigate("/service-dashboard")}
          className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/service-dashboard")}
          className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back to Dashboard
        </button>
        {!readOnly && (
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
        )}
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
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-800">Vehicle:</span>
                <span className="text-gray-700">{serviceData.vehicle}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-800">License:</span>
                <span className="text-gray-700">{serviceData.license}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-800">Mileage:</span>
                <span className="text-gray-700">{serviceData.mileage} miles</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-semibold text-gray-800">Owner:</span>
                <span className="text-gray-700">{serviceData.owner}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-yellow-600">🛠️</span> Service Information
            </h3>
            <p className="text-gray-600 mb-6">
              {readOnly
                ? "View the service checklist and any additional issues"
                : "Complete the service checklist and note any additional issues"}
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Type</h4>
                <p className="text-gray-700">{serviceData.serviceType.name}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Customer Notes</h4>
                <p className="bg-gray-100 p-3 rounded-lg text-gray-700">
                  {serviceData.customerNotes}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Checklist</h4>
                {serviceData.checklist.length === 0 ? (
                  <p className="text-gray-600">No checklist items available for this service type.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {serviceData.checklist.map((item, index) => (
                      <label key={index} className="flex items-center space-x-3 text-gray-700">
                        <input
                          type="checkbox"
                          checked={checklist[item] || false}
                          onChange={() => handleChecklistChange(item)}
                          className="h-5 w-5 text-gray-800 rounded"
                          disabled={readOnly}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Additional Issues Found</h4>
                <textarea
                  value={additionalIssues}
                  onChange={handleAdditionalIssuesChange}
                  className={`w-full h-24 p-3 border border-gray-300 rounded-lg mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    readOnly
                      ? "Additional issues (view only)"
                      : "Describe any additional issues or observations..."
                  }
                  disabled={readOnly}
                ></textarea>
                {!readOnly && (
                  <button
                    onClick={handleUpdateService}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg mt-4 font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Update Service
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={handleCompleteService}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 rounded-lg mt-8 font-semibold hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Completing..." : "Complete Service"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;