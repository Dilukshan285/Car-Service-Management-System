import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
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
      setEmailError("Email is required.");
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
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-lg shadow-lg p-8 rounded-2xl w-full max-w-sm border border-gray-100 hover:border-blue-300 transition-all duration-300"
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
          Recover Your Account
        </motion.h2>
        <motion.p
          variants={fieldVariants}
          className="text-sm text-center text-gray-800 mb-6"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          We will send a one-time password to your email. Please enter your
          registered email below to verify your identity and reset your password.
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={fieldVariants} className="relative">
            <motion.div
              whileHover={{ borderColor: "#60A5FA", scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center border ${
                emailError ? "border-red-600" : "border-gray-200"
              } py-2 px-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-transparent transition-all bg-white/50`}
            >
              <FaEnvelope
                className={`mr-3 ${
                  emailError ? "text-red-600" : "text-blue-400"
                } text-lg`}
              />
              <input
                type="email"
                id="email"
                value={email}
                autoComplete="off"
                onChange={handleEmailChange}
                placeholder="Email"
                className="appearance-none bg-transparent border-none w-full text-gray-800 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 placeholder:font-semibold text-base"
                style={{ outline: "none", boxShadow: "none" }}
              />
            </motion.div>
            {emailError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center mt-2 text-red-600 text-sm font-medium"
              >
                <span className="text-sm">{emailError}</span>
              </motion.div>
            )}
          </motion.div>

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
              "Verify Email"
            )}
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default RecoveryPage;