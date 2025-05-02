import Order from "../models/Order.js"; // Import the Order model
import User from "../models/Usermodel.js"; // Import the User model for cart clearing

// Create a new order
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const { items, shippingInfo, paymentInfo, totals } = req.body;

    // Validate required fields
    if (!items || !shippingInfo || !paymentInfo || !totals) {
      return res.status(400).json({
        success: false,
        message: "Items, shippingInfo, paymentInfo, and totals are required",
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items must be a non-empty array",
      });
    }

    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must have productId, name, price, and quantity",
        });
      }
    }

    // Validate shippingInfo
    const requiredShippingFields = ["address", "area", "city", "postalCode", "country", "state", "phone"];
    for (const field of requiredShippingFields) {
      if (!shippingInfo[field]) {
        return res.status(400).json({
          success: false,
          message: `Shipping info must include ${field}`,
        });
      }
    }

    // Validate paymentInfo
    if (!paymentInfo.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // Validate totals
    const requiredTotalFields = ["subtotal", "shipping", "tax", "total"];
    for (const field of requiredTotalFields) {
      if (totals[field] === undefined || isNaN(totals[field]) || totals[field] < 0) {
        return res.status(400).json({
          success: false,
          message: `Totals must include a valid ${field}`,
        });
      }
    }

    // Create the order
    const newOrder = new Order({
      userId,
      items,
      shippingInfo,
      paymentInfo,
      totals,
      status: "pending", // Default status
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    // Clear the user's cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cartData = new Map(); // Clear the cart
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders for the authenticated user
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const orders = await Order.find({ userId })
      .populate("items.productId", "name price images") // Populate product details
      .sort({ orderDate: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate("items.productId", "name price images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status (e.g., for admin use)
export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Optionally, add role-based access control (e.g., only admins can update status)
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an order (e.g., for cancelling an order)
export const deleteOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user.id || req.user._id;
    const orderId = req.params.id;

    const deletedOrder = await Order.findOneAndDelete({ _id: orderId, userId });

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};