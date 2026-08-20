import { Router } from "express";
import { getUserById } from "../controllers/users.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/:id", authMiddleware, getUserById);

export default router;