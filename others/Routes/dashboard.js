import { Router } from "express";
import authRoutes from "./auth.js";
import authMiddleware from "../middleware/auth.js";
import { getDashboard } from "../../Controllers/MessageController.js";

const router = Router();

router.use(authRoutes);

router.get("/", authMiddleware, getDashboard);
router.get("/dashboard", authMiddleware, getDashboard);

export default router;
