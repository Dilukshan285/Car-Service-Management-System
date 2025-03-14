import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaEye,
  // FaExclamationCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { validateForm } from "../Validation/validation_SignUp.jsx"; // Assuming other validations are here
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth.jsx";

const apiURL = "http://localhost:5000";

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
        return toast.error(
          "Email already exists. Please use a different email."
        );
      } else {
        // Stop loading for unexpected server response
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      // Stop loading on catch block due to an error
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
        return toast.error(
          "Invalid file type. Please upload a JPEG, PNG, or GIF image."
        );
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return toast.error(
          "File size exceeds the 2MB limit. Please upload a smaller image."
        );
      }

      setProfileImage(file);
    }
  };

  return (
    <div className="bg-white-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md border border-green-300 hover:border-green-400">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-800">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
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
                    className="w-24 h-24 rounded-full object-cover border border-green-300"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-400 text-3xl" />
                  </div>
                )}
              </label>
            </div>
          </div>
          <p className="text-center text-sm">Choose your profile picture</p>

          {/* First Name and Last Name Fields */}
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col">
              <div
                className={`flex items-center border ${
                  errors.firstName ? "border-red-500" : "border-green-300"
                } py-2 px-3 rounded-lg focus-within:border-green-500`}
              >
                <FaUser
                  className={`mr-3 ${
                    errors.firstName ? "text-red-500" : "text-green-500"
                  }`}
                />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {errors.firstName && (
                <div className="flex items-center mt-2 text-red-500 text-sm h-4">
                  {/* <FaExclamationCircle className="mr-1 flex-shrink-0" /> */}
                  <span className="text-xs">{errors.firstName}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div
                className={`flex items-center border ${
                  errors.lastName ? "border-red-500" : "border-green-300"
                } py-2 px-3 rounded-lg focus-within:border-green-500`}
              >
                <FaUser
                  className={`mr-3 ${
                    errors.lastName ? "text-red-500" : "text-green-500"
                  }`}
                />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {errors.lastName && (
                <div className="flex items-center mt-2 text-red-500 text-sm h-4">
                  {/* <FaExclamationCircle className="mr-1 flex-shrink-0" /> */}
                  <span className="text-xs">{errors.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <div
              className={`flex items-center border ${
                errors.email ? "border-red-500" : "border-green-300"
              } py-2 px-3 rounded-lg focus-within:border-green-500`}
            >
              <FaEnvelope
                className={`mr-3 ${
                  errors.email ? "text-red-500" : "text-green-500"
                }`}
              />
              <input
                type="email"
                id="email"
                placeholder="Email"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                value={formData.email || ""}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {errors.email && (
              <div className="flex items-center mt-1 mb-0 text-red-500 text-sm h-4">
                {/* <FaExclamationCircle className="mr-1" /> */}
                <span className="text-xs">{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <div
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-green-300"
              } py-2 px-3 rounded-lg focus-within:border-green-500`}
            >
              <FaLock
                className={`mr-3 ${
                  errors.password ? "text-red-500" : "text-green-500"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                value={formData.password || ""}
                onChange={handleChange}
                autoComplete="off"
              />
              <span
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <div className="flex items-center mt-2 mb-0 text-red-500 text-sm h-4">
                {/* <FaExclamationCircle className="mr-1" /> */}
                <span className="text-xs">{errors.password}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex justify-center"
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
          </button>
          <OAuth />
          {/* Already have an account */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-red-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterForm;
