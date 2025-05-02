import React, { useState } from "react";

const Worker_Details = ({ worker, onClose }) => {
  console.log("Raw Worker data in Worker_Details:", worker);
  console.log("Weekly Availability from database:", worker.weeklyAvailability);

  const [activeTab, setActiveTab] = useState("Overview");

  const skills = worker.skills || [];
  const certifications = worker.certifications || [];

  const dayMapping = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };

  let weeklyAvailability = [];
  if (Array.isArray(worker.weeklyAvailability)) {
    weeklyAvailability = worker.weeklyAvailability.map((day) => {
      if (typeof day === "string") {
        return dayMapping[day.trim().toLowerCase()] || day;
      }
      return day;
    });
  }

  const completionRate = worker.completionRate || 85;
  const onTimeCompletion = worker.onTimeCompletion || 90;
  const customerSatisfaction = worker.customerSatisfaction || 4.5;

  console.log("Processed Weekly Availability:", weeklyAvailability);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200"
          onClick={onClose}
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center mb-6">
          <div className="h-20 w-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mr-4 flex items-center justify-center overflow-hidden shadow-lg">
            {worker.profilePicture ? (
              <img
                src={worker.profilePicture}
                alt={worker.fullName}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="text-3xl font-semibold text-white">
                {worker.fullName?.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white">{worker.fullName}</h2>
            <div className="flex items-center text-gray-300 mt-1">
              <svg
                className="h-5 w-5 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-lg">{worker.primarySpecialization}</span>
            </div>
            <div className="flex items-center mt-2 space-x-3">
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  worker.status === "busy"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {worker.status
                  ? worker.status.charAt(0).toUpperCase() + worker.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          {["Overview", "Notes"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300">{worker.email || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1.498a1 1 0 01.684.948V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                    />
                  </svg>
                  <span className="text-gray-300">{worker.phoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 12.414a1 1 0 00-1.414 0L7.757 16.657M21 10l-9-9-9 9m18 0v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10"
                    />
                  </svg>
                  <span className="text-gray-300">{worker.address || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Employment Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2"
                    />
                  </svg>
                  <span className="text-gray-300">NIC: {worker.nic || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Hire Date: {worker.hireDate ? new Date(worker.hireDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Skills & Certifications</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 font-medium mb-2">Skills</p>
                  {skills.length > 0 ? (
                    <ul className="space-y-2">
                      {skills.map((skill, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <svg
                            className="h-4 w-4 text-green-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No skills listed.</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-2">Certifications</p>
                  {certifications.length > 0 ? (
                    <ul className="space-y-2">
                      {certifications.map((cert, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <svg
                            className="h-4 w-4 text-blue-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No certifications listed.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Availability</h4>
              <div className="flex space-x-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                      weeklyAvailability.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notes" && (
          <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-gray-100 mb-3">Additional Notes</h4>
            <p className="text-gray-300">
              {worker.additionalNotes || "No additional notes provided."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Worker_Details;