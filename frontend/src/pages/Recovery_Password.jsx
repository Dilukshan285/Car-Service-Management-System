import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validatePassword,
  validateConfirmPassword,
} from "../Validation/validation_reset_password.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

const apiURL = "http://localhost:5000";

// Animation variants for staggered form elements
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      bounce: 0.4,
    },
  },
};

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "password") {
      setPassword(value);
      if (value) {
        const error = validatePassword(value);
        setPasswordError(error);
      } else {
        setPasswordError("");
      }
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
      if (value) {
        const error = validateConfirmPassword(password, value);
        setConfirmPasswordError(error);
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setPasswordError("Password is required");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
    }

    if (!password || !confirmPassword) {
      toast.error("Both fields are required.");
      return;
    }

    if (passwordError || confirmPasswordError) {
      toast.error("Please correct all errors before resetting the password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiURL + "/api/user/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      } else {
        toast.error(
          "Session expired. Please enter email again by clicking forget password."
        );
      }
    } catch (error) {
      toast.error("Unexpected error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-lg shadow-lg p-8 rounded-2xl w-full max-w-md border border-gray-100 hover:border-blue-300 transition-all duration-300"
        style={{
          boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.05), 0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-center mb-6 text-blue-600"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Reset Your Password
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <motion.div
              whileHover={{ borderColor: "#60A5FA", scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                passwordError ? "border-red-600" : "border-gray-200"
              } py-2 px-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all bg-white/50`}
            >
              <FaLock
                className={`mr-3 ${
                  passwordError ? "text-red-600" : "text-blue-400"
                } text-lg`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
                value={password}
                onChange={handleChange}
                autoComplete="off"
              />
              <motion.span
                whileHover={{ scale: 1.1 }}
                onClick={toggleShowPassword}
                className="cursor-pointer text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.span>
            </motion.div>
            {passwordError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-2 text-red-600 text-sm font-medium"
              >
                <span className="text-sm">{passwordError}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <motion.div
              whileHover={{ borderColor: "#60A5FA", scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                confirmPasswordError ? "border-red-600" : "border-gray-200"
              } py-2 px-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all bg-white/50`}
            >
              <FaLock
                className={`mr-3 ${
                  confirmPasswordError ? "text-red-600" : "text-blue-400"
                } text-lg`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
                value={confirmPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <motion.span
                whileHover={{ scale: 1.1 }}
                onClick={toggleShowPassword}
                className="cursor-pointer text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.span>
            </motion.div>
            {confirmPasswordError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-2 text-red-600 text-sm font-medium"
              >
                <span className="text-sm">{confirmPasswordError}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={fieldVariants}
            whileHover={{
              scale: 1.02,
              background: "linear-gradient(to right, #3B82F6, #2563EB)",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex justify-center items-center transition-all duration-300 text-base shadow-md"
            disabled={loading}
            style={{
              fontFamily: "'Poppins', sans-serif",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="white" size={20} />
                <span className="pl-3">Loading...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;