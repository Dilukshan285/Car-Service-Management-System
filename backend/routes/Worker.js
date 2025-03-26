import { Router } from "express";
import WorkerController from "../controller/Worker.js"; // Middleware to verify JWT
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/add", WorkerController.createWorker);
router.get("/", WorkerController.getWorkers);
router.delete("/delete/:workerId", WorkerController.deleteWorker);
router.put("/update/:workerId", WorkerController.updateWorker);
router.post("/login", WorkerController.loginWorker);
router.get("/schedule", verifyToken, WorkerController.getCurrentSchedule);
router.post("/signout", verifyToken, WorkerController.signoutWorker);


export default router;