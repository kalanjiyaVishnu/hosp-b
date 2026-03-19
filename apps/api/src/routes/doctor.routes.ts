import { Router } from "express";
import { getDoctors, getDoctorSlots } from "../controllers/doctor.controller";

const router = Router();

router.get("/", getDoctors);
router.get("/:id/slots", getDoctorSlots);

export default router;
