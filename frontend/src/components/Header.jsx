import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "flowbite-react";
import { signoutSuccess } from "../redux/user/userSlice";
import { logoutWorker } from "../redux/user/workerSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { worker } = useSelector((state) => state.worker); // Use `worker` instead of `currentWorker`
  const dispatch = useDispatch();
  const apiURL = "http://localhost:5000";
  const navigate = useNavigate();

  const handleSignout = async () => {
    const token = localStorage.getItem("access_token");
    try {
      // Determine the correct endpoint based on the role
      const endpoint = currentUser
        ? `${apiURL}/api/auth/signout`
        : `${apiURL}/api/workers/signout`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        // Even if the request fails, proceed with sign-out on the frontend
        if (currentUser) {
          dispatch(signoutSuccess());
        } else if (worker) {
          dispatch(logoutWorker());
        }
        localStorage.removeItem("access_token");
        navigate("/sign-in");
      } else {
        // Dispatch the appropriate sign-out action based on the role
        if (currentUser) {
          dispatch(signoutSuccess());
        } else if (worker) {
          dispatch(logoutWorker());
        }
        // Clear localStorage
        localStorage.removeItem("access_token");
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
      // Clear localStorage and redirect even if there's an error
      if (currentUser) {
        dispatch(signoutSuccess());
      } else if (worker) {
        dispatch(logoutWorker());
      }
      localStorage.removeItem("access_token");
      navigate("/sign-in");
    }
  };

  // Determine the authenticated entity (user or worker)
  const authenticatedEntity = currentUser || worker;

  return (
    <header className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <FaCar className="text-white w-6 h-6" aria-hidden="true" />
          <span
            className="text-xl font-bold text-white"
            role="heading"
            aria-level="1"
          >
            Revup
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow flex justify-center">
          <ul className="flex space-x-4 sm:space-x-8 justify-center items-center">
            <li>
              <Link
                className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                to="/"
                aria-label="Home"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                to="/accessories"
                aria-label="Accessories"
              >
                Accessories
              </Link>
            </li>
            {authenticatedEntity && (
              <>
                {currentUser && (
                  <>
                    <li>
                      <Link
                        className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                        to="/myorders"
                        aria-label="My Orders"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                        to="/my-bookings"
                        aria-label="My Bookings"
                      >
                        My Bookings
                      </Link>
                    </li>
                  </>
                )}
                {worker && (
                  <li>
                    <Link
                      className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                      to={worker.email === "dviyapury@gmail.com" ? "/manager-dashboard" : "/service-dashboard"}
                      aria-label={worker.email === "dviyapury@gmail.com" ? "Manager Dashboard" : "Service Dashboard"}
                    >
                      {worker.email === "dviyapury@gmail.com" ? "Manager Dashboard" : "Service Dashboard"}
                    </Link>
                  </li>
                )}
              </>
            )}
            <li>
              <Link
                className="hover:text-blue-300 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm px-2 py-1"
                to="/about"
                aria-label="About"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sign In / User Profile Section */}
        <div className="flex items-center space-x-4">
          {authenticatedEntity ? (
            worker && worker.email === "dviyapury@gmail.com" ? (
              // Special case for manager account - show direct signout button
              <button 
                onClick={handleSignout}
                className="bg-red-500 text-white hover:bg-red-600 active:bg-red-700 font-bold py-1.5 px-4 rounded-lg transition duration-300"
              >
                Sign Out
              </button>
            ) : (
              // Normal dropdown for other accounts
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={
                        authenticatedEntity.avatar ||
                        authenticatedEntity.profilePicture ||
                        "https://via.placeholder.com/150"
                      }
                      alt="user"
                      className="object-cover w-full h-full"
                    />
                  </div>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    {currentUser
                      ? `${currentUser.first_name} ${currentUser.last_name}`
                      : worker.fullName}
                  </span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser ? currentUser.email : worker.email}
                  </span>
                </Dropdown.Header>
                <Link to={currentUser ? "/dashboard/profile" : "/service-dashboard"}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
              </Dropdown>
            )
          ) : (
            <Link to="/sign-in">
              <button className="bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 font-bold py-1.5 px-4 rounded-lg transition duration-300">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}