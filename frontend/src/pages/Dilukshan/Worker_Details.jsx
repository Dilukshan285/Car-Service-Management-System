import React, { useState } from "react";

const Worker_Details = ({ worker, onClose }) => {
  // Log the raw worker data for debugging
  console.log("Raw Worker data in Worker_Details:", worker);
  console.log("Weekly Availability from database:", worker.weeklyAvailability);

  // State for active tab
  const [activeTab, setActiveTab] = useState("Overview");

  // Use worker data or fallback to defaults
  const skills = worker.skills || [];
  const certifications = worker.certifications || [];

  // Map full day names to abbreviated forms
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

  // Normalize weeklyAvailability to abbreviated forms
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

  // Log the processed weeklyAvailability for debugging
  console.log("Processed Weekly Availability:", weeklyAvailability);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        {/* Close Button */}
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

        {/* Header */}
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
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-gray-200">{worker.rating || 4.5}</span>
              </div>
              <span className="text-gray-400">ID: {worker._id?.substring(0, 8) || "N/A"}</span>
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

        {/* Tabs */}
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

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Contact Information */}
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-300">{worker.address || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Employment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="text-gray-300">ID: {worker._id?.substring(0, 8) || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
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
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-300">Hourly Rate: ${worker.hourlyRate || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-gray-300">
                    Current Tasks: {worker.tasks?.length || worker.workload || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Certifications */}
              <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-100 mb-3">Certifications</h4>
                <div className="space-y-2">
                  {certifications && certifications.length > 0 ? (
                    certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-400 mr-2"
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
                        <span className="text-gray-300">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No certifications listed</div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-100 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-500/40 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No skills listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Availability */}
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Weekly Availability</h4>
              <div className="flex space-x-2 overflow-x-auto">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      weeklyAvailability.includes(day)
                        ? "bg-green-500/20 text-green-400 shadow-md"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Performance" && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
                  <p className="text-gray-400 mt-1">Completion Rate</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{onTimeCompletion}%</p>
                  <p className="text-gray-400 mt-1">On-Time Completion</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${onTimeCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{customerSatisfaction}/5</p>
                  <p className="text-gray-400 mt-1">Customer Satisfaction</p>
                  <div className="mt-2 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(customerSatisfaction / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notes" && (
          <div className="space-y-6">
            {/* Additional Notes */}
            <div className="bg-gray-800/50 p-5 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-100 mb-3">Additional Notes</h4>
              {worker.additionalNotes ? (
                <p className="text-gray-300 leading-relaxed">{worker.additionalNotes}</p>
              ) : (
                <p className="text-gray-400">No additional notes provided.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Worker_Details;