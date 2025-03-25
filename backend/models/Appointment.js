import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    carType: {
      type: String,
      required: true,
    },
    carNumberPlate: {
      type: String,
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    worker: {
      type: Schema.Types.ObjectId,
      ref: "Worker", // Reference to the Worker model
      default: null,
    },
  },
  { timestamps: true }
);

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;