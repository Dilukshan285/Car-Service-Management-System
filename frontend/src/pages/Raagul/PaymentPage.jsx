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

  // Retrieve data passed from CheckoutPage
  const { cartItems = [], shippingInfo = {}, subtotal = "0.00", shipping = "0.00", tax = "0.00", total = "0.00" } =
    location.state || {};

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate card details if payment method is credit card
      if (paymentMethod === "creditCard") {
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc) {
          toast.error("Please fill in all card details");
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
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/checkout")} // Navigate back to the Checkout page
          className="text-blue-600"
        >
          &lt; Back to Shipping
        </button>
        <h1 className="text-4xl font-semibold">Payment</h1>
      </div>

      <div className="flex">
        {/* Payment Form */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
          <p className="mb-6 text-lg text-gray-600">Complete your order by providing your payment details</p>
          <form onSubmit={handlePaymentSubmit}>
            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Choose how you want to pay</label>
              <div className="space-y-2">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  Credit / Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>
            </div>

            {/* Credit Card Details */}
            {paymentMethod === "creditCard" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
            )}

            {/* Expiry and CVC */}
            {paymentMethod === "creditCard" && (
              <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-2">Card Expiry</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-2">Card CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={cardDetails.cvc}
                    onChange={handleCardDetailsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg">
              Place Order
            </button>
          </form>

          {/* Success Message */}
          {isOrderSuccess && (
            <div className="mt-4 text-center text-green-600">
              <p className="text-xl font-semibold">Order Placed Successfully!</p>
              <p>Redirecting to your orders page...</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-1/4 ml-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;