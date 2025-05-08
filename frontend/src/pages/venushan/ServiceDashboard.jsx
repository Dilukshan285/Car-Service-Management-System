import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutWorker, loginWorkerSuccess } from "../../redux/user/workerSlice.js";
import { toast } from "react-toastify";
import ServiceCard from "./ServiceCard";

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [workerName, setWorkerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { worker } = useSelector((state) => state.worker);

  // Fetch worker details if token exists but worker is null
  useEffect(() => {
    const fetchWorkerDetails = async () => {
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
            setWorkerName(data.data.worker.fullName);
          } else {
            throw new Error(data.message || "Failed to fetch worker details");
          }
        } catch (err) {
          console.error("Error fetching worker details:", err);
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }
      } else if (!worker && !token) {
        console.log("No worker or token, redirecting to sign-in");
        navigate("/sign-in");
      } else {
        setWorkerName(worker.fullName);
      }
    };

    fetchWorkerDetails();
  }, [worker, dispatch, navigate]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://localhost:5000/api/workers/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(logoutWorker());
        localStorage.removeItem("access_token");
        toast.dismiss();
        navigate("/sign-in");
      } else {
        console.error("Signout failed:", data.message);
        dispatch(logoutWorker());
        localStorage.removeItem("access_token");
        toast.dismiss();
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Signout error:", err);
      dispatch(logoutWorker());
      localStorage.removeItem("access_token");
      toast.dismiss();
      navigate("/sign-in");
    }
  };

  const fetchSchedule = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication token missing. Please sign in again.");
      setLoading(false);
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/workers/current-schedule", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const mappedServices = data.data.schedule.map((appointment) => ({
          ...appointment,
          worker: data.data.worker,
        }));

        console.log("Fetched Schedule Data:", data); // Debug log
        console.log("Mapped Services:", mappedServices); // Debug log
        setServices(mappedServices);
        setError(null); // Clear any previous errors
      } else {
        setError(data.message || "Failed to fetch schedule");
      }
    } catch (err) {
      setError("Error fetching schedule: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedule on mount and whenever the component is re-focused
  useEffect(() => {
    fetchSchedule();
  }, []);

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
            onClick={fetchSchedule}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="flex justify-between items-center mb-8 pl-2">
        <h2 className="text-xl font-semibold text-gray-800">{workerName}</h2>
        <div className="flex space-x-4">
          <button
            onClick={fetchSchedule}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh Schedule
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your assigned vehicles and service tasks</p>
          </div>
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {services.length} Services
          </span>
        </div>
        {services.length === 0 ? (
          <p className="text-gray-600 text-center">No services assigned to you at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id || service._id || index} appointment={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboard;