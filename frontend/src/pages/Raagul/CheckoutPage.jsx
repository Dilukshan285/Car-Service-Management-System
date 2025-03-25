import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment'); // Redirect to payment page after submitting shipping info
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/cart')} // Navigate back to the Cart page
          className="text-blue-600"
        >
          &lt; Back to Cart
        </button>
        <h1 className="text-4xl font-semibold">Checkout</h1>
      </div>

      <div className="flex">
        {/* Shipping Form */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="mb-6 text-lg text-gray-600">
            Complete your order by providing your shipping information
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Street address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="City"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Postal code"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                {/* Add other countries */}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="state">
                State/Province
              </label>
              <select
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select state</option>
                <option value="California">California</option>
                <option value="Ontario">Ontario</option>
                {/* Add other states */}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Phone number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Continue to Payment
            </button>
          </form>
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

export default CheckoutPage;
