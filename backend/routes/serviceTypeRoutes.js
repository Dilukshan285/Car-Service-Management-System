import { Router } from "express";
import {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
} from "../controller/ServiceTypeController.js"; // Updated to include .js

const router = Router();

router.post("/create", createServiceType);
router.get("/", getServiceTypes);
router.get("/:id", getServiceTypeById);
router.put("/update/:id", updateServiceType);
router.delete("/delete/:id", deleteServiceType);

export default router;