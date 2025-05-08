import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceType;