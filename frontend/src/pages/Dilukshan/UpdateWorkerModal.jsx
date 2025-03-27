import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { z } from "zod";

// Define Zod schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  nic: z.string().min(10, { message: "NIC must be at least 10 characters." }), // Adjust length as needed
  specialization: z.string({ required_error: "Please select a specialization." }),
  hireDate: z.date({ required_error: "Please select a hire date." }),
  availability: z.array(z.string()).min(1, { message: "Select at least one day of availability." }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill." }),
  certifications: z.array(z.string()),
  notes: z.string().optional(),
});

const UpdateWorkerModal = ({ isOpen, onClose, worker, onUpdateWorker }) => {
  const [loading, setLoading] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [certificationsOpen, setCertificationsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    nic: "",
    primarySpecialization: "",
    skills: [],
    certifications: [],
    hireDate: "",
    weeklyAvailability: [],
    additionalNotes: "",
  });

  useEffect(() => {
    if (worker) {
      setFormData({
        fullName: worker.fullName || "",
        email: worker.email || "",
        phoneNumber: worker.phoneNumber || "",
        address: worker.address || "",
        nic: worker.nic || "",
        primarySpecialization: worker.primarySpecialization || "",
        skills: worker.skills || [],
        certifications: worker.certifications || [],
        hireDate: worker.hireDate ? new Date(worker.hireDate).toISOString().split("T")[0] : "",
        weeklyAvailability: worker.weeklyAvailability || [],
        additionalNotes: worker.additionalNotes || "",
      });
    }
  }, [worker]);

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

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
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
    setFormData((prev) => {
      const newAvailability = prev.weeklyAvailability.includes(day)
        ? prev.weeklyAvailability.filter((d) => d !== day)
        : [...prev.weeklyAvailability, day];
      return { ...prev, weeklyAvailability: newAvailability };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationData = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      address: formData.address,
      nic: formData.nic,
      specialization: formData.primarySpecialization,
      hireDate: new Date(formData.hireDate),
      availability: formData.weeklyAvailability,
      skills: formData.skills,
      certifications: formData.certifications,
      notes: formData.additionalNotes,
    };

    try {
      formSchema.parse(validationData);

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("address", formData.address);
      data.append("nic", formData.nic);
      data.append("primarySpecialization", formData.primarySpecialization);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("certifications", JSON.stringify(formData.certifications));
      data.append("hireDate", formData.hireDate);
      data.append("weeklyAvailability", JSON.stringify(formData.weeklyAvailability));
      data.append("additionalNotes", formData.additionalNotes);
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      const response = await axios.put(
        `http://localhost:5000/api/workers/update/${worker._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (onUpdateWorker) {
        onUpdateWorker(response.data.data);
      }

      toast.success("Worker updated successfully!");
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        console.error("Error updating worker:", error);
        toast.error(error.response?.data?.message || "Failed to update worker.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh] relative border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Update Worker</h2>
          <button
            className="text-gray-300 hover:text-white text-3xl transition-colors duration-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="text-gray-400 mb-6">Update the details below to modify the worker's information.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-3">
            {/* Left Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-2 border-2 border-gray-700 hover:border-blue-500 transition-colors duration-200 relative">
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : worker.profilePicture ? (
                    <img
                      src={worker.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUpload className="text-3xl text-gray-400" />
                  )}
                </div>
                <label className="text-blue-400 text-sm mt-2 hover:text-blue-300 transition-colors duration-200 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Upload a new profile photo
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@example.com"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="(555) 123-4567"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Address</label>
                <textarea
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Middle Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">NIC</label>
                <input
                  type="text"
                  id="nic"
                  placeholder="123456789V"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.nic}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Primary Specialization</label>
                <select
                  id="primarySpecialization"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.primarySpecialization}
                  onChange={handleChange}
                >
                  <option value="">Select a specialization</option>
                  <option value="Engine Specialist">Engine Specialist</option>
                  <option value="Brake Specialist">Brake Specialist</option>
                  <option value="Electrical Systems">Electrical Systems</option>
                  <option value="General Mechanic">General Mechanic</option>
                  <option value="Transmission Specialist">Transmission Specialist</option>
                </select>
              </div>

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
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Hire Date</label>
                <input
                  type="date"
                  id="hireDate"
                  className="bg-gray-800 border border-gray-700 rounded-lg w-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Weekly Availability</label>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <div key={day} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={formData.weeklyAvailability.includes(day)}
                        onChange={() => handleAvailabilityChange(day)}
                        className="mr-2 accent-blue-500"
                      />
                      <label htmlFor={`day-${day}`} className="text-white">
                        {day}
                      </label>
                    </div>
                  )
                )}
              </div>

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
              {loading ? <ClipLoader size={20} color="white" /> : "Update Worker"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateWorkerModal;