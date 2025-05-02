import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access navigation state
  const { currentUser } = useSelector((state) => state.user);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    area: "", // New field for area
    city: "", // Will map to district
    postalCode: "",
    country: "",
    state: "",
    phone: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [provinces, setProvinces] = useState([]); // State to store fetched provinces
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch provinces from the API
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://parseapi.back4app.com/classes/LK?limit=10000000&order=admin1&keys=admin1",
          {
            headers: {
              "X-Parse-Application-Id": "qK0rkBqbu4zBtrLmi2Cq7vpmQo4VU4uoYX32HMRp",
              "X-Parse-Master-Key": "TPIwnIhDkdRo1wwUMAZcjsHgiy9t58lpHQvB5s0f",
            },
          }
        );
        const data = await response.json();
        // Extract unique admin1 values (provinces) and sort them
        const uniqueProvinces = [...new Set(data.results.map((item) => item.admin1))].sort();
        setProvinces(uniqueProvinces);
      } catch (err) {
        console.error("Failed to fetch provinces:", err);
        toast.error("Failed to load provinces");
      }
    };

    // Fetch cart items from the backend
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        // Map the cart items to the format expected by the frontend
        const formattedCartItems = data.data.cartItems.map((item) => ({
          id: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images,
        }));
        setCartItems(formattedCartItems);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        toast.error("Failed to load cart items");
        setCartItems([]);
      }
    };

    const initializeData = async () => {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      // Populate shipping info from currentUser
      let phoneNumber = "";
      if (currentUser.mobile) {
        // Remove +94 and any spaces, then take the last 9 digits
        phoneNumber = currentUser.mobile.replace(/^\+94\s?/, "");
        // Ensure we only take the last 9 digits (e.g., 94775342152 -> 775342152)
        phoneNumber = phoneNumber.slice(-9);
      }

      setShippingInfo({
        address: currentUser.address || "",
        area: currentUser.area || "", // Map area to the new field
        city: currentUser.district || "", // Map district to city
        postalCode: currentUser.postal ? currentUser.postal.toString() : "",
        country: "Sri Lanka", // Default to Sri Lanka since phone prefix is +94
        state: "", // Leave state empty for now; user will select from dropdown
        phone: phoneNumber, // Set the phone number without +94
      });

      // Fetch cart items and provinces
      await Promise.all([fetchCartItems(), fetchProvinces()]);
      setLoading(false);
    };

    initializeData();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only digits and enforce 9-digit length
      const cleanedValue = value.replace(/\D/g, ""); // Remove non-digits
      console.log("Phone input value:", value, "Cleaned value:", cleanedValue); // Debug log
      setShippingInfo((prevInfo) => ({
        ...prevInfo,
        phone: cleanedValue.slice(0, 9), // Limit to 9 digits
      }));
    } else {
      setShippingInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const calculateShipping = () => "5.99"; // Static for now; adjust based on logic
  const calculateTax = () => (parseFloat(calculateSubtotal()) * 0.08).toFixed(2); // Example 8% tax
  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateShipping()) + parseFloat(calculateTax())).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    // Validation
    if (
      !shippingInfo.address ||
      !shippingInfo.area ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.country ||
      !shippingInfo.state
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    // Phone number validation: must be exactly 9 digits
    if (!/^\d{9}$/.test(shippingInfo.phone)) {
      toast.error("Phone number must be exactly 9 digits");
      return;
    }

    // Format phone number with +94 prefix before submission
    const formattedPhone = `+94 ${shippingInfo.phone}`;
    console.log("Formatted phone for submission:", formattedPhone);

    // Prepare data to pass to PaymentPage
    const paymentData = {
      cartItems,
      shippingInfo: { ...shippingInfo, phone: formattedPhone },
      subtotal: calculateSubtotal(),
      shipping: calculateShipping(),
      tax: calculateTax(),
      total: calculateTotal(),
    };

    // Navigate to PaymentPage with the data
    navigate("/payment", { state: paymentData });
  };

  if (!currentUser) return null;
  if (loading) return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      <p className="text-center text-gray-600 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/cart")} // Navigate back to the Cart page
          className="text-indigo-600 font-medium text-lg hover:text-indigo-800 transition-colors duration-300 flex items-center"
        >
          <span className="mr-2">←</span> Back to Cart
        </button>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Checkout</h1>
      </div>

      <div className="flex gap-8">
        {/* Shipping Form */}
        <div className="w-3/4 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <p className="mb-6 text-gray-600 text-lg">
            Complete your order by providing your shipping information
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300"
                placeholder="Street address"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="area">
                Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={shippingInfo.area}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300"
                placeholder="Area"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300"
                placeholder="City"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300"
                placeholder="Postal code"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300 text-gray-700"
                required
              >
                <option value="">Select country</option>
                <option value="Sri Lanka">Sri Lanka</option>
                {/* Add other countries if needed */}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="state">
                State/Province
              </label>
              <select
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300 text-gray-700"
                required
              >
                <option value="">Select state</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex items-center">
                <span className="inline-block px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-100 text-gray-700 font-medium">
                  +94
                </span>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-r-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border-gray-300"
                  placeholder="775342152"
                  required
                  maxLength="9"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Continue to Payment
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">No items in cart.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-3 text-gray-700">
                  <span className="text-sm">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">${calculateShipping()}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Tax</span>
                <span className="font-medium">${calculateTax()}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-indigo-600 text-lg">${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;