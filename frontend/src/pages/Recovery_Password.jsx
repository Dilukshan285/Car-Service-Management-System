import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import {
  validatePassword,
  validateConfirmPassword,
} from "../Validation/validation_reset_password.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
const apiURL = "http://localhost:5000";

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

      // Show validation error only when input is not empty
      if (value) {
        const error = validatePassword(value);
        setPasswordError(error);
      } else {
        setPasswordError(""); // Clear error if the field is empty
      }
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);

      // Show validation error only when input is not empty
      if (value) {
        const error = validateConfirmPassword(password, value);
        setConfirmPasswordError(error);
      } else {
        setConfirmPasswordError(""); // Clear error if the field is empty
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setPasswordError("Password is required");
    }

    // Check if confirm password is empty
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
    }
    // Ensure validation is correct before submission
    if (!password || !confirmPassword) {
      toast.error("Both fields are required.");
      return;
    }

    // Check if there are any errors in the password fields
    if (passwordError) {
      toast.error("Please correct all errors before resetting the password.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiURL + "/api/user/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }), // Send password as an object
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        // Show success toast message
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="flex flex-col mb-4">
            <div
              className={`flex items-center border ${
                passwordError ? "border-red-500" : "border-green-300"
              } py-2 px-3 rounded-lg focus-within:border-green-500`}
            >
              <FaLock
                className={`mr-3 ${
                  passwordError ? "text-red-500" : "text-green-500"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                value={password}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {/* Show password error */}
            {passwordError && (
              <div className="text-red-500 text-sm mt-2">{passwordError}</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col mb-4">
            <div
              className={`flex items-center border ${
                confirmPasswordError ? "border-red-500" : "border-green-300"
              } py-2 px-3 rounded-lg focus-within:border-green-500`}
            >
              <FaLock
                className={`mr-3 ${
                  confirmPasswordError ? "text-red-500" : "text-green-500"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                value={confirmPassword}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {/* Show confirm password error */}
            {confirmPasswordError && (
              <div className="text-red-500 text-sm mt-2">
                {confirmPasswordError}
              </div>
            )}
          </div>

          {/* Show Password Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPasswordCheckbox"
              className="mr-2"
              checked={showPassword}
              onChange={toggleShowPassword}
            />
            <label htmlFor="showPasswordCheckbox" className="text-gray-700">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="white" size={20} />
                <span className="pl-3">Loading...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;
