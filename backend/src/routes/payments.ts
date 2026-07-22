import { Router } from "express";
import { initiatePayment, releasePayment, getPayment } from "../controllers/payments.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/initiate", authMiddleware, initiatePayment);
router.post("/release/:taskId", authMiddleware, releasePayment);
router.get("/:taskId", authMiddleware, getPayment);

export default router;