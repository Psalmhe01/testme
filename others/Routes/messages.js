import authMiddleware from "../middleware/auth.js";
import { Router } from "express";
import {
  getThread,
  getDashboard,
  createMessage,
} from "../../Controllers/MessageController.js";
const router = Router();

router.get("/topics/:topicId", authMiddleware, getThread);
router.post("/topics/:topicId/messages", authMiddleware, createMessage);
router.get("/dashboard", authMiddleware, getDashboard);

export default router;
