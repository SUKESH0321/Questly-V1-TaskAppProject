import type { Request, Response } from "express";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export async function getConversations(req: Request, res: Response) {
  const userId = req.userId!;

  const conversations = await Conversation.find({
    participantIds: userId,
  }).lean();

  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const otherUserId = conv.participantIds.find(
        (id) => id.toString() !== userId
      );
      let otherUser = null;
      if (otherUserId) {
        const user = await User.findById(otherUserId).lean();
        if (user) {
          otherUser = { id: user._id, name: user.name, avatar: user.avatar };
        }
      }
      return { ...conv, otherUser };
    })
  );

  res.json({ conversations: enriched });
}

export async function getMessages(req: Request, res: Response) {
  const convMessages = await Message.find({
    conversationId: req.params.conversationId,
  })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages: convMessages });
}

export async function sendMessage(req: Request, res: Response) {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: "Message text is required." });
    return;
  }

  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found." });
    return;
  }

  const newMessage = new Message({
    conversationId: req.params.conversationId,
    senderId: req.userId!,
    text,
    time: "Just now",
  });

  await newMessage.save();

  conversation.lastMessage = text;
  conversation.lastTime = "Just now";
  await conversation.save();

  res.status(201).json({ message: newMessage.toObject() });
}