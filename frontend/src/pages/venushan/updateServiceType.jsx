import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateServiceType = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/service-types/${id}`);
        const service = response.data.data;
        setName(service.name);
        setDescription(service.description);
        setFeatures(service.features);
        setEstimatedTime(service.estimatedTime.toString());
      } catch (error) {
        console.error('Error fetching service type:', error);
      }
    };
    fetchServiceType();
  }, [id]);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !estimatedTime) {
      alert('Please fill in all required fields (Service Name, Description, Estimated Time).');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/service-types/update/${id}`, {
        name,
        description,
        features,
        estimatedTime: parseInt(estimatedTime),
      });
      alert('Service type updated successfully');
      navigate('/get');
    } catch (error) {
      console.error('Error updating service type:', error);
      alert('Failed to update service type');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-10 transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Update Service Type
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Modify the details for the selected service type to ensure accuracy and relevance.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Service Name */}
          <div className="mb-8">
            <label
              htmlFor="serviceName"
              className="block text-gray-800 text-sm font-semibold mb-3 tracking-wide"
            >
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              id="serviceName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the service name (e.g., Oil Change)"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label
              htmlFor="description"
              className="block text-gray-800 text-sm font-semibold mb-3 tracking-wide"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 text-base h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of what this service includes..."
              required
            />
          </div>

          {/* Service Features */}
          <div className="mb-8">
            <label className="block text-gray-800 text-sm font-semibold mb-3 tracking-wide">
              Service Features
            </label>
            {features.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-4">No features added yet.</p>
            )}
            <button
              type="button"
              className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </div>

          {/* Estimated Time */}
          <div className="mb-10">
            <label
              htmlFor="estimatedTime"
              className="block text-gray-800 text-sm font-semibold mb-3 tracking-wide"
            >
              Estimated Time (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              id="estimatedTime"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="Enter the average time needed (e.g., 60)"
              min="1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/get-service')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
            >
              Update Service Type
            </button>
          </div>
        </form>

        {/* Modal for Adding Features */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add Custom Feature</h3>
              <div className="mb-6">
                <label
                  htmlFor="newFeature"
                  className="block text-gray-800 text-sm font-semibold mb-2"
                >
                  Feature Name
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                  id="newFeature"
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter a feature (e.g., Requires Tools)"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  onClick={handleAddFeature}
                  disabled={!newFeature.trim()}
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateServiceType;