import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

// Animation variants for staggered form elements
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

// OTPInput Component
function OTPInput({ otp, handleChange }) {
  return (
    <motion.div variants={fieldVariants} className="flex justify-center mb-4">
      <motion.input
        whileHover={{ borderColor: "#93C5FD" }}
        transition={{ duration: 0.3 }}
        className={`w-full text-center h-12 text-md border ${
          otp ? "border-blue-400" : "border-gray-200"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500 placeholder:font-semibold focus:border-blue-400 hover:border-blue-300 text-gray-700 transition-all`}
        type="text"
        id="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={6} // assuming OTP length is 6
      />
    </motion.div>
  );
}

// Timer Component
function Timer({ timeLeft, setTimeLeft, setTimerColor, timerColor }) {
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

      // Change color to red and text size to small when time is less than or equal to 10 seconds
      if (timeLeft <= 10) {
        setTimerColor("text-red-500 text-sm");
      }

      return () => clearTimeout(timerId);
    }
  }, [timeLeft, setTimeLeft, setTimerColor]);

  return (
    <motion.div
      variants={fieldVariants}
      className={`text-center text-sm font-semibold ${timerColor}`}
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

// OTPPage Component
function OTPPage() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(150); // 150 seconds = 2:30
  const [timerColor, setTimerColor] = useState("text-gray-600");
  const [loading, setLoading] = useState(false);
  const apiURL = "http://localhost:5000";
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
      const res = await fetch(apiURL + "/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      console.log(data);

      if (
        res.status === 400 &&
        data.message.trim() === "Session expired or User not found"
      ) {
        toast.error("Session expired. Please sign up again.");
      } else if (
        res.status === 401 &&
        data.message.trim() ===
          "OTP has expired. Click Resend Button To Get OTP"
      ) {
        toast.error("OTP has expired. Click Resend Button to get a new OTP.");
      } else if (res.status === 402 && data.message.trim() === "Invalid OTP") {
        toast.error("Invalid OTP.");
      } else if (
        res.status === 200 &&
        data.message.trim() === "User Registration Success"
      ) {
        toast.success("User registration successful!");
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
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
    setTimerColor("text-gray-600");

    try {
      const res = await fetch(apiURL + "/api/user/resend/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success("OTP resent to your email");
      } else if (
        res.status === 400 &&
        data.message.trim() === "Session expired or User not found"
      ) {
        toast.error("Session expired. Please sign up again.");
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
        className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-8 rounded-2xl w-full max-w-sm border border-gray-200 hover:border-blue-200 transition-all duration-300"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-extrabold text-center mb-4 text-blue-700"
        >
          Enter Your One-Time Password
        </motion.h2>
        <motion.p
          variants={fieldVariants}
          className="text-center text-gray-500 mb-6 text-sm"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex justify-center items-center transition-colors text-base"
            disabled={loading}
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
          <p className="text-gray-500 text-sm">
            Can't get OTP?{" "}
            <motion.span
              whileHover={{ scale: 1.05 }}
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

export default OTPPage;