import React from "react";
import { useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase.jsx";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import {toast, ToastContainer} from 'react-toastify'

const apiURL = "http://localhost:5000";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
  
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      setLoading(true);
  
      // Extracting user information
      const displayName = resultFromGoogle.user.displayName || "";
      const [firstName, lastName] = displayName.split(" ");
      const email = resultFromGoogle.user.email || "";
      const googlePhotoUrl = resultFromGoogle.user.photoURL
        ? `${resultFromGoogle.user.photoURL}?timestamp=${new Date().getTime()}`
        : "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180"; // Fallback image
  
      // Sending user details to the backend
      const res = await fetch(apiURL + "/api/user/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          googlePhotoUrl, // Ensure this is sent
        }),
        credentials: "include",
      });
  
      const data = await res.json();
      console.log("Response data:", data); // Debug the response
  
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        toast.error("Failed to sign in with Google. Please try again.");
      }
    } catch (error) {
      toast.error("Unexpected error, please try again later");
      console.log("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="font-semibold transition duration-300 w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 active:bg-red-700 focus:outline-none focus:shadow-outline flex items-center justify-center"
        onClick={handleGoogleClick}
        disabled={loading}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" /> Continue with Google
      </button>

      {/* Show bar loader when processing */}
      {loading && (
        <>
          {/* Background dimming */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Bar Loader placed below the navbar */}
          <div
            className="fixed top-16 left-0 right-0 z-50"
            style={{ height: "4px" }}
          >
            <BarLoader
              color="#3b82f6"
              loading={loading}
              width="100%"
              height={4}
            />
          </div>
          <ToastContainer/>
        </>
      )}
    </>
  );
}
