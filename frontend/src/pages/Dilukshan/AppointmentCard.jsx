import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AppointmentCard = ({ appointment, activeTab, workers, onWorkerAssigned }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(appointment.worker?._id || "");
  const [localAppointment, setLocalAppointment] = useState(appointment);
  const [loading, setLoading] = useState(false);

  // Update local state when the appointment prop changes
  useEffect(() => {
    setLocalAppointment(appointment);
    setSelectedWorker(appointment.worker?._id || "");
  }, [appointment]);

  const getStatusColor = () => {
    switch (localAppointment.status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleConfirmAssign = async () => {
    if (!selectedWorker) {
      toast.error("Please select a worker!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/assign-worker/${localAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workerName: selectedWorker }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign worker");
      }

      const updatedAppointment = await response.json();
      console.log("Worker assigned:", updatedAppointment);

      // Optimistically update the local appointment state
      const selectedWorkerData = workers.find((worker) => worker.fullName === selectedWorker);
      if (selectedWorkerData) {
        setLocalAppointment((prev) => ({
          ...prev,
          worker: {
            _id: selectedWorkerData._id,
            fullName: selectedWorkerData.fullName,
          },
          status: updatedAppointment.data.status || "In Progress",
        }));
      }

      setIsAssigning(false);

      // Show success toast
      toast.success("Worker assigned successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Trigger refetch in the parent to keep state in sync
      if (onWorkerAssigned) {
        onWorkerAssigned();
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Error assigning worker:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">#{localAppointment.carNumberPlate}</p>
        <p className="text-gray-400">
          {new Date(localAppointment.appointmentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor()}`}>
        {localAppointment.status}
      </span>

      {/* User */}
      <div className="mt-4 flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <p>{localAppointment.user}</p>
      </div>

      {/* Car Details */}
      <div className="mt-2 flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m-10 4H4a2 2 0 01-2-2V7a2 2 0 012-2h2m0 0V3a2 2 0 012-2h8a2 2 0 012 2v2m-2 14h2a2 2 0 002-2V9a2 2 0 00-2-2h-2"
          ></path>
        </svg>
        <p>{`${localAppointment.make} ${localAppointment.model} (${localAppointment.year})`}</p>
      </div>

      {/* Service Type */}
      <div className="mt-2 flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <p>{localAppointment.serviceType}</p>
      </div>

      {/* Appointment Time */}
      <div className="mt-2 flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-gray-400"
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
          ></path>
        </svg>
        <p>{localAppointment.appointmentTime}</p>
      </div>

      {/* Mileage */}
      <div className="mt-2 flex items-center space-x-2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        <p>{localAppointment.mileage} miles</p>
      </div>

      {/* Notes (if present) */}
      {localAppointment.notes && (
        <div className="mt-2 flex items-center space-x-2">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          <p>{localAppointment.notes}</p>
        </div>
      )}

      {/* Worker Assignment Section */}
      {localAppointment.worker ? (
        <div className="mt-4">
          <p className="text-sm text-gray-400">Assigned Worker:</p>
          <div className="flex items-center space-x-2 mt-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <p>{localAppointment.worker.fullName}</p>
          </div>
        </div>
      ) : (
        <div>
          {!isAssigning ? (
            <button
              className="mt-4 w-full bg-white text-black rounded-lg py-2 px-4 hover:bg-gray-200"
              onClick={() => setIsAssigning(true)}
            >
              Assign Worker
            </button>
          ) : (
            <div className="mt-4">
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white mb-2"
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                disabled={loading}
              >
                <option value="">Select a worker</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker.fullName}>
                    {worker.fullName} - {worker.primarySpecialization}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  className="bg-gray-600 text-white rounded-lg py-2 px-4 hover:bg-gray-500"
                  onClick={() => setIsAssigning(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={`bg-white text-black rounded-lg py-2 px-4 hover:bg-gray-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleConfirmAssign}
                  disabled={loading}
                >
                  {loading ? "Assigning..." : "Confirm"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;