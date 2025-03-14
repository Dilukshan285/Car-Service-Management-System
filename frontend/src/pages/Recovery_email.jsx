import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
const apiURL = "http://localhost:5000";

const RecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomainTypos = ["gamil.com", "hotnail.com", "yahhoo.com"];
    const validTLDs = [".com", ".net", ".org", ".edu", ".lk"];

    if (!value) {
      return "Email is required";
    }

    if (!emailPattern.test(value)) {
      return "Please enter a valid email address";
    }

    // Check for common domain typos
    const domain = value.split("@")[1];
    for (let typo of commonDomainTypos) {
      if (domain.includes(typo)) {
        return `Did you mean "${domain.replace(
          /gamil|hotnail|yahhoo/,
          "gmail.com"
        )}"?`;
      }
    }

    // Check for incomplete TLDs (e.g., ".c")
    const tld = domain.substring(domain.lastIndexOf("."));
    if (!validTLDs.includes(tld)) {
      return "Please enter a complete domain (e.g., .com, .net, .org, .edu, .lk)";
    }

    return ""; // No error
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Validate the email and set error message if any
    const error = validateEmail(newEmail);
    setEmailError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required."); // Set the error message for empty email
      toast.error("Please fill out all required fields.");
      return;
    }

    if (emailError) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiURL + "/api/user/requestOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        navigate("/recovery-OTP");
      } else if (res.status === 404) {
        toast.error("User not found. Please enter registered email address.");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg w-full max-w-sm shadow-lg border border-green-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Recovery
        </h2>
        <p className="text-sm text-center text-gray-500 mb-9">
          We will sent a one-time password to your email. Please enter the
          register email below to verify your identity and reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
              <FaEnvelope
                className={`absolute left-3 top-4 ${
                  emailError ? "text-red-500" : "text-green-400"
                }`}
              />
            </span>
            <input
              type="email"
              id="email"
              value={email}
              autoComplete="off"
              onChange={handleEmailChange}
              placeholder="Email"
              className={`w-full h-12 pl-10 text-md border rounded focus:outline-none focus:ring-1 
                border-green-400 focus:ring-green-400 focus:border-green-400 
                hover:border-green-500 text-gray-700`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p> // Display the error in red
            )}
          </div>
          <button
            type="submit"
            className="transition duration-300 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="white" size={20} />
                <span className="pl-3">Loading...</span>
              </div>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RecoveryPage;
