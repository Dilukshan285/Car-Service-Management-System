import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import { FaSearch, FaTrash, FaUserPlus, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const apiURL = "http://localhost:5000";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/api/auth/getUsers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Failed to load users.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.email === "gspuser2002@gmail.com") {
      fetchUsers();
    } else {
      navigate("/unauthorized");
    }
  }, [currentUser, navigate, fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const nameMatch =
      `${user.first_name} ${user.last_name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    let roleMatch = true;
    if (filterRole === "User") {
      roleMatch = user.role.toLowerCase() === "user";
    } else if (filterRole === "Manager") {
      roleMatch = user.role.toLowerCase() !== "user";
    }

    let statusMatch = true;
    if (filterStatus === "Active") {
      statusMatch = user.status.toLowerCase() === "active";
    } else if (filterStatus === "Inactive") {
      statusMatch = user.status.toLowerCase() === "inactive";
    }

    return nameMatch && roleMatch && statusMatch;
  });

  const handleDeleteUser = async () => {
    try {
      // Optimistically remove the user from the state immediately
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));

      const res = await fetch(`${apiURL}/api/auth/delete/${selectedUserId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User deleted successfully");
      } else {
        // If there's an error, re-add the user back to the state
        setUsers((prev) => [...prev, selectedUserId]);
        toast.error(data.message || "Failed to delete user.");
      }
    } catch (error) {
      // In case of network or server errors
      toast.error("An error occurred. Please try again.");
      console.log(error.message);
    } finally {
      // Ensure the modal is closed, regardless of success or failure
      setShowModal(false);
    }
  };

  const generateReport = (users) => {
    const doc = new jsPDF("p", "pt", "a4");
    let y = 0;

    // Helper function for consistent spacing
    const addSpace = (space = 20) => {
      y += space;
    };

    // Header
    doc.setFillColor(46, 204, 113); // Soft green
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 80, "F");
    doc.setFontSize(28);
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("GSP Traders", 40, 50);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("User Report", doc.internal.pageSize.getWidth() - 40, 50, {
      align: "right",
    });

    addSpace(100);

    // Summary section
    const newUsers = users.filter(
      (user) => new Date(user.createdAt) > new Date() - 7 * 24 * 60 * 60 * 1000
    ); // Users created in the last 7 days
    doc.setFillColor(241, 250, 238); // Light greenish color
    doc.roundedRect(
      20,
      y,
      doc.internal.pageSize.getWidth() - 40,
      130,
      5,
      5,
      "F"
    );
    doc.setTextColor(44, 62, 80); // Dark blue-gray
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Report Summary", 40, y + 30);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Users: ${users.length}`, 40, y + 55);
    doc.text(
      `Active Users: ${
        users.filter((user) => user.status === "active").length
      }`,
      40,
      y + 75
    );
    doc.text(
      `Inactive Users: ${
        users.filter((user) => user.status === "inactive").length
      }`,
      250,
      y + 75
    );
    doc.text(`New Users (Last 7 days): ${newUsers.length}`, 40, y + 95);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() - 40,
      y + 30,
      { align: "right" }
    );

    addSpace(140);

    // User Details section
    doc.setFillColor(88, 214, 141); // Vibrant green
    doc.rect(20, y, doc.internal.pageSize.getWidth() - 40, 40, "F");
    doc.setFontSize(18);
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("User Details", 40, y + 28);

    addSpace(60);

    // User cards layout
    users.forEach((user, index) => {
      if (y > doc.internal.pageSize.getHeight() - 150) {
        doc.addPage();
        y = 40;
      }

      // Background color for alternate cards
      const rowColor = index % 2 === 0 ? 240 : 255;
      doc.setFillColor(rowColor, rowColor, rowColor);
      doc.roundedRect(
        20,
        y,
        doc.internal.pageSize.getWidth() - 40,
        180,
        10,
        10,
        "F"
      );

      // Adding user details visually
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80); // Dark blue-gray
      doc.setFontSize(16);
      doc.text(`${user.first_name} ${user.last_name}`, 40, y + 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Role: ${user.role}`, 40, y + 50);

      // Divider line
      doc.setDrawColor(189, 195, 199); // Light gray for divider
      doc.line(40, y + 55, doc.internal.pageSize.getWidth() - 40, y + 55);

      // Details in the card
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Email: ${user.email}`, 40, y + 80);
      doc.text(`Status: ${user.status}`, 40, y + 100);
      doc.text(
        `Joined: ${new Date(user.createdAt).toLocaleDateString()}`,
        40,
        y + 120
      );
      doc.text(
        `Last Login: ${
          user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"
        }`,
        250,
        y + 120
      );
      doc.text(`Contact: ${user.mobile ? user.mobile : "N/A"}`, 40, y + 140);

      // Adding subtle card shadow
      doc.setDrawColor(192, 192, 192); // Shadow effect
      doc.roundedRect(
        18,
        y + 2,
        doc.internal.pageSize.getWidth() - 36,
        180,
        10,
        10,
        "S"
      );

      addSpace(200);
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
    }

    return doc;
  };

  const handleDownloadReport = () => {
    const pdfDoc = generateReport(users);
    pdfDoc.save("user-report.pdf");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
        <ClipLoader size={50} color={"#36d7b7"} loading={loading} />
        <p className="text-gray-600 text-lg">Please wait...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      {/* Add Employee and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500 hover:border-gray-400 transition-all duration-300"
            aria-label="Search users"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-all duration-200" />

          {/* Clear button, appears only when there's a search term */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-red-100 p-1 rounded-full transition-all duration-300"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 hover:text-red-500 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-40">
          <button
            className="flex items-center justify-between w-full px-4 py-2 border rounded-full text-black hover:bg-gray-100 transition duration-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-sm font-medium">
              {filterRole !== "All" ? filterRole : filterStatus}
            </span>
            <FaFilter className="text-sm" />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg">
              <ul>
                <li
                  onClick={() => {
                    setFilterRole("All");
                    setFilterStatus("All");
                    setDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  All
                </li>
                <li
                  onClick={() => {
                    setFilterRole("User");
                    setFilterStatus("All");
                    setDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  User
                </li>
                <li
                  onClick={() => {
                    setFilterRole("Manager");
                    setFilterStatus("All");
                    setDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Manager
                </li>
                <li
                  onClick={() => {
                    setFilterStatus("Active");
                    setFilterRole("All");
                    setDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Active
                </li>
                <li
                  onClick={() => {
                    setFilterStatus("Inactive");
                    setFilterRole("All");
                    setDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Inactive
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <FaUserPlus className="mt-1" />
          <span className="ml-2">Generate Report</span>
        </button>
        <Link to={"/add-employee"}>
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
            <FaUserPlus />
            <span className>Add Manager</span>
          </button>
        </Link>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold"> User not found </p>
        </div>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="bg-blue-50 shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-full border-2 border-green-500">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-700">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              {/* User Details */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    First Name:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Last Name:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Contact:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.mobile || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Postal Code:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.postal || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Area:</p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.area || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    District:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.district || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Address:
                  </p>
                  <p className="text-base text-green-800 font-semibold">
                    {user.address || "N/A"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-600">Role:</p>
                  <p className="text-base text-blue-800 font-semibold">
                    {user.role}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      user.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <p
                    className={`text-base font-semibold ${
                      user.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </p>
                </div>

                {/* Joined and Last Login Aligned Next to Each Other */}
                <div className="flex justify-between col-span-2">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-600">
                      Joined:
                    </p>
                    <p className="text-base text-red-800 font-semibold">
                      {new Date(user.createdAt).toLocaleDateString("en-CA") ||
                        "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-600">
                      Last Login:
                    </p>
                    <p className="text-base text-blue-800 font-semibold">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString("en-CA")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setSelectedUserId(user._id); // Set selected user ID
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="sm"
        className="flex justify-center items-center bg-gray-900 bg-opacity-75"
      >
        <Modal.Header className="border-b-0 p-4"></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Yes, delete it
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                No, cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
