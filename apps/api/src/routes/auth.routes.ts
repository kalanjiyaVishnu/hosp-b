import { Router } from "express";
import { register, login, getMe, refreshToken } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { registerSchema, loginSchema } from "shared";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authenticateToken, getMe);
router.post("/refresh", refreshToken);

export default router;
