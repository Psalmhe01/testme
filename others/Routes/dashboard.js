import { Router } from "express";
import authRoutes from "./auth.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.use(authRoutes);

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

export default router;
