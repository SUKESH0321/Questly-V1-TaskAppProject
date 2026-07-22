import type { Request, Response } from "express";
import { conversations, messages, users } from "../data/store.js";

export function getConversations(req: Request, res: Response) {
  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(req.userId!)
  );

  const enriched = userConversations.map((conv) => {
    const otherUserId = conv.participantIds.find((id) => id !== req.userId!);
    const otherUser = users.find((u) => u.id === otherUserId);
    return {
      ...conv,
      otherUser: otherUser
        ? { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar }
        : null,
    };
  });

  res.json({ conversations: enriched });
}

export function getMessages(req: Request, res: Response) {
  const convMessages = messages.filter((m) => m.conversationId === req.params.conversationId);
  res.json({ messages: convMessages });
}

export function sendMessage(req: Request, res: Response) {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: "Message text is required." });
    return;
  }

  const conversation = conversations.find((c) => c.id === req.params.conversationId);
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found." });
    return;
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    conversationId: req.params.conversationId,
    senderId: req.userId!,
    text,
    time: "Just now",
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  conversation.lastMessage = text;
  conversation.lastTime = "Just now";

  res.status(201).json({ message: newMessage });
}