import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Signup from "./pages/Signup.jsx";
import OTP from "./pages/OTP.jsx";
import SignIn from "./pages/SignIn.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RecoveryPage from "./pages/Recovery_email.jsx";
import RecoveryOTP from "./pages/Recovery_OTP.jsx";
import RecoveryPassword from "./pages/Recovery_Password.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ServiceType from "../src/pages/venushan/servicetype.jsx";
import GetService from './pages/venushan/getservice.jsx';
import UpdateServiceType from './pages/venushan/updateServiceType.jsx';

import UserHome from "./pages/Home.jsx";

import UserDashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/Admin_Dashboard.jsx";
import AddEmployeeForm from "./pages/Add_employee.jsx";
import EmployeeSignin from "./pages/Employee_SignIn.jsx";

// Dilukshan
import Manager_Dashboard from "./pages/Dilukshan/Manager_Dashboard.jsx";
import Appointments from "./pages/Dilukshan/Appointments.jsx";
import Workers from "./pages/Dilukshan/Workers.jsx";
import Customers from "./pages/Dilukshan/Customers.jsx";
import Services from "./pages/Dilukshan/Services.jsx";
import Vehicles from "./pages/Dilukshan/Vehicles.jsx";
import Analytics from "./pages/Dilukshan/Analytics.jsx";

// Venushan's Pages
import ServiceDashboard from "./pages/venushan/ServiceDashboard.jsx";
import ServiceDetails from "./pages/venushan/ServiceDetails.jsx";
import AboutUs from "./pages/venushan/Aboutuspage.jsx";
import ImageUploadForm from "./pages/venushan/AppoinmentBookingimg.jsx";
import BookingForm from "./pages/venushan/AppoinmentBooking.jsx";
import MyAppointments from './pages/venushan/MyAppointments.jsx';

// Raagul Gananathan's வேர்
import ProductTable from './pages/Raagul/ProductTable.jsx';
import ProductPage from './pages/Raagul/ProductPage.jsx';
import ProductDetail from './pages/Raagul/ProductDetail.jsx';
import MyOrdersPage from './pages/Raagul/MyOrdersPage.jsx';
import CartPage from './pages/Raagul/CartPage.jsx';
import CheckoutPage from './pages/Raagul/CheckoutPage.jsx';
import PaymentPage from './pages/Raagul/PaymentPage.jsx';
import OrderManagementPage from './pages/Raagul/OrderManagementPage.jsx';
import ReviewManagementPage from './pages/Raagul/ReviewManagementPage.jsx';
import OrderDetailPage from './pages/Raagul/OrderDetailPage.jsx';

function AppWrapper() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const hideHeaderRoutes = [
      '/service-dashboard', 
      '/service-details/'
    ];
    const shouldHideHeader = hideHeaderRoutes.some(route => 
      location.pathname === route || 
      location.pathname.startsWith(route)
    );
    setShowHeader(!shouldHideHeader);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/service-dashboard" element={<ServiceDashboard />} />
          <Route path="/service-details/:plate" element={<ServiceDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/" element={<UserHome />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/recovery-email" element={<RecoveryPage />} />
          <Route path="/recovery-otp" element={<RecoveryOTP />} />
          <Route path="/recovery-password" element={<RecoveryPassword />} />
          <Route path="/employee-signin" element={<EmployeeSignin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/add-employee" element={<AddEmployeeForm />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/profile" element={<UserDashboard />} />
            <Route path="/admin-user" element={<AdminDashboard />} />
          </Route>

          {/* Raagul's Routes */}
          <Route path="/Product" element={<ProductTable />} />
          <Route path="/accessories" element={<ProductPage />} />
          <Route path="/ProductDetails/:id" element={<ProductDetail />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/OrderDetail/:id" element={<OrderDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/adminOrder" element={<OrderManagementPage />} />
          <Route path="/adminReview" element={<ReviewManagementPage />} />

          {/* Dilukshan's Routes */}
          <Route path="/manager_dashboard" element={<Manager_Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Venushan's Routes */}
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/AI" element={<ImageUploadForm />} />
          <Route path="/my-bookings" element={<MyAppointments />} />
          <Route path="/service" element={<ServiceType />} />
          <Route path="/get" element={<GetService />} />
          <Route path="/update-service/:id" element={<UpdateServiceType />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;