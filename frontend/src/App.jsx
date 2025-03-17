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
import UserHome from './pages/Home.jsx'
import UserDashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/Admin_Dashboard.jsx";
import AddEmployeeForm from "./pages/Add_employee.jsx";
import EmployeeSignin from "./pages/Employee_SignIn.jsx";
import Footer from './components/Footer.jsx';

import Manager_Dashboard from "./pages/Manager_Dashboard";
import Appointments from "./pages/Appointments";
import Workers from "./pages/Workers";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import Vehicles from "./pages/Vehicles";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/sign-in" element={<SignIn />} />
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/Manager" element={<Manager_Dashboard />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;