import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceDetails = () => {
  const { plate } = useParams(); // Get the plate from URL
  const navigate = useNavigate();

  // Sample data (in a real app, fetch this based on the plate number)
  const serviceData = {
    vehicle: 'Toyota Camry 2019',
    color: 'Silver',
    vin: '1HGCM82633A123456',
    license: 'ABC-1234',
    mileage: '45,000 miles',
    owner: 'John Smith',
    ownerPhone: '(555) 123-4567',
    lastService: '12/15/2024',
    serviceType: 'Regular Maintenance',
    customerNotes: 'Car makes a slight noise when braking',
    checklist: [
      'Oil Change',
      'Oil Filter Replacement',
      'Air Filter Check',
      'Battery Check',
      'Brake Fluid Change',
      'Brake Pad Inspection/Replacement',
      'Tire Rotation',
      'Lights and Signals Check',
    ],
  };

  const handleCompleteService = () => {
    // In a real app, you'd handle the form submission here
    alert('Service completed!');
    navigate('/'); // Navigate back to the dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          
         
        </div>
        <div className="flex space-x-4">
         
          <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
            <span>Generate Report</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6zm2 2v2h8V8H6zm0 4v2h4v-2H6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Service Details
        </h2>
        <p className="text-gray-600 mb-6">
          Toyota Camry (2019) – ABC-1234
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Information */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-blue-600">🚗</span> Vehicle Information
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700"><strong>Vehicle:</strong> {serviceData.vehicle}</p>
              <p className="text-gray-700"><strong>Color:</strong> {serviceData.color}</p>
              <p className="text-gray-700"><strong>VIN:</strong> {serviceData.vin}</p>
              <p className="text-gray-700"><strong>License:</strong> {serviceData.license}</p>
              <p className="text-gray-700"><strong>Mileage:</strong> {serviceData.mileage}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">Owner</h3>
              <p className="text-gray-700">{serviceData.owner}</p>
              <p className="text-gray-700">{serviceData.ownerPhone}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">Service History</h3>
              <p className="text-gray-700"><strong>Last Service:</strong> {serviceData.lastService}</p>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-yellow-600">🛠️</span> Service Information
            </h3>
            <p className="text-gray-600 mb-6">
              Complete the service checklist and note any additional issues
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800">Service Type</h4>
                <p className="text-gray-700">{serviceData.serviceType}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Customer Notes</h4>
                <p className="bg-gray-100 p-3 rounded-lg text-gray-700">{serviceData.customerNotes}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Service Checklist</h4>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {serviceData.checklist.map((item, index) => (
                    <label key={index} className="flex items-center space-x-3 text-gray-700">
                      <input type="checkbox" className="h-5 w-5 text-gray-800 rounded" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Additional Issues Found</h4>
                <textarea
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg mt-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                  placeholder="Describe any additional issues or observations..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Service Button */}
        <button
          onClick={handleCompleteService}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg mt-8 font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Complete Service
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;