import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { z } from "zod";

// Define Zod schema with specific validations
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .regex(/^07[0-2,5-8]\d{7}$/, {
      message: "Phone number must be a valid Sri Lankan mobile number (e.g., 0711234567).",
    }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  nic: z.string().regex(/^(?:\d{12}|\d{9}[Vv])$/, {
    message: "NIC must be 12 digits (e.g., 200205602825) or 9 digits + 'V' (e.g., 612353921V).",
  }),
  specialization: z.string({ required_error: "Please select a specialization." }),
  hireDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Please select a valid date." })
    .refine((val) => {
      // Get current date without time component for comparison
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(val);
      selectedDate.setHours(0, 0, 0, 0);
      
      return selectedDate <= currentDate;
    }, {
      message: "Hire date cannot be in the future.",
    }),
  availability: z.array(z.string()).min(1, { message: "Select at least one day of availability." }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill." }),
  certifications: z.array(z.string()),
  notes: z.string().optional(),
});

const AddWorkerModal = ({ isOpen, onClose, onAddWorker }) => {
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    
    // Set the max date attribute to today's date
    setMaxDate(formattedDate);
    
    // Set today's date as the default hire date
    setFormData((prev) => ({
      ...prev,
      hireDate: formattedDate,
    }));
    
    setTouched((prev) => ({ ...prev, hireDate: true }));
    validateField("hireDate", formattedDate);
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

  const validateField = (fieldName, value) => {
    // Map formData field names to Zod schema keys
    const fieldMap = {
      fullName: "name",
      email: "email",
      phoneNumber: "phone",
      address: "address",
      nic: "nic",
      primarySpecialization: "specialization",
      hireDate: "hireDate",
      weeklyAvailability: "availability",
      skills: "skills",
      certifications: "certifications",
      additionalNotes: "notes",
    };

    const zodFieldName = fieldMap[fieldName] || fieldName;

    // Ensure skills, certifications, and availability are arrays
    const safeSkills = Array.isArray(formData.skills) ? formData.skills : [];
    const safeCertifications = Array.isArray(formData.certifications) ? formData.certifications : [];
    const safeAvailability = Array.isArray(formData.weeklyAvailability) ? formData.weeklyAvailability : [];

    const validationData = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      address: formData.address,
      nic: formData.nic,
      specialization: formData.primarySpecialization,
      hireDate: formData.hireDate,
      availability: safeAvailability,
      skills: safeSkills,
      certifications: safeCertifications,
      notes: formData.additionalNotes,
      [zodFieldName]: value, // Override the field being validated
    };

    try {
      formSchema.parse(validationData);
      setErrors((prev) => ({ ...prev, [zodFieldName]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === zodFieldName);
        setErrors((prev) => ({
          ...prev,
          [zodFieldName]: fieldError ? fieldError.message : "",
        }));
      } else {
        console.error(`Unexpected error during validation of ${fieldName}:`, error);
        setErrors((prev) => ({
          ...prev,
          [zodFieldName]: "An unexpected error occurred during validation.",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Restrict input based on field
    if (id === "fullName" && !/^[a-zA-Z\s]*$/.test(value)) return; // Only letters and spaces
    if (id === "phoneNumber" && !/^\d*$/.test(value)) return; // Only numbers
    if (id === "nic" && !/^[0-9Vv]*$/.test(value)) return; // Only numbers and 'V' or 'v'

    setFormData((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
    validateField(id, value);

    // Clear backend errors for email, phoneNumber, or nic when the user modifies the field
    if (id === "email" && errors.email?.includes("already in use")) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (id === "phoneNumber" && errors.phone?.includes("already in use")) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (id === "nic" && errors.nic?.includes("already in use")) {
      setErrors((prev) => ({ ...prev, nic: "" }));
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSkillsSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      const newSkills = [...formData.skills, skill];
      setFormData((prev) => ({ ...prev, skills: newSkills }));
      setTouched((prev) => ({ ...prev, skills: true }));
      validateField("skills", newSkills);
    }
    setSkillsOpen(false);
  };

  const handleCertificationsSelect = (cert) => {
    if (!formData.certifications.includes(cert)) {
      const newCerts = [...formData.certifications, cert];
      setFormData((prev) => ({ ...prev, certifications: newCerts }));
      setTouched((prev) => ({ ...prev, certifications: true }));
      validateField("certifications", newCerts);
    }
    setCertificationsOpen(false);
  };

  const removeSkill = (skill) => {
    const newSkills = formData.skills.filter((s) => s !== skill);
    setFormData((prev) => ({ ...prev, skills: newSkills }));
    setTouched((prev) => ({ ...prev, skills: true }));
    validateField("skills", newSkills);
  };

  const removeCertification = (cert) => {
    const newCerts = formData.certifications.filter((c) => c !== cert);
    setFormData((prev) => ({ ...prev, certifications: newCerts }));
    setTouched((prev) => ({ ...prev, certifications: true }));
    validateField("certifications", newCerts);
  };

  const handleAvailabilityChange = (day) => {
    const newAvailability = formData.weeklyAvailability.includes(day)
      ? formData.weeklyAvailability.filter((d) => d !== day)
      : [...formData.weeklyAvailability, day];
    setFormData((prev) => ({ ...prev, weeklyAvailability: newAvailability }));
    setTouched((prev) => ({ ...prev, weeklyAvailability: true }));
    validateField("weeklyAvailability", newAvailability);
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
      hireDate: formData.hireDate,
      availability: formData.weeklyAvailability,
      skills: formData.skills,
      certifications: formData.certifications,
      notes: formData.additionalNotes,
    };

    // Validate all fields on submission
    Object.entries(validationData).forEach(([key, value]) => {
      const fieldMap = {
        name: "fullName",
        email: "email",
        phone: "phoneNumber",
        address: "address",
        nic: "nic",
        specialization: "primarySpecialization",
        hireDate: "hireDate",
        availability: "weeklyAvailability",
        skills: "skills",
        certifications: "certifications",
        notes: "additionalNotes",
      };
      const formFieldName = fieldMap[key] || key;
      validateField(formFieldName, value);
    });

    // Mark all fields as touched to ensure errors are displayed
    setTouched(
      Object.keys(validationData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

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

      const response = await axios.post("http://localhost:5000/api/workers/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onAddWorker) {
        onAddWorker(response.data.data);
      }

      toast.success("Worker added successfully!");

      setFormData({
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
      setProfilePicture(null);
      setErrors({});
      setTouched({});
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else if (error.response) {
        // Handle backend errors (e.g., email, phoneNumber, or NIC already exists)
        const { message } = error.response.data;
        if (message === "Worker email already exists") {
          setErrors((prev) => ({
            ...prev,
            email: "Email is already in use by another worker",
          }));
          toast.error("Email is already in use by another worker");
        } else if (message === "Worker phone number already exists") {
          setErrors((prev) => ({
            ...prev,
            phone: "Phone number is already in use by another worker",
          }));
          toast.error("Phone number is already in use by another worker");
        } else if (message === "Worker NIC already exists") {
          setErrors((prev) => ({
            ...prev,
            nic: "NIC is already in use by another worker",
          }));
          toast.error("NIC is already in use by another worker");
        } else {
          toast.error(message || "Failed to add worker.");
        }
      } else {
        console.error("Error adding worker:", error);
        toast.error("Failed to add worker.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh] relative border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New Worker</h2>
          <button
            className="text-gray-600 hover:text-gray-800 text-3xl transition-colors duration-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="text-gray-600 mb-6">Fill out the form below to add a new worker to your team.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-3">
            {/* Left Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2 border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 relative">
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUpload className="text-3xl text-gray-500" />
                  )}
                </div>
                <label className="text-blue-700 text-sm mt-2 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Upload Profile Photo
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter full name, e.g., John Doe"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email, e.g., john.doe@example.com"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Enter phone, e.g., 071-123-4567"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  id="address"
                  placeholder="Enter address, e.g., 123 Main St, City, State, ZIP"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 h-24 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Middle Column */}
            <div className="w-full md:w-1/3 px-3 mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">NIC</label>
                <input
                  type="text"
                  id="nic"
                  placeholder="612353921V or 200205602825"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.nic}
                  onChange={handleChange}
                />
                {errors.nic && <p className="text-red-600 text-sm mt-1">{errors.nic}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Primary Specialization</label>
                <select
                  id="primarySpecialization"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
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
                {errors.specialization && (
                  <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Skills</label>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setSkillsOpen(!skillsOpen)}
                  >
                    {formData.skills.length > 0
                      ? `${formData.skills.length} skill${formData.skills.length > 1 ? "s" : ""} selected`
                      : "Select skills"}
                    <svg
                      className="h-4 w-4 text-gray-500"
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
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          className="py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                          onClick={() => handleSkillsSelect(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
                {formData.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-sm flex items-center hover:bg-blue-200 transition-colors duration-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Certifications</label>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setCertificationsOpen(!certificationsOpen)}
                  >
                    {formData.certifications.length > 0
                      ? `${formData.certifications.length} certification${formData.certifications.length > 1 ? "s" : ""} selected`
                      : "Select certifications"}
                    <svg
                      className="h-4 w-4 text-gray-500"
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
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                      {certificationOptions.map((cert) => (
                        <div
                          key={cert}
                          className="py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
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
                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-sm flex items-center hover:bg-blue-200 transition-colors duration-200"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
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
                <label className="block text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  id="hireDate"
                  max={maxDate}
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
                {errors.hireDate && <p className="text-red-600 text-sm mt-1">{errors.hireDate}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Weekly Availability</label>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <div key={day} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={formData.weeklyAvailability.includes(day)}
                        onChange={() => handleAvailabilityChange(day)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`day-${day}`} className="text-gray-900">
                        {day}
                      </label>
                    </div>
                  )
                )}
                {errors.availability && (
                  <p className="text-red-600 text-sm mt-1">{errors.availability}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  placeholder="Enter notes, e.g., special requirements or remarks"
                  className="bg-white border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-900 h-24 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                />
                {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg mr-4 transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50"
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