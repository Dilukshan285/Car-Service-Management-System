import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { FaUser, FaEnvelope, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "../Validation/validation_SignUp.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import OAuth from "../components/OAuth.jsx";

const apiURL = "http://localhost:5000";

// Animation variants for staggered form fields
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "firstName" || id === "lastName") {
      const lettersPattern = /^[A-Za-z]*$/;
      if (!lettersPattern.test(value)) {
        return; // If the input is not a letter, do nothing
      }
    }

    setFormData({ ...formData, [id]: value.trim() });
    setErrors({ ...errors, [id]: validateForm(id, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear existing errors
    let currentErrors = {};
    let isFieldEmpty = false;

    // Validate each field individually
    const requiredFields = ["firstName", "lastName", "email", "password"];
    requiredFields.forEach((field) => {
      const error = validateForm(field, formData[field] || "");
      if (error) {
        currentErrors[field] = error;
        if (error.includes("required")) {
          isFieldEmpty = true;
        }
      }
    });

    // Set errors state to currentErrors, which could be empty or have errors
    setErrors(currentErrors);

    // If any required fields are empty
    if (isFieldEmpty) {
      return toast.error("Please fill out required fields.");
    }

    // If there are any validation errors, do not proceed with form submission
    if (Object.keys(currentErrors).length > 0) {
      return toast.error("Please correct the errors in the form.");
    }

    // Prepare form data for the backend
    const formPayload = new FormData();
    formPayload.append("first_name", formData.firstName);
    formPayload.append("last_name", formData.lastName);
    formPayload.append("email", formData.email);
    formPayload.append("password", formData.password);

    if (profileImage) {
      formPayload.append("avatar", profileImage);
    }
    setLoading(true); // Set loading to true before starting the API call

    try {
      const res = await fetch(apiURL + "/api/user/signup", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        navigate("/OTP");
      } else if (res.status === 400) {
        return toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validFileTypes.includes(file.type)) {
        return toast.error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return toast.error("File size exceeds the 2MB limit. Please upload a smaller image.");
      }

      setProfileImage(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-8 rounded-2xl w-full max-w-lg border border-gray-200 hover:border-blue-200 transition-all duration-300"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-center mb-6 text-blue-500"
        >
          Register for Revup
        </motion.h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <motion.div
            variants={fieldVariants}
            className="flex justify-center mb-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <input
                type="file"
                accept="image/*"
                id="profilePicture"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="profilePicture" className="cursor-pointer">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-300 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-blue-300 shadow-sm">
                    <FaUser className="text-gray-400 text-3xl" />
                  </div>
                )}
              </label>
            </motion.div>
          </motion.div>
          <motion.p
            variants={fieldVariants}
            className="text-center text-sm text-gray-500"
          >
            Choose your profile picture
          </motion.p>

          {/* First Name and Last Name Fields */}
          <motion.div
            variants={fieldVariants}
            className="flex flex-row space-x-4"
          >
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className={`flex items-center border ${
                  errors.firstName ? "border-red-500" : "border-gray-200"
                } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
              >
                <FaUser
                  className={`mr-3 ${
                    errors.firstName ? "text-red-500" : "text-blue-400"
                  }`}
                />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold  text-base"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </motion.div>
              {errors.firstName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center mt-3 text-red-500 text-sm h-4"
                >
                  <span className="text-sm">{errors.firstName}</span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className={`flex items-center border ${
                  errors.lastName ? "border-red-500" : "border-gray-200"
                } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
              >
                <FaUser
                  className={`mr-3 ${
                    errors.lastName ? "text-red-500" : "text-blue-400"
                  }`}
                />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold  text-base"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </motion.div>
              {errors.lastName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center mt-3 text-red-500 text-sm h-4"
                >
                  <span className="text-sm">{errors.lastName}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <motion.div
              whileHover={{ borderColor: "#93C5FD" }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
            >
              <FaEnvelope
                className={`mr-3 ${
                  errors.email ? "text-red-500" : "text-blue-400"
                }`}
              />
              <input
                type="email"
                id="email"
                placeholder="Email"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                value={formData.email || ""}
                onChange={handleChange}
                autoComplete="off"
              />
            </motion.div>
            {errors.email && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-3 text-red-500 text-sm h-4"
              >
                <span className="text-sm">{errors.email}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <motion.div
              whileHover={{ borderColor: "#93C5FD" }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
            >
              <FaLock
                className={`mr-3 ${
                  errors.password ? "text-red-500" : "text-blue-400"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold  text-base"
                value={formData.password || ""}
                onChange={handleChange}
                autoComplete="off"
              />
              <motion.span
                whileHover={{ scale: 1.1 }}
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.span>
            </motion.div>
            {errors.password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-3 text-red-500 text-sm h-4"
              >
                <span className="text-sm">{errors.password}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={fieldVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex justify-center items-center transition-colors text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mt-0.5">
                  <ClipLoader color="#ffffff" size={20} loading={loading} />
                </div>
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Register"
            )}
          </motion.button>

          <motion.div variants={fieldVariants}>
            <OAuth />
          </motion.div>

          {/* Already have an account */}
          <motion.p
            variants={fieldVariants}
            className="text-center text-sm mt-3 text-gray-500"
          >
            Already have an account?{" "}
            <Link to="/sign-in" className="text-orange-500 hover:underline font-medium">
              Sign in here
            </Link>
          </motion.p>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
}

export default RegisterForm;