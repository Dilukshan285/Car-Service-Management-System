import React, { useState } from 'react';
import axios from 'axios';

const ServiceType = () => {
  const [name, setName] = useState('Oil Change');
  const [description, setDescription] = useState('Detailed description of the service...');
  const [features, setFeatures] = useState(['Requires Tools', 'High Priority', 'Outdoor Service', 'Customer Provided Parts']);
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature]);
      setNewFeature("");
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/service-types/create', {
        name,
        description,
        features,
        estimatedTime,
      });
      alert('Service type created successfully');
      setName('');
      setDescription('');
      setFeatures([]);
      setEstimatedTime(0);
    } catch (error) {
      console.error('Error creating service type:', error);
      alert('Failed to create service type');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-12">
      <h2 className="text-3xl font-bold mb-6">Service Type Details</h2>
      <p className="text-gray-600 mb-6 text-lg">Enter the details for the new service type you want to add to your system.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-base font-bold mb-3" htmlFor="serviceName">
            Service Name
          </label>
          <input
            className="w-full p-4 border rounded-lg text-lg"
            id="serviceName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The name of the service type as it will appear to customers."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-base font-bold mb-3" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full p-4 border rounded-lg text-lg h-40"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of what this service includes."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-base font-bold mb-3">Service Features</label>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {features.map((feature, index) => (
              <label key={index} className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5" checked />
                <span className="ml-3 text-lg">{feature}</span>
              </label>
            ))}
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Custom Features
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-base font-bold mb-3" htmlFor="estimatedTime">
            Estimated Time (minutes)
          </label>
          <input
            className="w-full p-4 border rounded-lg text-lg"
            id="estimatedTime"
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="The average time needed to complete this service."
          />
        </div>

        <div className="flex justify-end space-x-6">
          <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-lg">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg">
            Create Service Type
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Custom Feature</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newFeature">
                Feature Name
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                id="newFeature"
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter feature name"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleAddFeature}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceType;