import { Router } from "express";
import {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessage,
} from "../controllers/messages.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getConversations);
router.post("/", authMiddleware, createConversation);
router.get("/:id", authMiddleware, getConversationById);
router.get("/:conversationId/messages", authMiddleware, getMessages);
router.post("/:conversationId/messages", authMiddleware, sendMessage);

export default router;
