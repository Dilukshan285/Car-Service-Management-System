import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ServiceCard = ({ appointment }) => {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(appointment.isAcceptedByWorker || false);

  const handleAcceptService = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token missing. Please sign in again.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/sign-in");
      return;
    }

    try {
      // Create a promise for the API call with token in Authorization header
      const acceptServicePromise = fetch(
        `http://localhost:5000/api/appointments/accept-service/${appointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to accept service: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      });

      // Show toast with the promise and ensure it displays immediately
      await toast.promise(
        acceptServicePromise,
        {
          pending: {
            render() {
              return "Accepting service...";
            },
            delay: 0, // Show immediately
          },
          success: {
            render() {
              return "Service accepted successfully!";
            },
            autoClose: 2000, // Success message displays for 2 seconds
            delay: 0, // Ensure success message shows immediately after pending
          },
          error: {
            render({ data }) {
              return `Error accepting service: ${data.message}`;
            },
          },
        },
        {
          position: "top-right",
          autoClose: 2000, // Ensure the toast closes after 2 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );

      // Update local state to reflect that the service has been accepted
      setIsAccepted(true);

      // Navigate after the toast has been displayed
      navigate(`/service-details/${appointment.carNumberPlate}`, {
        state: { ...appointment, status: "In Progress", isAcceptedByWorker: true },
      });
    } catch (error) {
      // Handle token expiration or authentication errors
      if (error.message.includes("401")) {
        localStorage.removeItem("access_token");
        toast.error("Authentication expired. Please sign in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/sign-in");
      } else {
        toast.error("Error accepting service: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      console.error("Accept service error:", error);
    }
  };

  const handleViewProgress = () => {
    // Check for token before navigating
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Authentication token missing. Please sign in again.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/sign-in");
      return;
    }

    // Navigate to the service details page when "View Progress" is clicked
    navigate(`/service-details/${appointment.carNumberPlate}`, {
      state: { ...appointment, status: "In Progress", isAcceptedByWorker: true },
    });
  };

  const vehicle = `${appointment.make} ${appointment.model} (${appointment.year})`;
  // Combine appointmentDate and appointmentTime for urgency check
  const appointmentDateTime = new Date(
    `${appointment.appointmentDate}T${appointment.appointmentTime}`
  );
  const isUrgent = appointmentDateTime - new Date() <= 24 * 60 * 60 * 1000;

  return (
    <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 m-4 w-72 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">{vehicle}</h3>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            isUrgent ? "text-red-700 bg-red-100 animate-pulse" : "text-green-700 bg-green-100"
          }`}
        >
          {isUrgent ? "Urgent" : "Regular"}
        </span>
      </div>
      <div className="space-y-3">
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-blue-600">🏷️</span> {appointment.carNumberPlate}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-purple-600">👤</span> {appointment.worker.fullName}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-yellow-600">🛠️</span> {appointment.serviceType.name}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-indigo-600">⏰</span> {appointment.appointmentTime} on{" "}
          {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <button
        onClick={isAccepted ? handleViewProgress : handleAcceptService}
        className={`w-full text-white py-3 rounded-lg mt-6 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
          isAccepted
            ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-700"
        }`}
      >
        {isAccepted ? "View Progress" : "Accept Service"}
      </button>
    </div>
  );
};

export default ServiceCard;