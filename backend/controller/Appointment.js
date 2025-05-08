import mongoose from "mongoose"; // Add this import
import Appointment from "../models/Appointment.js";
import Worker from "../models/Worker.js";
import User from "../models/Usermodel.js";
import ServiceType from "../models/ServiceType.js";

// Check authentication status
const checkAuth = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  res.status(200).json({ success: true, userId: req.user.id });
};

const createAppointment = async (req, res) => {
  try {
    const { make, model, year, carNumberPlate, mileage, serviceType, appointmentDate, appointmentTime, notes } = req.body;

    console.log("Request Body:", req.body);

    if (!make || !model || !year || !carNumberPlate || !mileage || !serviceType || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "All fields (make, model, year, carNumberPlate, mileage, serviceType, appointmentDate, appointmentTime) are required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found",
      });
    }

    // Validate serviceType is a valid ServiceType ID
    if (!mongoose.Types.ObjectId.isValid(serviceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type ID format",
      });
    }

    const serviceTypeExists = await ServiceType.findById(serviceType);
    if (!serviceTypeExists) {
      return res.status(400).json({
        success: false,
        message: "Service type not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userName = `${user.first_name} ${user.last_name}`;

    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }
    parsedDate.setHours(0, 0, 0, 0);

    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(appointmentTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM (24-hour)",
      });
    }

    const existingAppointment = await Appointment.findOne({
      carNumberPlate,
      appointmentDate: parsedDate,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: `An appointment already exists for car ${carNumberPlate} on ${appointmentDate} at ${appointmentTime}`,
      });
    }

    const newAppointment = new Appointment({
      make,
      model,
      year,
      carNumberPlate,
      mileage,
      serviceType, // Now an ObjectId referencing ServiceType
      appointmentDate: parsedDate,
      appointmentTime,
      notes: notes || "",
      user: userName,
      userId: req.user.id,
      isAcceptedByWorker: false,
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("worker", "fullName")
      .populate("serviceType", "name description estimatedTime features")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("worker", "fullName email phoneNumber primarySpecialization")
      .populate("userId", "first_name last_name email")
      .populate("serviceType", "name description estimatedTime features");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const workerId = req.user?.id;
    const userId = req.user?.id;
    if (
      appointment.worker?._id.toString() !== workerId &&
      appointment.userId?._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not have access to this appointment",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { make, model, year, carNumberPlate, mileage, serviceType, appointmentDate, appointmentTime, notes, status, isAcceptedByWorker, checklist, additionalIssues } = req.body;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Validate serviceType if provided
    if (serviceType) {
      if (!mongoose.Types.ObjectId.isValid(serviceType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service type ID format",
        });
      }
      const serviceTypeExists = await ServiceType.findById(serviceType);
      if (!serviceTypeExists) {
        return res.status(400).json({
          success: false,
          message: "Service type not found",
        });
      }
    }

    let newDate = existingAppointment.appointmentDate;
    if (appointmentDate) {
      newDate = new Date(appointmentDate);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }
      newDate.setHours(0, 0, 0, 0);
    }

    let newTime = existingAppointment.appointmentTime;
    if (appointmentTime) {
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(appointmentTime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid time format. Use HH:MM (24-hour)",
        });
      }
      newTime = appointmentTime;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        make: make || existingAppointment.make,
        model: model || existingAppointment.model,
        year: year || existingAppointment.year,
        carNumberPlate: carNumberPlate || existingAppointment.carNumberPlate,
        mileage: mileage || existingAppointment.mileage,
        serviceType: serviceType || existingAppointment.serviceType,
        appointmentDate: newDate,
        appointmentTime: newTime,
        notes: notes !== undefined ? notes : existingAppointment.notes,
        status: status || existingAppointment.status,
        isAcceptedByWorker: isAcceptedByWorker !== undefined ? isAcceptedByWorker : existingAppointment.isAcceptedByWorker,
        checklist: checklist || existingAppointment.checklist,
        additionalIssues: additionalIssues !== undefined ? additionalIssues : existingAppointment.additionalIssues,
      },
      { new: true, runValidators: true }
    ).populate("serviceType", "name description estimatedTime features");

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignWorkerToAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { workerName } = req.body;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    if (!workerName || typeof workerName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Worker name is required and must be a string",
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate("serviceType");
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const worker = await Worker.findOne({
      fullName: { $regex: new RegExp(workerName, "i") },
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `Worker with name "${workerName}" not found`,
      });
    }

    const conflictingAppointment = await Appointment.findOne({
      worker: worker._id,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      _id: { $ne: appointmentId },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: `Worker "${workerName}" is already assigned to another appointment at ${appointment.appointmentTime} on ${appointment.appointmentDate}`,
      });
    }

    appointment.worker = worker._id;
    appointment.status = "Confirmed";
    appointment.isAcceptedByWorker = false;
    const updatedAppointment = await appointment.save();

    if (!worker.tasks.includes(appointmentId)) {
      worker.tasks.push(appointmentId);
      worker.workload += 1;
      worker.status = "busy";
      await worker.save();
    }

    const populatedAppointment = await Appointment.findById(appointmentId)
      .populate("worker", "fullName email phoneNumber primarySpecialization")
      .populate("serviceType", "name description estimatedTime features");

    res.status(200).json({
      success: true,
      message: "Worker assigned to appointment successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    console.error("Error in assignWorkerToAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const unassignWorkerFromAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const workerId = appointment.worker;
    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "No worker assigned to this appointment",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        worker: null,
        isAcceptedByWorker: false,
        status: "Confirmed",
      },
      { new: true }
    ).populate("serviceType", "name description estimatedTime features");

    const worker = await Worker.findById(workerId);
    worker.tasks = worker.tasks.filter((taskId) => taskId.toString() !== appointmentId);
    if (worker.tasks.length === 0) {
      worker.status = "available";
      worker.workload = 0;
    }
    await worker.save();

    res.status(200).json({
      success: true,
      message: "Worker unassigned from appointment successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error in unassignWorkerFromAppointment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptService = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (!appointment.worker) {
      return res.status(400).json({
        success: false,
        message: "No worker assigned to this appointment",
      });
    }

    const workerId = req.user?.id;
    if (!workerId || appointment.worker.toString() !== workerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You are not assigned to this appointment",
      });
    }

    appointment.isAcceptedByWorker = true;
    appointment.status = "In Progress";
    const updatedAppointment = await appointment.save();

    res.status(200).json({
      success: true,
      message: "Service accepted successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error in acceptService:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found",
      });
    }

    const appointments = await Appointment.find({ userId: req.user.id })
      .populate("worker", "fullName")
      .populate("serviceType", "name description estimatedTime features")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error in getMyAppointments:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  checkAuth,
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
  assignWorkerToAppointment,
  unassignWorkerFromAppointment,
  acceptService,
  getAppointmentById,
};