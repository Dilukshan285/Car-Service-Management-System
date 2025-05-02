import React, { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  resetLoadingState,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice.js";
import { ClipLoader } from "react-spinners";
import { validateProfile } from "../Validation/validation_profile.jsx";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [area, setArea] = useState({ area: currentUser.area || "" });
  const [district, setDistrict] = useState({ district: currentUser.district || "" });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize formData with proper mobile number handling
  const [formData, setFormData] = useState({
    firstName: currentUser.first_name || "",
    lastName: currentUser.last_name || "",
    email: currentUser.email || "",
    mobileNumber: currentUser.mobile
      ? String(currentUser.mobile).replace(/^\+94\s?94/, "") // Remove +94, any space, and the leading 94
      : "",
    postalCode: currentUser.postal || "",
    address: currentUser.address || "",
  });

  const filePickerRef = useRef();

  const handlePostalCodeChange = (e) => {
    handleChange(e);
    const postalCode = e.target.value.trim();

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const newTimeout = setTimeout(async () => {
      if (postalCode.length >= 3 && postalCode.length <= 5) {
        try {
          const response = await fetch(
            `https://parseapi.back4app.com/classes/LK_LK?where={"postalCode":"${postalCode}"}&limit=1&keys=place,admin2`,
            {
              headers: {
                "X-Parse-Application-Id": "LkjLMkf2Jz8R8tnb49JaMRt9IIaW4eJC12ZZ8Bos",
                "X-Parse-REST-API-Key": "PEiQXCC7epFXpawKFRHhnUxu7MCmmCw9cwx2ok8j",
              },
            }
          );

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            setArea({ area: data.results[0].place || "" });
            setDistrict({ district: data.results[0].admin2 || "" });
          } else {
            setArea({ area: "" });
            setDistrict({ district: "" });
            toast.error("No results found for postal code");
          }
        } catch (error) {
          console.error("Error fetching postal code data:", error);
          toast.error("Failed to fetch postal code data. Please try again.");
          setArea({ area: "" });
          setDistrict({ district: "" });
        }
      } else {
        setArea({ area: "" });
        setDistrict({ district: "" });
      }
    }, 300);

    setDebounceTimeout(newTimeout);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validFileTypes.includes(file.type)) {
        return toast.error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      }
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File size exceeds the 2MB limit. Please upload a smaller image.");
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setIsModified(true);
    }
  };

  useEffect(() => {
    dispatch(resetLoadingState());
  }, [dispatch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id === "firstName" || id === "lastName") {
      updatedValue = value.replace(/[^A-Za-z]/g, "");
    } else if (id === "postalCode") {
      updatedValue = value.replace(/[^0-9]/g, "");
    } else if (id === "mobileNumber") {
      updatedValue = value.replace(/[^0-9]/g, "");
      if (updatedValue.length > 9) {
        updatedValue = updatedValue.slice(0, 9);
      }
    }

    setFormData({ ...formData, [id]: updatedValue });

    const validationErrors = validateProfile(id, updatedValue);
    if ((id === "firstName" || id === "lastName" || id === "email") && !updatedValue) {
      setErrors({ ...errors, ...validationErrors });
    } else {
      const { [id]: removedError, ...restErrors } = errors;
      if (Object.keys(validationErrors).length === 0) {
        setErrors(restErrors);
      } else {
        setErrors({ ...errors, ...validationErrors });
      }
    }
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = ["firstName", "lastName", "email", "mobileNumber", "postalCode", "address"];
    let validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateProfile(field, formData[field] || "");
      if (Object.keys(fieldError).length > 0) {
        validationErrors = { ...validationErrors, ...fieldError };
      }
    });

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct all errors before saving.");
      return;
    }

    if (formData.mobileNumber && !/^[0-9]{9}$/.test(formData.mobileNumber)) {
      setErrors({ ...errors, mobileNumber: "Mobile number must be 9 digits (e.g., 771234567)" });
      toast.error("Mobile number must be 9 digits (e.g., 771234567)");
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    if (formData.mobileNumber) {
      data.append("mobile", formData.mobileNumber);
    }
    if (formData.postalCode) data.append("postal", formData.postalCode);
    if (formData.address) data.append("address", formData.address);
    if (area.area) data.append("area", area.area);
    if (district.district) data.append("district", district.district);
    if (imageFile) data.append("avatar", imageFile);

    try {
      dispatch(updateStart());
      const res = await fetch(`${apiURL}/api/auth/update/${currentUser._id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        dispatch(updateSuccess(result.data));
        toast.success("Profile updated successfully");
        setIsModified(false);
      } else {
        dispatch(updateFailure(result.message));
        switch (res.status) {
          case 400:
            toast.error(result.message || "File upload error");
            break;
          case 403:
            toast.error(result.message || "You are not allowed to update this user");
            break;
          case 404:
            toast.error(result.message || "Mobile number already exists. Please use a different number.");
            break;
          case 405:
            toast.error(result.message || "Email already exists. Please use a different email.");
            break;
          default:
            toast.error(result.message || "Failed to update profile");
        }
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("An error occurred while updating the profile");
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${apiURL}/api/auth/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteUserSuccess(data));
        toast.success("User deleted successfully");
      } else {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("An error occurred while deleting the user");
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${apiURL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        data = { message: "Server error" };
      }
      if (!res.ok) {
        console.error("Signout failed:", data?.message || "Unknown error");
        toast.error(data?.message || "Failed to sign out");
      } else {
        dispatch(signoutSuccess());
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error("Signout error:", error.message);
      toast.error("An error occurred during signout");
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
          Profile
        </motion.h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <motion.div variants={fieldVariants} className="flex justify-center mb-3">
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
                onChange={handleImageChange}
                ref={filePickerRef}
                style={{ display: "none" }}
              />
              <label htmlFor="profilePicture" className="cursor-pointer">
                {imageFileUrl || currentUser.avatar ? (
                  <img
                    src={
                      imageFileUrl ||
                      currentUser.avatar ||
                      "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180"
                    }
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
          <motion.p variants={fieldVariants} className="text-center text-sm text-gray-500">
            Update your profile picture
          </motion.p>

          {/* First Name and Last Name Fields */}
          <motion.div variants={fieldVariants} className="flex flex-row space-x-4">
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className={`flex items-center border ${
                  errors.firstName ? "border-red-500" : "border-gray-200"
                } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
              >
                <FaUser
                  className={`mr-3 ${errors.firstName ? "text-red-500" : "text-blue-400"}`}
                />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
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
                  className={`mr-3 ${errors.lastName ? "text-red-500" : "text-blue-400"}`}
                />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
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
                className={`mr-3 ${errors.email ? "text-red-500" : "text-blue-400"}`}
              />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
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

          {/* Mobile Number and Postal Code Fields */}
          <motion.div variants={fieldVariants} className="flex flex-row space-x-4">
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className={`flex items-center border ${
                  errors.mobileNumber ? "border-red-500" : "border-gray-200"
                } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
              >
                <FaPhone
                  className={`mr-3 ${errors.mobileNumber ? "text-red-500" : "text-blue-400"}`}
                />
                <span className="text-gray-700">+94</span>
                <input
                  type="text"
                  id="mobileNumber"
                  placeholder="771234567"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                  autoComplete="off"
                />
              </motion.div>
              {errors.mobileNumber && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center mt-3 text-red-500 text-sm h-4"
                >
                  <span className="text-sm">{errors.mobileNumber}</span>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className={`flex items-center border ${
                  errors.postalCode ? "border-red-500" : "border-gray-200"
                } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
              >
                <FaMapMarkerAlt
                  className={`mr-3 ${errors.postalCode ? "text-red-500" : "text-blue-400"}`}
                />
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                  autoComplete="off"
                />
              </motion.div>
              {errors.postalCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center mt-3 text-red-500 text-sm h-4"
                >
                  <span className="text-sm">{errors.postalCode}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Area and District Fields */}
          <motion.div variants={fieldVariants} className="flex flex-row space-x-4">
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className="flex items-center border border-gray-200 py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all"
              >
                <FaMapMarkerAlt className="mr-3 text-blue-400" />
                <input
                  type="text"
                  id="area"
                  placeholder="Area"
                  value={area.area}
                  readOnly
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                />
              </motion.div>
            </div>
            <div className="flex flex-col w-full">
              <motion.div
                whileHover={{ borderColor: "#93C5FD" }}
                transition={{ duration: 0.3 }}
                className="flex items-center border border-gray-200 py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all"
              >
                <FaMapMarkerAlt className="mr-3 text-blue-400" />
                <input
                  type="text"
                  id="district"
                  placeholder="District"
                  value={district.district}
                  readOnly
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Address Field */}
          <motion.div variants={fieldVariants} className="flex flex-col">
            <motion.div
              whileHover={{ borderColor: "#93C5FD" }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                errors.address ? "border-red-500" : "border-gray-200"
              } py-2 px-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all`}
            >
              <FaMapMarkerAlt
                className={`mr-3 ${errors.address ? "text-red-500" : "text-blue-400"}`}
              />
              <input
                type="text"
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-500 placeholder:font-semibold text-base"
                autoComplete="off"
              />
            </motion.div>
            {errors.address && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-3 text-red-500 text-sm h-4"
              >
                <span className="text-sm">{errors.address}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={fieldVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-blue-500 text-white py-2.5 rounded-lg font-semibold ${
              !isModified || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex justify-center items-center transition-colors text-base`}
            disabled={!isModified || loading}
          >
            {loading ? (
              <>
                <div className="mt-0.5">
                  <ClipLoader color="#ffffff" size={20} loading={loading} />
                </div>
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </motion.button>

          {/* Delete Account and Sign Out */}
          <motion.div
            variants={fieldVariants}
            className="flex justify-between mt-3 text-sm text-gray-500"
          >
            <span
              className="text-orange-500 hover:underline font-medium cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              Delete Account
            </span>
            <span
              className="text-orange-500 hover:underline font-medium cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </span>
          </motion.div>
        </form>
      </motion.div>
      <ToastContainer />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="sm"
        className="flex justify-center items-center bg-gray-900 bg-opacity-75"
      >
        <Modal.Header className="border-b-0 p-4" />
        <Modal.Body className="px-4 py-6 bg-white rounded-lg shadow-lg relative max-w-md mx-auto">
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-12 w-12 text-red-600 mb-4 mx-auto" />
            <h3 className="mb-4 text-xl text-gray-800 font-semibold">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={handleDeleteUser}
              >
                Yes, delete it
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;