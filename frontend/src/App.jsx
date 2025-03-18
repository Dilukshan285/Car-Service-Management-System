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

//venushan's வேர்

import ServiceDashboard from './pages/ServiceDashboard.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx';
import AboutUs from './pages/Aboutuspage.jsx';


//Raagul Gananathan's வேர்
import ProductTable from './pages/Raagul/ProductTable.jsx';
import ProductPage from './pages/Raagul/ProductPage.jsx';
import ProductDetail from './pages/Raagul/ProductDetail.jsx';
import MyOrdersPage from './pages/Raagul/MyOrdersPage.jsx';
import CartPage from './pages/Raagul/CartPage.jsx';
import CheckoutPage from './pages/Raagul/CheckoutPage.jsx';
import PaymentPage from './pages/Raagul/PaymentPage.jsx';





function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>

            <Route path="/service-dashboard" element={<ServiceDashboard />} />
            <Route path="/service-details/:plate" element={<ServiceDetails />} />
            <Route path="/about" element={< AboutUs/>} />


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

            <Route path="/Product" element={< ProductTable/>} />
            <Route path="/ProductDisplay" element={< ProductPage/>} />
            <Route path="/ProductDetails/:id" element={< ProductDetail/>} />
            <Route path="/myorders" element={< MyOrdersPage/>} />
            <Route path="/cart" element={< CartPage/>} />
            <Route path="/checkout" element={< CheckoutPage/>} />
            <Route path="/payment" element={< PaymentPage/>} />




          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;