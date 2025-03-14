import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaEye,
  // FaExclamationCircle,
  FaUserTie, // Icon for role
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

const apiURL = "http://localhost:5000";

// Array of roles
const roles = [
  { label: "User Manager", icon: <FaUserTie /> },
  { label: "Quality Manager", icon: <FaUserTie /> },
  { label: "Offcut Manager", icon: <FaUserTie /> },
  { label: "Order Manager", icon: <FaUserTie /> },
  { label: "Delivery Manager", icon: <FaUserTie /> },
  { label: "Vehicle Fleet Manager", icon: <FaUserTie /> },
  { label: "Farmer Manager", icon: <FaUserTie /> },
  { label: "Inventory Manager", icon: <FaUserTie /> },
];

const EmployeeSignin = () => {
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
    if (id === "password" && value.trim() === "") {
      setErrors({ ...errors, [id]: "Password is required" });
    } else {
      setErrors({ ...errors, [id]: validateForm(id, value) });
    }
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;

    // Update form data
    setFormData({ ...formData, role: value });

    // Clear the error if a valid role is selected
    if (value !== "") {
      setErrors({ ...errors, role: "" });
    } else {
      setErrors({ ...errors, role: "Role is required" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.role) newErrors.role = "Role is required";

    // If there are errors, display them and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error("Please fill out all required fields.");
    }

    try {
      dispatch(signInStart());

      const res = await fetch(`${apiURL}/api/user/login-employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 900) {
        dispatch(signInSuccess(data));
        navigate("/admin-user"); // User-specific redirection
      } else if (res.status === 901) {
        dispatch(signInSuccess(data));
        navigate("/admin-product");
      } else if (res.status === 902) {
        dispatch(signInSuccess(data));
        navigate("/qa-manager");
      } else if (res.status === 903) {
        dispatch(signInSuccess(data));
        navigate("/vehicle-fleet");
      } else if (res.status === 904) {
        dispatch(signInSuccess(data));
        navigate("/wh-staff/inventory-dashboard");
      } else if (res.status === 905) {
        dispatch(signInSuccess(data));
        navigate("/order-admin");
      } else if (res.status === 906) {
        dispatch(signInSuccess(data));
        navigate("/farmerRequest");
      } else if (res.status === 907) {
        dispatch(signInSuccess(data));
        navigate("/fm_layout/farmer-dashboard"); 
      } else if (res.status === 908) {
        dispatch(signInSuccess(data));
        navigate("/wh-manager/manager-dashboard");
      }else if (res.status === 909) {
        dispatch(signInSuccess(data));
        navigate("/admin/admin-dashboard");
      }
      else {
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

          {/* Role Selection */}
          <div className="flex flex-col">
            <div
              className={`flex items-center border ${
                errors.role ? "border-red-500" : "border-green-300"
              } py-2 px-3 rounded-lg focus-within:border-green-500`}
            >
              <FaUserTie
                className={`mr-3 ${
                  errors.role ? "text-red-500" : "text-green-500"
                }`}
              />
              <select
                id="role"
                value={formData.role || ""}
                style={{ outline: "none", boxShadow: "none" }}
                onChange={handleRoleChange}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-600"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.label} value={role.label}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.role && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <span className="text-xs">{errors.role}</span>
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
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeSignin;
