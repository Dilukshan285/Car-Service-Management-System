import { Router } from "express";
import WorkerController from "../controller/Worker.js";

const router = Router();

router.post("/add", WorkerController.createWorker);
router.get("/", WorkerController.getWorkers);
router.put("/update/:workerId", WorkerController.updateWorker);
router.delete("/delete/:workerId", WorkerController.deleteWorker);

export default router;