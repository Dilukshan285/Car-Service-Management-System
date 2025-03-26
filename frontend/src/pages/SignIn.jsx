import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaEnvelope, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "../Validation/validation_SignIn.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetLoadingState,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import OAuth from "../components/OAuth.jsx";

const apiURL = "http://localhost:5000";

// Animation variants for staggered form elements
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

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState("user"); // Default role is "user"
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset loading state when the component mounts
    dispatch(resetLoadingState());
  }, [dispatch]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Update form data
    setFormData({ ...formData, [id]: value.trim() });

    // Validate form fields and set errors
    let errorMessage = "";

    // Check if field is empty and set required field error
    if (id === "email" && value.trim() === "") {
      errorMessage = "Email is required";
    } else if (id === "password" && value.trim() === "") {
      errorMessage = "Password is required";
    } else {
      errorMessage = validateForm(id, value);
    }

    // Update the errors state with the validation result
    setErrors({ ...errors, [id]: errorMessage });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["email", "password"];
    let newErrors = {};

    // Check if any required field is empty
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // If there are errors, update state and show error toast
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      dispatch(signInStart());

      // Determine the API endpoint based on the selected role
      const endpoint =
        role === "user"
          ? `${apiURL}/api/user/signin`
          : `${apiURL}/api/workers/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        // Navigate based on role
        if (role === "user") {
          navigate("/"); // User dashboard
        } else {
          navigate("/service-dashboard"); // Worker dashboard
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
        dispatch(resetLoadingState());
      }
    } catch (error) {
      console.error("Error during API call:", error);
      dispatch(signInFailure("Failed to sign in"));
      dispatch(resetLoadingState());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-8 rounded-2xl w-full max-w-sm border border-gray-200 hover:border-blue-200 transition-all duration-300"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-center text-blue-700 mb-6"
        >
          Welcome to Revup!
        </motion.h2>
        <motion.p
          variants={fieldVariants}
          className="text-sm text-center text-gray-500 mb-6"
        >
          Streamlining Your Car Service Experience with Revup.
        </motion.p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role Selection Dropdown */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <label htmlFor="role" className="text-sm text-gray-600 mb-1">
              Sign in as:
            </label>
            <motion.select
              whileHover={{ borderColor: "#93C5FD" }}
              transition={{ duration: 0.3 }}
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="border border-gray-200 py-2 px-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all text-gray-700"
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
            </motion.select>
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
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
                value={formData.email || ""}
                onChange={handleChange}
                autoComplete="off"
              />
            </motion.div>
            {errors.email && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-1 text-red-500 text-sm"
              >
                <span className="text-xs">{errors.email}</span>
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
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
                value={formData.password || ""}
                onChange={handleChange}
                autoComplete="off"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.div>
            </motion.div>
            {errors.password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-1 text-red-500 text-sm"
              >
                <span className="text-xs">{errors.password}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            variants={fieldVariants}
            className="text-right text-sm"
          >
            <Link to="/recovery-email">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-orange-500 hover:underline font-medium"
              >
                Forgot password?
              </motion.span>
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={fieldVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex justify-center items-center transition-colors text-base"
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
              "Get Started"
            )}
          </motion.button>

          {/* OAuth */}
          <motion.div variants={fieldVariants}>
            <OAuth />
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            variants={fieldVariants}
            className="text-start mt-3 text-sm text-gray-500"
          >
            Don’t have an account?{" "}
            <Link to="/sign-up">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-orange-500 hover:underline font-medium"
              >
                Sign up
              </motion.span>
            </Link>
          </motion.p>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;