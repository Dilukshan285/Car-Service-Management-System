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
          const response = await fetch("http://localhost:5000/api/workers/schedule", {
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
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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
        // Even if the backend request fails, clear localStorage and redirect
        dispatch(logoutWorker());
        localStorage.removeItem("access_token");
        toast.dismiss();
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Signout error:", err);
      // Clear localStorage and redirect even if there's an error
      dispatch(logoutWorker());
      localStorage.removeItem("access_token");
      toast.dismiss();
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token missing. Please sign in again.");
        setLoading(false);
        navigate("/sign-in");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/workers/schedule", {
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

          console.log("Mapped Services:", mappedServices);
          setServices(mappedServices);
        } else {
          setError(data.message || "Failed to fetch schedule");
        }
      } catch (err) {
        setError("Error fetching schedule: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} appointment={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;