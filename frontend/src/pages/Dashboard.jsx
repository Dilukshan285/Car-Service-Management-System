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

const apiURL = "http://localhost:5000";

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
  const [formData, setFormData] = useState({
    firstName: currentUser.first_name || "",
    lastName: currentUser.last_name || "",
    email: currentUser.email || "",
    mobileNumber: currentUser.mobile || "",
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
      // Allow only digits and ensure the length is appropriate
      updatedValue = value.replace(/[^0-9]/g, "");
      if (updatedValue.length > 9) {
        updatedValue = updatedValue.slice(0, 9); // Limit to 9 digits (after +94)
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

    // Validate all fields
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

    // Validate mobile number format (Sri Lankan mobile number: 9 digits after +94)
    if (formData.mobileNumber && !/^[0-9]{9}$/.test(formData.mobileNumber)) {
      setErrors({ ...errors, mobileNumber: "Mobile number must be 9 digits (e.g., 771234567)" });
      toast.error("Mobile number must be 9 digits (e.g., 771234567)");
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    // Only append mobile if it's not empty
    if (formData.mobileNumber) {
      data.append("mobile", `+94${formData.mobileNumber}`); // Prepend +94
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
    <div className="bg-white flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-full max-w-md border-none mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-800">Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
          <div className="w-32 h-32 mx-auto rounded-full cursor-pointer" onClick={() => filePickerRef.current.click()}>
            <img
              src={imageFileUrl || currentUser.avatar || "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180"}
              alt="user"
              className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
            />
          </div>
          <p className="text-center text-sm">Update your profile picture</p>
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col">
              <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.firstName ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
                <FaUser className={`mr-3 ${errors.firstName ? "text-red-500" : "text-green-500"}`} />
                <input
                  type="text"
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  style={{ outline: "none", boxShadow: "none" }}
                  onChange={handleChange}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                  autoComplete="off"
                />
              </div>
              {errors.firstName && <div className="flex items-center mt-2 text-red-500 text-sm h-4"><span className="text-xs">{errors.firstName}</span></div>}
            </div>
            <div className="flex flex-col">
              <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.lastName ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
                <FaUser className={`mr-3 ${errors.lastName ? "text-red-500" : "text-green-500"}`} />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                  autoComplete="off"
                />
              </div>
              {errors.lastName && <div className="flex items-center mt-2 text-red-500 text-sm h-4"><span className="text-xs">{errors.lastName}</span></div>}
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col">
              <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.mobileNumber ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
                <FaPhone className={`mr-3 ${errors.mobileNumber ? "text-red-500" : "text-green-500"}`} />
                <span className="text-gray-700">+94</span>
                <input
                  type="text"
                  id="mobileNumber"
                  placeholder="771234567"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                  autoComplete="off"
                />
              </div>
              {errors.mobileNumber && <div className="flex items-center mt-2 text-red-500 text-sm h-4"><span className="text-xs">{errors.mobileNumber}</span></div>}
            </div>
            <div className="flex flex-col">
              <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.postalCode ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
                <FaMapMarkerAlt className={`mr-3 ${errors.postalCode ? "text-red-500" : "text-green-500"}`} />
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                  autoComplete="off"
                />
              </div>
              {errors.postalCode && <div className="flex items-center mt-2 text-red-500 text-sm h-4"><span className="text-xs">{errors.postalCode}</span></div>}
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col w-1/2">
              <div className="flex items-center border py-2 px-3 rounded-lg border-green-300 focus-within:border-green-500">
                <FaMapMarkerAlt className="mr-3 text-green-500" />
                <input
                  type="text"
                  id="area"
                  placeholder="Area"
                  value={area.area}
                  readOnly
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="flex items-center border py-2 px-3 rounded-lg border-green-300 focus-within:border-green-500">
                <FaMapMarkerAlt className="mr-3 text-green-500" />
                <input
                  type="text"
                  id="district"
                  placeholder="District"
                  value={district.district}
                  readOnly
                  style={{ outline: "none", boxShadow: "none" }}
                  className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.email ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
              <FaEnvelope className={`mr-3 ${errors.email ? "text-red-500" : "text-green-500"}`} />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                autoComplete="off"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <div className={`flex items-center border py-2 px-3 rounded-lg ${errors.address ? "border-red-500" : "border-green-300"} focus-within:border-green-500`}>
              <FaMapMarkerAlt className={`mr-3 ${errors.address ? "text-red-500" : "text-green-500"}`} />
              <input
                type="text"
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                style={{ outline: "none", boxShadow: "none" }}
                className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight placeholder-gray-600"
                autoComplete="off"
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <button
            type="submit"
            disabled={!isModified || loading}
            className={`w-full py-2 rounded-xl font-semibold ${isModified ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-800 cursor-not-allowed"} flex justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
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
          </button>
        </form>
        <div className="text-red-500 flex justify-between mt-2">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>Delete Account</span>
          <span className="cursor-pointer" onClick={handleSignout}>Sign Out</span>
        </div>
      </div>
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
            <h3 className="mb-4 text-xl text-gray-800 font-semibold">Are you sure you want to delete your account?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Your account and all associated data will be permanently deleted.</p>
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