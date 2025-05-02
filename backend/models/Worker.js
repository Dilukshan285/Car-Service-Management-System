import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    nic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    primarySpecialization: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    hireDate: {
      type: Date,
      required: true,
    },
    weeklyAvailability: {
      type: [String],
      default: [],
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    workload: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "busy", "on_leave"],
      default: "available",
    },
    profilePicture: {
      type: String,
      default: "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;