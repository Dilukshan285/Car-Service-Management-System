import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Ensure ToastContainer is imported
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
// OTPInput Component
function OTPInput({ otp, handleChange }) {
  return (
    <div className="flex justify-center mb-4">
      <input
        className="w-full text-center h-12  text-md border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 hover:border-green-500 text-gray-700"
        type="text"
        id="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={6} // assuming OTP length is 6
      />
    </div>
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
    <div className={`text-center text-sm font-bold ${timerColor}`}>
      {timeLeft > 0 ? (
        <>
          OTP expires in: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </>
      ) : (
        <>OTP expired, please click resend to get a new OTP.</>
      )}
    </div>
  );
}

// OTPPage Component
function OTPPage() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(150); // 150 seconds = 2:30
  const [timerColor, setTimerColor] = useState("text-black");
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
      toast.error("Please enter OTP."); // Displays the error message if OTP is empty
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
        // Delay the navigation for 3 seconds after the success message is shown
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    } catch (error) {
      toast.error("An error occurred while verifying the OTP.");
    } finally {
      setLoading(false); // Ensure loading is stopped regardless of the outcome
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setOtp(""); // Reset OTP input field immediately
    setTimeLeft(150); // Reset the timer to 2.5 minutes immediately
    setTimerColor("text-black"); // Reset timer color to black immediately

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
        toast.error("Session expired Please Signup again.");
      }
    } catch (error) {
      toast.error("An error occurred while resending the OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm border border-green-300">
        <h2 className="text-2xl font-bold text-center mb-6">
          Enter Your One-Time Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We've sent a one-time password to your email. Please enter the code
          below to verify your identity and continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <OTPInput otp={otp} handleChange={handleChange} />
          <Timer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            setTimerColor={setTimerColor}
            timerColor={timerColor}
          />
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
              "Verify OTP"
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Can't get OTP?{" "}
            <span
              className="text-red-500 cursor-pointer hover:underline"
              onClick={handleResendOTP}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </div>
  );
}

export default OTPPage;
