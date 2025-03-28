// Example Order model schema (using Mongoose for MongoDB)
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      name: {
        type: String,
        required: true, // Snapshot of product name at the time of order
      },
      price: {
        type: Number,
        required: true, // Snapshot of product price at the time of order
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String, // Snapshot of product image URL (optional)
      },
    },
  ],
  shippingInfo: {
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentInfo: {
    paymentMethod: { type: String, required: true }, // e.g., "creditCard", "paypal"
    cardDetails: {
      // Optional: Store only if not using a payment gateway
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvc: { type: String },
    },
    // If using a payment gateway, store the transaction ID instead
    transactionId: { type: String },
  },
  totals: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', OrderSchema);