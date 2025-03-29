import { Router } from "express";
import AppointmentController from "../controller/Appointment.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/book", verifyToken,AppointmentController.createAppointment);
router.get("/check", verifyToken, AppointmentController.checkAuth);
router.get("/", AppointmentController.getAppointments);
router.get("/my-appointments", verifyToken, AppointmentController.getMyAppointments);
router.put("/update/:appointmentId", AppointmentController.updateAppointment);
router.delete("/delete/:appointmentId", AppointmentController.deleteAppointment);
router.put("/assign-worker/:appointmentId", AppointmentController.assignWorkerToAppointment);
router.put("/unassign-worker/:appointmentId", AppointmentController.unassignWorkerFromAppointment);
router.put("/accept-service/:appointmentId", verifyToken, AppointmentController.acceptService);

export default router;