import { Router } from "express";
import { register, login, getMe, updateMe } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);

export default router;
