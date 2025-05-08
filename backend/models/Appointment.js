import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    make: {
      type: String,
      required: [true, "Car make is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Car year is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    carNumberPlate: {
      type: String,
      required: [true, "Car number plate is required"],
      trim: true,
      uppercase: true,
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
      min: [0, "Mileage cannot be negative"],
    },
    serviceType: {
      type: Schema.Types.ObjectId,
      ref: "ServiceType",
      required: [true, "Service type is required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (value) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          return value >= now;
        },
        message: "Appointment date must be today or in the future",
      },
    },
    appointmentTime: {
      type: String,
      required: [true, "Appointment time is required"],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (use HH:MM)"],
      validate: {
        validator: function (value) {
          const [hours] = value.split(":").map(Number);
          return hours >= 9 && hours < 17;
        },
        message: "Appointments can only be booked between 9:00 and 16:59",
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    user: {
      type: String,
      required: [true, "User name is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usermodel",
      required: [true, "User ID is required"],
    },
    worker: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Confirmed",
    },
    isAcceptedByWorker: {
      type: Boolean,
      default: false,
    },
    checklist: {
      type: Map,
      of: Boolean,
      default: {},
    },
    additionalIssues: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { worker: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { worker: { $ne: null } },
  }
);

appointmentSchema.virtual("appointmentDateTime").get(function () {
  return new Date(`${this.appointmentDate.toISOString().split("T")[0]}T${this.appointmentTime}:00`);
});

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;