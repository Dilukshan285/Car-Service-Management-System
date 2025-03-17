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
      enum: [
        "Engine Specialist",
        "Brake Specialist",
        "Electrical Systems",
        "General Mechanic",
        "Transmission Specialist",
      ],
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
      required: true,
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