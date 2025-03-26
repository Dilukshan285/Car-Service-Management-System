import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";
import ServiceCard from "./ServiceCard";

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [workerName, setWorkerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/workers/signout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(signoutSuccess());
        localStorage.removeItem("user");
        navigate("/sign-in");
      } else {
        console.error("Signout failed:", data.message);
      }
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/workers/schedule", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Map the full schedule data directly to services
          const mappedServices = data.data.schedule.map((appointment) => ({
            ...appointment,
            worker: data.data.worker, // Add worker details to each appointment
          }));

          setServices(mappedServices);
          setWorkerName(data.data.worker.fullName);
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