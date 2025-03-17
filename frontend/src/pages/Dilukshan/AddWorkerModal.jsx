import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaUpload, FaCalendarAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddWorkerModal = ({ isOpen, onClose, onAddWorker }) => {
  const [loading, setLoading] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [certificationsOpen, setCertificationsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    primarySpecialization: "",
    skills: [],
    certifications: [],
    hireDate: "",
    availability: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false,
    },
    additionalNotes: "",
  });

  // Set initial hire date to current date (March 17, 2025)
  useEffect(() => {
    const today = new Date("2025-03-17");
    setFormData((prev) => ({
      ...prev,
      hireDate: today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));
  }, []);

  const skillOptions = [
    "Oil Changes",
    "Brake Repairs",
    "Engine Diagnostics",
    "Electrical Systems",
    "Transmission Repair",
    "Suspension Work",
  ];

  const certificationOptions = [
    "ASE Master Technician",
    "Hybrid Vehicle Specialist",
    "Brake System Expert",
    "Engine Performance Specialist",
    "Electrical Systems Certified",
    "Transmission Specialist",
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSkillsSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillsOpen(false);
  };

  const handleCertificationsSelect = (cert) => {
    if (!formData.certifications.includes(cert)) {
      setFormData({ ...formData, certifications: [...formData.certifications, cert] });
    }
    setCertificationsOpen(false);
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const removeCertification = (cert) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c !== cert),
    });
  };

  const handleAvailabilityChange = (day) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: !formData.availability[day],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const workerData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialization: formData.primarySpecialization,
        skills: formData.skills,
        certifications: formData.certifications,
        hireDate: formData.hireDate,
        availability: Object.keys(formData.availability).filter(
          (day) => formData.availability[day]
        ),
        notes: formData.additionalNotes,
        status: "available",
        workload: 0,
        rating: 4.5,
      };

      if (onAddWorker) {
        onAddWorker(workerData);
      }

      toast.success("Worker added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding worker:", error);
      toast.error("Failed to add worker.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh] relative border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Add New Worker</h2>
          <button
            className="text-gray-300 hover:text-white text-3xl transition-colors duration-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="text-gray-400 mb-6">Fill out the form below to add a new worker to your team.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-3">
            {/* Left Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-2 border-2 border-gray-700 hover:border-blue-500 transition-colors duration-200 relative">
                  <FaUpload className="text-3xl text-gray-400" />
                </div>
                <p className="text-blue-400 text-sm mt-2 hover:text-blue-300 transition-colors duration-200">
                  Upload a profile photo
                </p>
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="(555) 123-4567"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Address</label>
                <textarea
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Middle Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              {/* Specialization */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Primary Specialization</label>
                <select
                  id="primarySpecialization"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.primarySpecialization}
                  onChange={handleChange}
                >
                  <option value="">Select a specialization</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                </select>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Skills</label>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white text-left flex items-center justify-between hover:bg-gray-700 transition-all duration-200"
                    onClick={() => setSkillsOpen(!skillsOpen)}
                  >
                    {formData.skills.length > 0
                      ? `${formData.skills.length} skill${formData.skills.length > 1 ? "s" : ""} selected`
                      : "Select skills"}
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {skillsOpen && (
                    <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="py-2 px-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                          onClick={() => handleSkillsSelect(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-700 text-white rounded-full px-2 py-1 text-sm flex items-center hover:bg-gray-600 transition-colors duration-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Certifications</label>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white text-left flex items-center justify-between hover:bg-gray-700 transition-all duration-200"
                    onClick={() => setCertificationsOpen(!certificationsOpen)}
                  >
                    {formData.certifications.length > 0
                      ? `${formData.certifications.length} certification${formData.certifications.length > 1 ? "s" : ""} selected`
                      : "Select certifications"}
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {certificationsOpen && (
                    <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                      {certificationOptions.map((cert) => (
                        <div
                          key={cert}
                          className="py-2 px-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                          onClick={() => handleCertificationsSelect(cert)}
                        >
                          {cert}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.certifications.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-gray-700 text-white rounded-full px-2 py-1 text-sm flex items-center hover:bg-gray-600 transition-colors duration-200"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="ml-1 text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              {/* Hire Date */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Hire Date</label>
                <div className="relative">
                  <input
                    type="text"
                    id="hireDate"
                    placeholder={formData.hireDate || "March 17th, 2025"}
                    className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    value={formData.hireDate}
                    onChange={handleChange}
                    required
                  />
                  <div className="absolute right-0 top-0 mt-2 mr-3">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Weekly Availability */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Weekly Availability</label>
                {Object.keys(formData.availability).map((day) => (
                  <div key={day} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={formData.availability[day]}
                      onChange={() => handleAvailabilityChange(day)}
                      className="mr-2 accent-blue-500"
                    />
                    <label htmlFor={`day-${day}`} className="text-white">
                      {day}
                    </label>
                  </div>
                ))}
              </div>

              {/* Additional Notes */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  placeholder="Any other details or preferences?"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg mr-4 transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Save Worker"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddWorkerModal;