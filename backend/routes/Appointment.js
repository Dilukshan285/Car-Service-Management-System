import { Router } from "express";
import AppointmentController from "../controller/Appointment.js";

const router = Router();

router.post("/book", AppointmentController.createAppointment);
router.get("/", AppointmentController.getAppointments);
router.put("/update/:appointmentId", AppointmentController.updateAppointment);
router.delete("/delete/:appointmentId", AppointmentController.deleteAppointment);
router.put("/assign-worker/:appointmentId", AppointmentController.assignWorkerToAppointment);
router.put("/unassign-worker/:appointmentId", AppointmentController.unassignWorkerFromAppointment);

export default router;