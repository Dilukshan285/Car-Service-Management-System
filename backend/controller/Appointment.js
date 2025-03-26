import Appointment from "../models/Appointment.js";
import Worker from "../models/Worker.js";
import User from "../models/Usermodel.js";

const createAppointment = async (req, res) => {
  try {
    const { carType, carNumberPlate, serviceType, appointmentDate, appointmentTime } = req.body;

    // Validate required fields
    if (!carType || !carNumberPlate || !serviceType || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "All fields (carType, carNumberPlate, serviceType, appointmentDate, appointmentTime) are required",
      });
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found",
      });
    }

    // Fetch user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userName = `${user.first_name} ${user.last_name}`;

    // Parse and validate appointmentDate
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }
    // Set to start of day for consistency
    parsedDate.setHours(0, 0, 0, 0);

    // Validate appointmentTime format (HH:MM)
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(appointmentTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM (24-hour)",
      });
    }

    // Check for existing appointment with same carNumberPlate at the same date and time
    const existingAppointment = await Appointment.findOne({
      carNumberPlate,
      appointmentDate: parsedDate,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "An appointment already exists for this vehicle at this date and time",
      });
    }

    const newAppointment = new Appointment({
      carType,
      carNumberPlate,
      serviceType,
      appointmentDate: parsedDate,
      appointmentTime,
      user: userName,
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This car number plate already has an appointment at this time",
      });
    }
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

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { carType, carNumberPlate, serviceType, appointmentDate, appointmentTime } = req.body;

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
        carType: carType || existingAppointment.carType,
        carNumberPlate: carNumberPlate || existingAppointment.carNumberPlate,
        serviceType: serviceType || existingAppointment.serviceType,
        appointmentDate: newDate,
        appointmentTime: newTime,
      },
      { new: true, runValidators: true }
    );

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

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const worker = await Worker.findOne({ 
      fullName: { $regex: new RegExp(workerName, "i") } 
    });
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `Worker with name "${workerName}" not found`,
      });
    }

    // Check for conflicting appointments at the exact same time
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

    // Assign the worker to the appointment
    appointment.worker = worker._id;
    appointment.status = "In Progress";
    const updatedAppointment = await appointment.save();

    // Update worker's tasks and status
    if (!worker.tasks.includes(appointmentId)) {
      worker.tasks.push(appointmentId);
      worker.workload += 1;
      worker.status = "busy"; // Worker remains busy as long as they have tasks
      await worker.save();
    }

    // Populate the worker details in the response
    const populatedAppointment = await Appointment.findById(appointmentId)
      .populate("worker", "fullName email phoneNumber primarySpecialization");

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

    appointment.worker = null;
    await appointment.save();

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
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  assignWorkerToAppointment,
  unassignWorkerFromAppointment,
};