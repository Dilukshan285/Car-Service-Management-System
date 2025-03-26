import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ vehicle, plate, technician, task, status, assignedTime, isUrgent }) => {
  const navigate = useNavigate();

  const handleAcceptService = () => {
    // Navigate to ServiceDetails and pass the task data as state
    navigate(`/service-details/${plate}`, {
      state: {
        vehicle,
        plate,
        technician,
        task,
        status,
        assignedTime,
        isUrgent,
      },
    });
  };

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
          <span className="mr-2 text-blue-600">🏷️</span> {plate}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-purple-600">👤</span> {technician}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-yellow-600">🛠️</span> {task}
        </p>
        <p className="text-gray-700 flex items-center">
          <span className="mr-2 text-indigo-600">⏰</span> Assigned: {assignedTime}
        </p>
      </div>
      <button
        onClick={handleAcceptService}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg mt-6 font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Accept Service
      </button>
    </div>
  );
};

export default ServiceCard;