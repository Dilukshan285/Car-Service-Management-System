import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaEye,
  // FaExclamationCircle,
} from "react-icons/fa";
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
import OAuth from "../components/OAuth.jsx";

const apiURL = "http://localhost:5000";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
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

      const res = await fetch(apiURL + "/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/"); // navigate as soon as success is confirmed
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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg w-full max-w-sm shadow-lg border border-green-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome!
        </h2>
        <p className="text-sm text-center text-gray-500 mb-9">
          Streamlining Your Wholesale Experience with Fresh and Quality
          Vegetables, Directly from the Farm.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
                value={formData.email || ""}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
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
              <div
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                {/* <FaExclamationCircle className="mr-1 self-start mt-[0.125rem]" /> */}
                <span className="text-xs">{errors.password}</span>
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right text-sm">
            <Link to="/recovery-email" className="text-red-600 hover:underline">
              Forgot password?
            </Link>
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
              "Get Started"
            )}
          </button>
          <OAuth />
        </form>

        {/* Sign Up Link */}
        <p className="text-start mt-3 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-red-600 hover:underline">
            Sign up
          </Link>
        </p>
        
        
       
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
