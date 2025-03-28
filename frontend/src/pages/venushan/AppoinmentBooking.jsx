import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { jsPDF } from "jspdf";

const BookingForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    carNumberPlate: "",
    mileage: "",
    serviceType: "regular",
    appointmentDate: null,
    appointmentTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      console.log("No user in Redux store, redirecting to sign-in");
      navigate("/sign-in");
    } else {
      console.log("User authenticated via Redux:", currentUser);
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleServiceTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, serviceType: e.target.value }));
  };

  const handleDateSelect = (newDate) => {
    setFormData((prev) => ({ ...prev, appointmentDate: newDate }));
    setIsCalendarOpen(false);
  };

  const handleTimeChange = (e) => {
    const timeStr = e.target.value;
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (period === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (period === "AM" && hours === "12") hours = "00";
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
    setFormData((prev) => ({ ...prev, appointmentTime: formattedTime }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double-check authentication before proceeding
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("access_token");
    console.log("Token for booking:", token);

    try {
      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          appointmentDate: formData.appointmentDate
            ? format(formData.appointmentDate, "yyyy-MM-dd")
            : null,
        }),
      });

      const data = await response.json();
      console.log("Booking response:", data);

      if (response.ok && data.success) {
        navigate("/");
      } else {
        throw new Error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Car Service Appointment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text("RevUp Car Service", 20, 30);
    doc.text("123 Auto Service Lane, Cartown, CT 12345", 20, 35);
    doc.text("Phone: (555) 123-4567", 20, 40);
    doc.text("Email: info@autocarecenter.com", 20, 45);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    doc.text("Appointment Details", 20, 60);
    doc.text(
      `Date: ${formData.appointmentDate ? format(formData.appointmentDate, "PPP") : "Not selected"}`,
      20,
      70
    );
    doc.text(`Time: ${formData.appointmentTime || "Not selected"}`, 20, 80);
    doc.text(`Service Type: ${formData.serviceType || "Not selected"}`, 20, 90);
    doc.text("Car Details:", 20, 100);
    doc.text(`Make: ${formData.make || "Not provided"}`, 20, 110);
    doc.text(`Model: ${formData.model || "Not provided"}`, 20, 120);
    doc.text(`Year: ${formData.year || "Not provided"}`, 20, 130);
    doc.text(`License Plate: ${formData.carNumberPlate || "Not provided"}`, 20, 140);
    doc.text(`Mileage: ${formData.mileage || "Not provided"}`, 20, 150);
    doc.text(`Notes: ${formData.notes || "None"}`, 20, 160);
    doc.setLineWidth(0.5);
    doc.line(20, 170, 190, 170);
    doc.text("Thank you for choosing RevUp Car Service!", 20, 180);
    doc.text("We look forward to serving you.", 20, 190);
    doc.save("appointment-receipt.pdf");
  };

  const availableTimes = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Book Your Service Appointment</h2>
          <p className="text-sm text-gray-600 mt-1">Schedule your car service with ease—fill out the details below!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Car Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="make" className="text-sm font-semibold text-gray-800">Make</label>
                <input
                  id="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="Toyota"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-semibold text-gray-800">Model</label>
                <input
                  id="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Camry"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-semibold text-gray-800">Year</label>
                <input
                  id="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2020"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="carNumberPlate" className="text-sm font-semibold text-gray-800">License Plate</label>
                <input
                  id="carNumberPlate"
                  value={formData.carNumberPlate}
                  onChange={handleInputChange}
                  placeholder="ABC-1234"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="mileage" className="text-sm font-semibold text-gray-800">Current Mileage</label>
                <input
                  id="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="50,000"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Service Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { value: "regular", label: "Regular Maintenance", desc: "Oil change, filter replacement, inspection" },
                { value: "major", label: "Major Service", desc: "Full inspection, fluids, filters, brakes" },
                { value: "repair", label: "Repair Service", desc: "Fix specific issues with your vehicle" },
                { value: "diagnostic", label: "Diagnostic Check", desc: "Computer diagnostics and inspection" },
              ].map((service) => (
                <label
                  key={service.value}
                  className="flex items-start space-x-3 border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={service.value}
                    checked={formData.serviceType === service.value}
                    onChange={handleServiceTypeChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{service.label}</div>
                    <div className="text-sm text-gray-600">{service.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Car Images</h3>
                <p className="text-sm text-gray-600">Optional: Upload photos of your car and we can address the damage via AI</p>
              </div>
              <Link to="/AI">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
                >
                  <Upload className="h-5 w-5" />
                  Upload Images
                </button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Appointment Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-semibold text-gray-800">Preferred Date</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full flex items-center justify-start border border-gray-300 rounded-lg p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-gray-600" />
                    {formData.appointmentDate
                      ? format(formData.appointmentDate, "PPP")
                      : "Select a date"}
                  </button>
                  {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 p-2 animate-fade-in">
                      <DayPicker
                        mode="single"
                        selected={formData.appointmentDate}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                        }
                        className="text-gray-800"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-semibold text-gray-800">Preferred Time</label>
                <select
                  id="time"
                  value={availableTimes.find((t) => {
                    const [time, period] = t.split(" ");
                    let [hours, minutes] = time.split(":");
                    if (period === "PM" && hours !== "12") hours = parseInt(hours) + 12;
                    if (period === "AM" && hours === "12") hours = "00";
                    return `${hours.toString().padStart(2, "0")}:${minutes}` === formData.appointmentTime;
                  }) || ""}
                  onChange={handleTimeChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-gray-800">Additional Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Describe any specific issues or concerns about your vehicle"
              className="w-full min-h-[120px] rounded-lg border border-gray-300 p-4 text-gray-700 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-between items-center mt-10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Download PDF
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Booking...
                  </span>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BookingForm;