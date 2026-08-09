import { Router } from "express";
import { getAllTasks, getTaskById, createTask, updateTask, assignWorker } from "../controllers/tasks.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.post("/:id/assign", authMiddleware, assignWorker);

export default router;
