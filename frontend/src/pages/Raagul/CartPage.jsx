import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Performance Brake Pads',
      price: 89.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Car Battery',
      price: 129.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId)); // Remove item from cart
  };

  const handleQuantityChange = (productId, change) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity + change } : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout'); // Navigate to the Checkout page
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">Shopping Cart</h1>
        <button
          onClick={() => navigate('/')} // Navigate back to the product page
          className="bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex">
        <div className="w-3/4">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-300">
                <span className="text-lg font-semibold">Your Cart</span>
              </div>
              <ul className="divide-y divide-gray-200">
                {cart.map((product) => (
                  <li key={product.id} className="flex justify-between items-center p-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-500">${product.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="bg-gray-200 text-gray-600 px-2 py-1 rounded"
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="bg-gray-200 text-gray-600 px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="text-red-600 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-1/4 ml-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${calculateSubtotal()}</span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
