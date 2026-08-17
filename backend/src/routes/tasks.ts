import { Router } from "express";
import {
  getAllTasks,
  getMyPostedTasks,
  getMyWorkedTasks,
  getTaskById,
  createTask,
  updateTask,
  assignWorker,
} from "../controllers/tasks.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllTasks);
// Static routes must be declared before the "/:id" catch-all
router.get("/posted", authMiddleware, getMyPostedTasks);
router.get("/worked", authMiddleware, getMyWorkedTasks);
router.get("/:id", getTaskById);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.post("/:id/assign", authMiddleware, assignWorker);

export default router;
