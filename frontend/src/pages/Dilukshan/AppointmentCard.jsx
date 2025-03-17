import React, { useState } from "react";

const AppointmentCard = ({ appointment, activeTab, sampleWorkers }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(appointment.worker ? appointment.worker._id : "");

  const getStatusColor = () => {
    switch (activeTab) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleConfirmAssign = () => {
    if (!selectedWorker) {
      alert("Please select a worker!");
      return;
    }
    // Simulate assignment (logs to console)
    console.log(`Assigned worker ${selectedWorker} to appointment ${appointment._id}`);
    setIsAssigning(false);
    // In a real app, you would update the appointment state here
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">#{appointment._id}</p>
        <p className="text-gray-400">
          {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor()}`}>
        {activeTab}
      </span>
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
        <p>{appointment.customerName}</p>
      </div>
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
        <p>{appointment.carType}</p>
      </div>
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
        <p>{appointment.serviceType}</p>
      </div>
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
        <p>
          {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}{" "}
          -{" "}
          {new Date(
            new Date(appointment.appointmentDate).getTime() + 60 * 60 * 1000
          ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
        </p>
      </div>

      {/* Worker Assignment Section */}
      {appointment.worker ? (
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
            <p>
              {sampleWorkers.find((w) => w._id === appointment.worker._id)?.name} -{" "}
              {sampleWorkers.find((w) => w._id === appointment.worker._id)?.specialty}
            </p>
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
              >
                <option value="">Select a worker</option>
                {sampleWorkers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} - {worker.specialty}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  className="bg-gray-600 text-white rounded-lg py-2 px-4 hover:bg-gray-500"
                  onClick={() => setIsAssigning(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-white text-black rounded-lg py-2 px-4 hover:bg-gray-200"
                  onClick={handleConfirmAssign}
                >
                  Confirm
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