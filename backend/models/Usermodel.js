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
      type: String,
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
      default: "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180",
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    lastLogin: {
      type: Date,
    },
    cartData: {  // Removed duplicate field
      type: Map,
      of: Number,
      default: new Map()
    },
  },
  { timestamps: true, minimize: false }
);

const User = model("User", schema);
export default User;