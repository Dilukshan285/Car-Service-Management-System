import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CalendarIcon, Upload, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { jsPDF } from "jspdf";
import axios from "axios";

const BookingForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    carNumberPlate: "",
    mileage: "",
    serviceType: "",
    appointmentDate: null,
    appointmentTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Fetch service types from API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/service-types");
        setServiceTypes(response.data.data || []);
        if (response.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, serviceType: response.data.data[0]._id }));
          setSelectedService(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };
    fetchServiceTypes();
  }, []);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      console.log("No user in Redux store, redirecting to sign-in");
      navigate("/sign-in");
    } else {
      console.log("User authenticated via Redux:", currentUser);
    }
  }, [currentUser, navigate]);

  // Generate time slots based on service duration
  useEffect(() => {
    if (!selectedService || !selectedService.estimatedTime) {
      setAvailableTimeSlots([]);
      return;
    }

    const durationMinutes = parseInt(selectedService.estimatedTime);
    const durationHours = Math.ceil(durationMinutes / 60); // Round up to nearest hour

    // Define working hours (9:00 AM to 5:00 PM)
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    const timeSlots = [];

    // Generate time slots based on duration
    for (let hour = startHour; hour + durationHours <= endHour; ) {
      const startTimeHour = hour;
      const endTimeHour = hour + durationHours;

      // Format start time
      const startPeriod = startTimeHour >= 12 ? "PM" : "AM";
      const startHourFormatted = startTimeHour > 12 ? startTimeHour - 12 : startTimeHour === 0 ? 12 : startTimeHour;
      const startTime = `${startHourFormatted}:00 ${startPeriod}`;

      // Format end time
      const endPeriod = endTimeHour >= 12 ? "PM" : "AM";
      const endHourFormatted = endTimeHour > 12 ? endTimeHour - 12 : endTimeHour === 0 ? 12 : endTimeHour;
      const endTime = `${endHourFormatted}:00 ${endPeriod}`;

      // Create slot (e.g., "9:00 AM - 10:00 AM" for 60 minutes)
      const slot = `${startTime} - ${endTime}`;
      timeSlots.push({ display: slot, start: `${startTimeHour.toString().padStart(2, "0")}:00` });

      // Increment hour based on duration
      hour += durationHours;

      // Adjust for lunch break (12:00 PM to 1:00 PM)
      if (hour >= 12 && hour < 13) {
        hour = 13; // Skip to 1:00 PM
      }
    }

    setAvailableTimeSlots(timeSlots);

    // Reset appointmentTime if current selection is invalid
    if (!timeSlots.some((slot) => slot.start === formData.appointmentTime)) {
      setFormData((prev) => ({ ...prev, appointmentTime: timeSlots[0]?.start || "" }));
    }
  }, [selectedService]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleServiceTypeChange = (e) => {
    const serviceId = e.target.value;
    setFormData((prev) => ({ ...prev, serviceType: serviceId }));
    const service = serviceTypes.find((s) => s._id === serviceId);
    setSelectedService(service);
  };

  const handleDateSelect = (newDate) => {
    setFormData((prev) => ({ ...prev, appointmentDate: newDate }));
    setIsCalendarOpen(false);
  };

  const handleTimeChange = (e) => {
    const selectedSlot = availableTimeSlots.find((slot) => slot.display === e.target.value);
    setFormData((prev) => ({ ...prev, appointmentTime: selectedSlot ? selectedSlot.start : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate("/my-bookings");
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
    const selectedSlot = availableTimeSlots.find((slot) => slot.start === formData.appointmentTime);
    doc.text(`Time: ${selectedSlot ? selectedSlot.display : "Not selected"}`, 20, 80);
    doc.text(`Service Type: ${selectedService?.name || "Not selected"}`, 20, 90);
    doc.text(
      `Duration: ${selectedService?.estimatedTime ? `${Math.ceil(selectedService.estimatedTime / 60)} hour(s)` : "N/A"}`,
      20,
      100
    );
    doc.text("Car Details:", 20, 110);
    doc.text(`Make: ${formData.make || "Not provided"}`, 20, 120);
    doc.text(`Model: ${formData.model || "Not provided"}`, 20, 130);
    doc.text(`Year: ${formData.year || "Not provided"}`, 20, 140);
    doc.text(`License Plate: ${formData.carNumberPlate || "Not provided"}`, 20, 150);
    doc.text(`Mileage: ${formData.mileage || "Not provided"}`, 20, 160);
    doc.text(`Notes: ${formData.notes || "None"}`, 20, 170);
    doc.setLineWidth(0.5);
    doc.line(20, 180, 190, 180);
    doc.text("Thank you for choosing RevUp Car Service!", 20, 190);
    doc.text("We look forward to serving you.", 20, 200);
    doc.save("appointment-receipt.pdf");
  };

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
            <div className="space-y-4">
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={handleServiceTypeChange}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
              >
                {serviceTypes.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {selectedService && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 mb-2">{selectedService.description}</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Estimated Duration: {Math.ceil(selectedService.estimatedTime / 60)} hour(s)
                  </p>
                  <h4 className="text-sm font-semibold text-gray-800 mt-2">Features:</h4>
                  <ul className="list-none pl-0 mt-1 space-y-1">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-2 animate-fade-in">
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
                  value={availableTimeSlots.find((slot) => slot.start === formData.appointmentTime)?.display || ""}
                  onChange={handleTimeChange}
                  disabled={availableTimeSlots.length === 0}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select a time slot</option>
                  {availableTimeSlots.map((slot, index) => (
                    <option key={index} value={slot.display}>
                      {slot.display}
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