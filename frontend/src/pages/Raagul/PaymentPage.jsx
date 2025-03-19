import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [isOrderSuccess, setIsOrderSuccess] = useState(false); // State for success message

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Simulate order success
    setIsOrderSuccess(true); // Set success state to true

    // Redirect to My Orders page after a delay
    setTimeout(() => {
      navigate('/myorders');
    }, 2000); // Redirect after 2 seconds to show the success message
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/checkout')} // Navigate back to the Checkout page
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
                    checked={paymentMethod === 'creditCard'}
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
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>
            </div>

            {/* Credit Card Details */}
            {paymentMethod === 'creditCard' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
            )}

            {/* Expiry and CVC */}
            {paymentMethod === 'creditCard' && (
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
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg"
            >
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
            <div className="flex justify-between mb-2">
              <span>1 × Car Battery</span>
              <span>$129.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>1 × Alloy Wheel Set</span>
              <span>$599.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$729.98</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$58.40</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">$794.37</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
