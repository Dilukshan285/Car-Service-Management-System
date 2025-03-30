import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access navigation state
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [isOrderSuccess, setIsOrderSuccess] = useState(false); // State for success message
  const [touched, setTouched] = useState({}); // Track which fields have been interacted with
  const [errors, setErrors] = useState({}); // Store validation errors

  // Retrieve data passed from CheckoutPage
  const { cartItems = [], shippingInfo = {}, subtotal = "0.00", shipping = "0.00", tax = "0.00", total = "0.00" } =
    location.state || {};

  // Validate individual card detail fields
  const validateField = (name, value) => {
    switch (name) {
      case "cardNumber":
        return value.trim() === ""
          ? "Card number is required"
          : !/^\d{16}$/.test(value.replace(/\s/g, ""))
          ? "Card number must be 16 digits"
          : "";
      case "expiryDate":
        if (value.trim() === "") return "Expiry date is required";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return "Expiry must be MM/YY";
        // Check if date is in the past
        const [month, year] = value.split("/").map(Number);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Last two digits of current year
        const currentMonth = currentDate.getMonth() + 1; // 0-based to 1-based
        const fullYear = 2000 + year; // Assuming 20XX
        if (
          fullYear < currentDate.getFullYear() ||
          (fullYear === currentDate.getFullYear() && month < currentMonth)
        ) {
          return "Expiry date cannot be in the past";
        }
        return "";
      case "cvc":
        return value.trim() === ""
          ? "CVC is required"
          : !/^\d{3,4}$/.test(value)
          ? "CVC must be 3 or 4 digits"
          : "";
      default:
        return "";
    }
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;

    // Apply specific formatting and validation
    let formattedValue = value;
    if (name === "cardNumber") {
      // Remove non-digits and limit to 16 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      // Format into groups of 4 digits separated by spaces
      formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      // Allow only MM/YY format
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    } else if (name === "cvc") {
      // Limit to 4 digits
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: formattedValue,
    }));

    // Mark field as touched and validate
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formattedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate card details if payment method is credit card
      if (paymentMethod === "creditCard") {
        const currentErrors = {};
        const fields = ["cardNumber", "expiryDate", "cvc"];
        fields.forEach((field) => {
          const error = validateField(field, cardDetails[field]);
          if (error) currentErrors[field] = error;
        });

        setErrors(currentErrors);
        setTouched((prev) => ({
          ...prev,
          cardNumber: true,
          expiryDate: true,
          cvc: true,
        }));

        if (Object.keys(currentErrors).length > 0) {
          toast.error("Please correct the errors in the card details");
          return;
        }
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo,
        paymentInfo: {
          paymentMethod,
          cardDetails: paymentMethod === "creditCard" ? cardDetails : undefined,
        },
        totals: {
          subtotal: parseFloat(subtotal),
          shipping: parseFloat(shipping),
          tax: parseFloat(tax),
          total: parseFloat(total),
        },
      };

      // Send order data to the backend
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      // Order created successfully
      setIsOrderSuccess(true);

      // Redirect to My Orders page after a delay
      setTimeout(() => {
        navigate("/myorders");
      }, 2000); // Redirect after 2 seconds to show the success message
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/checkout")}
          className="text-indigo-600 font-medium text-lg hover:text-indigo-800 transition-colors duration-300 flex items-center"
        >
          <span className="mr-2">←</span> Back to Shipping
        </button>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Payment</h1>
      </div>

      <div className="flex gap-8">
        {/* Payment Form */}
        <div className="w-3/4 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          <p className="mb-6 text-gray-600 text-lg">Complete your order by providing your payment details</p>
          <form onSubmit={handlePaymentSubmit}>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose how you want to pay</label>
              <div className="space-y-4">
                <label className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-800 font-medium">Credit / Debit Card</span>
                </label>
                <label className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-800 font-medium">PayPal</span>
                </label>
              </div>
            </div>

            {/* Credit Card Details */}
            {paymentMethod === "creditCard" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    touched.cardNumber && errors.cardNumber
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="19" // 16 digits + 3 spaces
                />
                {touched.cardNumber && errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>
            )}

            {/* Expiry and CVC */}
            {paymentMethod === "creditCard" && (
              <div className="flex space-x-6 mb-8">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Expiry</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                      touched.expiryDate && errors.expiryDate
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                  />
                  {touched.expiryDate && errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={cardDetails.cvc}
                    onChange={handleCardDetailsChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                      touched.cvc && errors.cvc
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="123"
                    required
                    maxLength="4"
                  />
                  {touched.cvc && errors.cvc && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Place Order
            </button>
          </form>

          {/* Success Message */}
          {isOrderSuccess && (
            <div className="mt-6 text-center text-green-600 bg-green-50 p-4 rounded-lg">
              <p className="text-xl font-semibold">Order Placed Successfully!</p>
              <p className="text-sm">Redirecting to your orders page...</p>
            </div>
          )}
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
                <span className="font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">${shipping}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Tax</span>
                <span className="font-medium">${tax}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-indigo-600 text-lg">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;