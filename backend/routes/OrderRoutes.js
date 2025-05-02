import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controller/Order.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Order routes
router.post("/", verifyToken, createOrder); // Create a new order
router.get("/", verifyToken, getUserOrders); // Get all orders for the user
router.get("/:id", verifyToken, getOrderById); // Get a specific order by ID
router.put("/:id/status", verifyToken, updateOrderStatus); // Update order status
router.delete("/:id", verifyToken, deleteOrder); // Delete an order

export default router;