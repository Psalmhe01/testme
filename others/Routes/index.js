import { Router } from "express";
import path from "path";

const router = Router();

router.get("/", (req, res) => {
  // Use sendFile for normal HTML files
  res.sendFile(path.join(process.cwd(), "index.html"));
});

export default router;
