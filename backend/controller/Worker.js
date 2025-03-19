import Worker from "../models/Worker.js";
import Appointment from "../models/Appointment.js"; // Import Appointment model for updating references

// Create a new worker
const createWorker = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      address,
      primarySpecialization,
      skills,
      certifications,
      hireDate,
      weeklyAvailability,
      hourlyRate,
      additionalNotes,
      workload,
      status,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !address ||
      !primarySpecialization ||
      !hireDate ||
      !hourlyRate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const newWorker = new Worker({
      fullName,
      email,
      phoneNumber,
      address,
      primarySpecialization,
      skills: skills || [],
      certifications: certifications || [],
      hireDate: new Date(hireDate),
      weeklyAvailability: weeklyAvailability || [],
      hourlyRate: parseFloat(hourlyRate),
      additionalNotes: additionalNotes || "",
      workload: workload || 0,
      status: status || "available", // Default to "available" if not provided
    });

    const savedWorker = await newWorker.save();

    res.status(201).json({
      success: true,
      message: "Worker created successfully",
      data: savedWorker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all workers
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate("tasks", "carType carNumberPlate serviceType appointmentDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a worker
const updateWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const {
      fullName,
      email,
      phoneNumber,
      address,
      primarySpecialization,
      skills,
      certifications,
      hireDate,
      weeklyAvailability,
      hourlyRate,
      additionalNotes,
      workload,
      status,
    } = req.body;

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      {
        fullName,
        email,
        phoneNumber,
        address,
        primarySpecialization,
        skills,
        certifications,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        weeklyAvailability,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        additionalNotes,
        workload,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Worker updated successfully",
      data: updatedWorker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a worker
const deleteWorker = async (req, res) => {
  try {
    const { workerId } = req.params;

    const deletedWorker = await Worker.findByIdAndDelete(workerId);

    if (!deletedWorker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Remove worker reference from appointments
    await Appointment.updateMany(
      { worker: workerId },
      { $set: { worker: null } }
    );

    res.status(200).json({
      success: true,
      message: "Worker deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
};