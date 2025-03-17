import React from "react";

const AddWorkerModal = ({ isOpen, onClose, formData, setFormData, handleSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        weeklyAvailability: [...formData.weeklyAvailability, value],
      });
    } else {
      setFormData({
        ...formData,
        weeklyAvailability: formData.weeklyAvailability.filter((day) => day !== value),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl mt-20 relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <svg 
            className="h-5 w-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal header */}
        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold text-white">Add New Worker</h2>
          <p className="text-gray-400 text-sm">
            Fill out the form below to add a new worker to your team.
          </p>
        </div>

        {/* Modal body */}
        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); onClose(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Left column */}
              <div>
                {/* Profile photo upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="h-28 w-28 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="h-12 w-12 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 16V8a5 5 0 015-5h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5z"
                        />
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 12h.01v.01H12V12zm3 0h.01v.01H15V12zm-6 0h.01v.01H9V12z"
                        />
                      </svg>
                    </div>
                    <button 
                      type="button"
                      className="absolute bottom-2 right-0 bg-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        className="h-4 w-4 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">Upload a profile photo</span>
                </div>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* Right column */}
              <div>
                {/* Primary Specialization */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Primary Specialization</label>
                  <div className="relative">
                    <select
                      name="primarySpecialization"
                      value={formData.primarySpecialization}
                      onChange={handleInputChange}
                      className="appearance-none w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white pr-8"
                    >
                      <option value="">Select a specialization</option>
                      <option value="Engine Specialist">Engine Specialist</option>
                      <option value="Brake Specialist">Brake Specialist</option>
                      <option value="Electrical Systems">Electrical Systems</option>
                      <option value="General Mechanic">General Mechanic</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Skills</label>
                  <p className="text-gray-400 text-xs mb-1">Select all applicable skills</p>
                  <div className="relative">
                    <select
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="appearance-none w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white pr-8"
                    >
                      <option value="">Select skills</option>
                      <option value="Engine Repair">Engine Repair</option>
                      <option value="Brake Repair">Brake Repair</option>
                      <option value="Electrical Diagnostics">Electrical Diagnostics</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Certifications</label>
                  <p className="text-gray-400 text-xs mb-1">Select all applicable certifications</p>
                  <div className="relative">
                    <select
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      className="appearance-none w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white pr-8"
                    >
                      <option value="">Select certifications</option>
                      <option value="ASE Certified">ASE Certified</option>
                      <option value="EPA Certified">EPA Certified</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hire Date */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Hire Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="hireDate"
                      value={formData.hireDate || "March 16th, 2025"}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white pr-10"
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3">
                      <svg 
                        className="h-5 w-5 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Weekly Availability */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Weekly Availability</label>
                  <p className="text-gray-400 text-xs mb-2">Select the days when the worker is available</p>
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (day) => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            value={day}
                            checked={formData.weeklyAvailability.includes(day)}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          <label htmlFor={`day-${day}`} className="text-white text-sm">
                            {day}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Hourly Rate ($)</label>
                  <input
                    type="text"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                  />
                </div>

                {/* Additional Notes */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information about the worker..."
                    className="w-full bg-gray-800 border border-gray-700 rounded py-2 px-3 text-white"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkerModal;