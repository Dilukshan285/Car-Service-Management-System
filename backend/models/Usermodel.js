import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    OTP: {
      type: Number,
    },
    mobile: {
      type: Number,
      unique: true,
      sparse: true,
    },
    address: {
      type: String,
    },
    postal: {
      type: Number,
    },
    area: {
      type: String,
    },
    district: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180",
    },
    role: {
      type: String,
      default: "User",
    },
    status: {
      // New field to track the status
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    lastLogin: {
      // New field to track the last login time
      type: Date,
    },
    cartData: { type: Object, default: {} },
  },
  { timestamps: true, minimize: false } // Ensure this is at the end of the schema definition
);

// Define the User model (if it doesn't exist, create it)
const User = model("User", schema);

// Export the User model using ES module syntax
export default User;