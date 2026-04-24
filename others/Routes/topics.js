import * as TopicController from "../../Controllers/TopicController.js";
import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/topics", authMiddleware, TopicController.getAllTopics);
router.post("/topics", authMiddleware, TopicController.createTopic);
router.post(
  "/topics/:topicId/subscribe",
  authMiddleware,
  TopicController.subscribeToTopic,
);

router.post(
  "/topics/:topicId/unsubscribe",
  authMiddleware,
  TopicController.unsubscribeFromTopic,
);

router.post(
  "/topics/:topicId/update-times-accessed",
  authMiddleware,
  TopicController.updateTimesAccessed,
);

export default router;
