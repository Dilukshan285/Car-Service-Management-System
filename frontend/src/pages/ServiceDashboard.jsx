import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ vehicle, plate, technician, task, status, assignedTime, isUrgent }) => {
  const navigate = useNavigate();

  const handleAcceptService = () => {
    navigate(`/service-details/${plate}`); // Navigate to ServiceDetails page with plate as a parameter
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 m-4 w-72 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">{vehicle}</h3>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            isUrgent
              ? 'text-red-700 bg-red-100 animate-pulse'
              : 'text-green-700 bg-green-100'
          }`}
        >
          {isUrgent ? 'Urgent' : 'Regular'}
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

const ServiceDashboard = () => {
  const services = [
    {
      vehicle: 'Toyota Camry (2019)',
      plate: 'ABC-1234',
      technician: 'John Smith',
      task: 'Regular Maintenance',
      status: 'Assigned',
      assignedTime: '09:30 AM',
      isUrgent: false,
    },
    {
      vehicle: 'Honda Civic (2020)',
      plate: 'XYZ-5678',
      technician: 'Jane Doe',
      task: 'Engine Check',
      status: 'Assigned',
      assignedTime: '10:15 AM',
      isUrgent: true,
    },
    {
      vehicle: 'Ford F-150 (2018)',
      plate: 'DEF-9012',
      technician: 'Robert Johnson',
      task: 'Brake Inspection',
      status: 'Assigned',
      assignedTime: '11:00 AM',
      isUrgent: false,
    },
    {
      vehicle: 'Toyota Camry (2019)',
      plate: 'ABC-1234',
      technician: 'John Smith',
      task: 'Regular Maintenance',
      status: 'Assigned',
      assignedTime: '09:30 AM',
      isUrgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          
          
        </div>
        <h2 className="text-xl font-semibold text-gray-800"></h2>
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
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboard;