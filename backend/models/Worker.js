import { Schema, model } from "mongoose";

const workerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    primarySpecialization: {
      type: String,
      required: true,
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
    hourlyRate: {
      type: Number,
    },
    additionalNotes: {
      type: String,
      default: "",
    },
    workload: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
    },
    profilePicture: {
      type: String,
      default: 'https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180'
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment", // Reference to the Appointment model
      },
    ],
  },
  { timestamps: true }
);

const Worker = model("Worker", workerSchema);
export default Worker;