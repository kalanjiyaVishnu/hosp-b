import { Router } from "express";
import { 
  createBooking, 
  getMyBookings, 
  getCurrentBooking,
  approveBooking, 
  rejectBooking,
  completeBooking,
  cancelBooking,
  getAllBookings 
} from "../controllers/booking.controller";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { bookingSchema } from "shared";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(bookingSchema), createBooking);
router.get("/my", getMyBookings);
router.get("/current", getCurrentBooking);
router.get("/", requireRole(["ADMIN", "DOCTOR"]), getAllBookings);
router.patch("/:id/approve", requireRole(["ADMIN", "DOCTOR"]), approveBooking);
router.patch("/:id/reject", requireRole(["ADMIN", "DOCTOR"]), rejectBooking);
router.patch("/:id/complete", requireRole(["ADMIN", "DOCTOR"]), completeBooking);
router.delete("/:id", cancelBooking);

export default router;
