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
    try {
      await axios.delete(`http://localhost:5000/api/service-types/delete/${id}`);
      setServiceTypes(serviceTypes.filter(service => service._id !== id));
      alert('Service type deleted successfully');
    } catch (error) {
      console.error('Error deleting service type:', error);
      alert('Failed to delete service type');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-12">
      <h2 className="text-3xl font-bold mb-6">All Service Types</h2>
      <div className="grid grid-cols-1 gap-6">
        {serviceTypes.map((service) => (
          <div key={service._id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-gray-600">Estimated Time: {service.estimatedTime} mins</p>
              <div>
                {service.features.map((feature, index) => (
                  <span key={index} className="inline-block bg-gray-200 text-gray-800 text-sm mr-2 mt-2 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => navigate(`/update-service/${service._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetService;