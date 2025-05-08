import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GetService = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/service-types');
        setServiceTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching service types:', error);
      }
    };
    fetchServiceTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service type? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/service-types/delete/${id}`);
        setServiceTypes(serviceTypes.filter(service => service._id !== id));
        alert('Service type deleted successfully');
      } catch (error) {
        console.error('Error deleting service type:', error);
        alert('Failed to delete service type');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl p-10 transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          All Service Types
        </h2>
        {serviceTypes.length === 0 ? (
          <p className="text-gray-600 text-lg">No service types available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {serviceTypes.map((service) => (
              <div
                key={service._id}
                className="border border-gray-200 p-6 rounded-xl flex justify-between items-start bg-gradient-to-br from-gray-50 via-white to-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{service.description}</p>
                  <p className="text-gray-600 text-base">Estimated Time: {service.estimatedTime} mins</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {service.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/update-service/${service._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetService;