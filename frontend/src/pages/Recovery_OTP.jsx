import React, { useState, useEffect } from "react";
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

// OTPInput Component
function OTPInput({ otp, handleChange }) {
  return (
    <motion.div variants={fieldVariants} className="flex justify-center mb-4">
      <motion.input
        whileHover={{ borderColor: "#60A5FA", scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="w-full text-center h-12 text-md border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 hover:border-blue-300 text-gray-800 placeholder-gray-500 placeholder:font-semibold bg-white/50"
        type="text"
        id="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={6} // assuming OTP length is 6
        style={{ outline: "none", boxShadow: "none" }}
      />
    </motion.div>
  );
}

// Timer Component
function Timer({ timeLeft, setTimeLeft, setTimerColor, timerColor }) {
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

      // Change color to red and text size to small when time is less than or equal to 10 seconds
      if (timeLeft <= 10) {
        setTimerColor("text-red-600 text-sm font-medium");
      }

      return () => clearTimeout(timerId);
    }
  }, [timeLeft, setTimeLeft, setTimerColor]);

  return (
    <motion.div
      variants={fieldVariants}
      className={`text-center text-sm font-medium ${timerColor}`}
    >
      {timeLeft > 0 ? (
        <>
          OTP expires in: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </>
      ) : (
        <>OTP expired, please click resend to get a new OTP.</>
      )}
    </motion.div>
  );
}

// RecoverOTP Component
function RecoverOTP() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(150); // 150 seconds = 2:30
  const [timerColor, setTimerColor] = useState("text-gray-800");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setOtp(numericValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiURL + "/api/user/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        navigate("/recovery-password");
      } else if (res.status === 400) {
        toast.error("Session expired. Please enter email again");
      } else if (res.status === 401) {
        toast.error("OTP expired");
      } else if (res.status === 402) {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred while verifying the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setOtp("");
    setTimeLeft(150);
    setTimerColor("text-gray-800");

    try {
      const res = await fetch(apiURL + "/api/user/recovery/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        toast.success("OTP resent to your email");
      } else if (res.status === 400) {
        toast.error("Session expired or user not found");
      }
    } catch (error) {
      toast.error("An error occurred while resending the OTP.");
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
          Verify Your OTP
        </motion.h2>
        <motion.p
          variants={fieldVariants}
          className="text-sm text-center text-gray-800 mb-6"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          We've sent a one-time password to your email. Please enter the code
          below to verify your identity and continue.
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <OTPInput otp={otp} handleChange={handleChange} />
          <Timer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            setTimerColor={setTimerColor}
            timerColor={timerColor}
          />
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
              "Verify OTP"
            )}
          </motion.button>
        </form>
        <motion.div
          variants={fieldVariants}
          className="text-center mt-4"
        >
          <p className="text-gray-800 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
            Can't get OTP?{" "}
            <motion.span
              whileHover={{ scale: 1.05, color: "#F59E0B" }}
              whileTap={{ scale: 0.95 }}
              className="text-orange-500 cursor-pointer hover:underline font-medium"
              onClick={handleResendOTP}
            >
              Resend
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}

export default RecoverOTP;