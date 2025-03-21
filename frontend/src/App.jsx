import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./pages/Signup.jsx";
import OTP from "./pages/OTP.jsx";
import SignIn from "./pages/SignIn.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RecoveryPage from "./pages/Recovery_email.jsx";
import RecoveryOTP from "./pages/Recovery_OTP.jsx";
import RecoveryPassword from "./pages/Recovery_Password.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import UserHome from './pages/Home.jsx';
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

// Venushan's வேர்
import ServiceDashboard from './pages/ServiceDashboard.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx';
import AboutUs from './pages/Aboutuspage.jsx';

// Raagul Gananathan's வேர்
import ProductTable from './pages/Raagul/ProductTable.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
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

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/profile" element={<UserDashboard />} />
              <Route path="/admin-user" element={<AdminDashboard />} />
            </Route>

            <Route path="/manager_dashboard" element={<Manager_Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/Product" element={<ProductTable />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;