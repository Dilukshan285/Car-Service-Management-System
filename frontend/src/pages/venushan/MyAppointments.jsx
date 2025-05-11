import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { CalendarIcon, CarIcon, ClockIcon, UserIcon, WrenchIcon, FileTextIcon } from "lucide-react";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      console.log("No user in Redux store, redirecting to sign-in");
      navigate("/sign-in");
    } else {
      console.log("User authenticated via Redux:", currentUser);
      fetchAppointments();
    }
  }, [currentUser, navigate]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:5000/api/appointments/my-appointments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("My Appointments response (full):", data);

      if (response.ok && data.success) {
        setAppointments(data.data || []);
        console.log("Appointments state after update:", data.data);
      } else {
        throw new Error(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:5000/api/appointments/delete/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("Cancel Appointment response:", data);

      if (response.ok && data.success) {
        setAppointments(appointments.filter((appt) => appt._id !== appointmentId));
      } else {
        throw new Error(data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setError(err.message);
    }
  };

  const toggleExpandCard = (appointmentId) => {
    setExpandedCard(expandedCard === appointmentId ? null : appointmentId);
  };

  const handleViewProgress = (appointment) => {
    navigate(`/service-details/${appointment.carNumberPlate}`, {
      state: { ...appointment, readOnly: true },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-900";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-7xl w-full mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Appointments</h2>
          <p className="text-sm text-gray-500 mt-2">View and manage your scheduled car service appointments with ease.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
            <span className="ml-3 text-lg text-gray-700 font-medium">Loading your appointments...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8 text-lg font-medium">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="text-gray-500 text-lg font-medium mt-4">You have no appointments scheduled.</p>
            <p className="text-gray-400 mt-2">Book a new appointment to get started!</p>
            <button
              onClick={() => navigate("/book-appointment")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <CarIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {appointment.make || "Unknown"} {appointment.model || "Unknown"} ({appointment.year || "N/A"})
                      </h3>
                      <p className="text-sm text-gray-500">Plate: {appointment.carNumberPlate || "N/A"}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status || "Pending"
                    )}`}
                  >
                    {appointment.status || "Pending"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <WrenchIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm">
                      <span className="font-medium">Service:</span>{" "}
                      {appointment.serviceType?.name || appointment.serviceType || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {appointment.appointmentDate && !isNaN(new Date(appointment.appointmentDate).getTime())
                        ? format(new Date(appointment.appointmentDate), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {appointment.appointmentTime || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm">
                      <span className="font-medium">Worker:</span>{" "}
                      {appointment.worker?.fullName || "Not Assigned"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileTextIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {appointment.notes || "None"}
                    </p>
                  </div>
                </div>

                {expandedCard === appointment._id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Created At:</span>{" "}
                      {appointment.createdAt && !isNaN(new Date(appointment.createdAt).getTime())
                        ? format(new Date(appointment.createdAt), "PPPp")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Updated At:</span>{" "}
                      {appointment.updatedAt && !isNaN(new Date(appointment.updatedAt).getTime())
                        ? format(new Date(appointment.updatedAt), "PPPp")
                        : "N/A"}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center space-x-2">
                  <button
                    onClick={() => toggleExpandCard(appointment._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                  >
                    {expandedCard === appointment._id ? "Hide Details" : "View Details"}
                  </button>
                  <div className="flex space-x-2">
                    {(appointment.isAcceptedByWorker || appointment.status === "Completed") && appointment.status !== "Cancelled" && (
                      <button
                        onClick={() => handleViewProgress(appointment)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                      >
                        View Progress
                      </button>
                    )}
                    {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;