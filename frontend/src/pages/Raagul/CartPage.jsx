import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) navigate("/sign-in");
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("http://localhost:5000/api/cart", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setCart(data.data.cartItems.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images || "https://via.placeholder.com/150",
          })));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [currentUser]);

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to remove item");
      if (data.success) {
        setCart(cart.filter(item => item.id !== productId));
        toast.success("Item removed from cart!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  const handleQuantityChange = async (productId, change) => {
    const item = cart.find(i => i.id === productId);
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update cart");
      if (data.success) {
        setCart(cart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
        toast.success("Cart updated!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update cart");
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    // Pass cart items to CheckoutPage via navigation state
    navigate('/checkout', { state: { cartItems: cart } });
  };

  if (!currentUser) return null;
  if (loading) return <div className="bg-gray-100 min-h-screen p-6"><p>Loading cart...</p></div>;
  if (error) return (
    <div className="bg-gray-100 min-h-screen p-6">
      <p className="text-red-600">Error: {error}</p>
    </div>
  );

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