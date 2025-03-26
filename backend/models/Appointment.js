import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    carType: {
      type: String,
      required: [true, "Car type is required"],
      trim: true,
    },
    carNumberPlate: {
      type: String,
      required: [true, "Car number plate is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (value) {
          const now = new Date();
          now.setHours(0, 0, 0, 0); // Start of today
          return value >= now;
        },
        message: "Appointment date must be today or in the future",
      },
    },
    appointmentTime: {
      type: String, // Storing as HH:MM in 24-hour format
      required: [true, "Appointment time is required"],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (use HH:MM)"],
      validate: {
        validator: function (value) {
          const [hours] = value.split(":").map(Number);
          return hours >= 9 && hours < 17; // 9 AM to 5 PM
        },
        message: "Appointments can only be booked between 9:00 and 16:59",
      },
    },
    user: {
      type: String,
      required: [true, "User name is required"],
    },
    worker: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Combined index for date and time to prevent overlapping for the same worker
appointmentSchema.index(
  { worker: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { worker: { $ne: null } },
  }
);

// Virtual to get combined date and time
appointmentSchema.virtual("appointmentDateTime").get(function () {
  return new Date(`${this.appointmentDate.toISOString().split("T")[0]}T${this.appointmentTime}:00`);
});

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;