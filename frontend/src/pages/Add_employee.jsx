import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTie } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { validateEmployee } from "../Validation/add_employee_validation.jsx";
import { useNavigate } from "react-router-dom";

const apiURL = "http://localhost:5000";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Block non-numeric input for phone number field
    if (name === "mobile" || name === "contact_number") {
      // Allow only numeric characters
      if (!/^\d*$/.test(value)) {
        return; // Block non-numeric input by not updating formData
      }
    }

    // Block numbers for first name and last name fields
    if (name === "first_name" || name === "last_name") {
      // Allow only letters (and spaces if needed)
      if (!/^[A-Za-z]*$/.test(value)) {
        return; // Block numeric input by not updating formData
      }
    }
    // Update formData state
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Validate only the changed field
    const fieldErrors = validateEmployee(name, value);

    // If there's an error for this field, add it to the errors state
    // If the field is valid (no error), remove the error for that field
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldErrors };

      // Remove error for the current field if no error exists
      if (!fieldErrors[name]) {
        delete updatedErrors[name];
      }

      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Iterate through the formData to validate each field
    Object.keys(formData).forEach((field) => {
      const fieldError = validateEmployee(field, formData[field]);

      // Check if any required field is empty
      if (!formData[field] || formData[field].trim() === "") {
        fieldError[field] = `${field.replace("_", " ")} is required.`;
      }
      if (field === "role" && !formData[field]) {
        fieldError[field] = `Role is required.`;
      }
      validationErrors = { ...validationErrors, ...fieldError };
    });

    // Update the errors state
    setErrors(validationErrors);

    // Check if any validation errors exist and prevent submission if true
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/user/add-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Employee added successfully, email sent");
        setTimeout(() => {
          navigate("/admin-user");
        }, 3000);
      } else if (res.status === 400) {
        toast.error("User Email Already Exists");
      } else if (res.status === 401) {
        toast.error(
          "Mobile number already exists. Please use a different number."
        );
      } else {
        toast.error(
          data.message || "An error occurred while adding the employee"
        );
      }
    } catch (error) {
      toast.error("Unexpected error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-6 relative">
            <FaUser className="absolute left-3 top-3 text-green-600" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              // required
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.first_name ? "border-red-500" : ""
              }`}
              placeholder="First Name"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-6 relative">
            <FaUser className="absolute left-3 top-3 text-green-600" />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              // required
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.last_name ? "border-red-500" : ""
              }`}
              placeholder="Last Name"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6 relative">
            <FaEnvelope className="absolute left-3 top-3 text-green-600" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              // required
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="mb-6 relative">
            <FaPhone className="absolute left-3 top-3 text-green-600" />

            {/* Span for +94 country code */}
            <span className="absolute left-10 top-2 text-gray-700">+94</span>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              // required
              className={`w-full pl-20 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.mobile ? "border-red-500" : ""
              }`}
              placeholder="Contact Number"
              style={{ paddingLeft: "72px" }} // Additional padding to avoid overlap
            />

            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6 relative">
            <FaUserTie className="absolute left-3 top-3 text-green-600" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.role ? "border-red-500" : ""
              }`}
            >
              <option value="">Select a role</option>{" "}
              {/* Add an empty option */}
              <option value="User Manager">User Manager</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Offcut Manager">Offcut Manager</option>
              <option value="Vehicle Fleet Manager">
                Vehicle Fleet Manager
              </option>
              <option value="Delivery Manager">Delivery Manager</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Quality Manager">Quality Manager</option>
              <option value="Farmer Manager">Farmer Manager</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader color="#ffffff" size={20} loading={loading} />
                  <span className="pl-3">Loading...</span>
                </div>
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEmployeeForm;
