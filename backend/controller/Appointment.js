import Appointment from "../models/Appointment.js";
import Worker from "../models/Worker.js";

const createAppointment = async (req, res) => {
  try {
    const { carType, carNumberPlate, serviceType, appointmentDate } = req.body;

    const newAppointment = new Appointment({
      carType,
      carNumberPlate,
      serviceType,
      appointmentDate,
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("worker", "name") // Populate worker name
      .sort({ appointmentDate: -1 });

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
    console.log("Received PUT request to update appointment:", req.params.appointmentId);
    const { appointmentId } = req.params;
    const { carType, carNumberPlate, serviceType, appointmentDate } = req.body;

    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format.",
      });
    }

    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        carType: carType || existingAppointment.carType,
        carNumberPlate: carNumberPlate || existingAppointment.carNumberPlate,
        serviceType: serviceType || existingAppointment.serviceType,
        appointmentDate: appointmentDate || existingAppointment.appointmentDate,
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
        message: "Invalid appointment ID format.",
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
    const { workerName } = req.body; // Updated to accept workerName

    // Validate appointmentId format
    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format.",
      });
    }

    // Validate workerName
    if (!workerName || typeof workerName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Worker name is required and must be a string.",
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Find worker by name (case-insensitive)
    const worker = await Worker.findOne({ name: { $regex: new RegExp(`^${workerName}$`, "i") } });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `Worker with name "${workerName}" not found.`,
      });
    }

    // Update appointment with worker's _id
    appointment.worker = worker._id;
    await appointment.save();

    // Add appointment to worker's tasks
    if (!worker.tasks.includes(appointmentId)) {
      worker.tasks.push(appointmentId);
      await worker.save();
    }

    res.status(200).json({
      success: true,
      message: "Worker assigned to appointment successfully",
      data: appointment,
    });
  } catch (error) {
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
        message: "Invalid appointment ID format.",
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
        message: "No worker assigned to this appointment.",
      });
    }

    appointment.worker = null;
    await appointment.save();

    const worker = await Worker.findById(workerId);
    worker.tasks = worker.tasks.filter((taskId) => taskId.toString() !== appointmentId);
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