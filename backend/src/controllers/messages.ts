import type { Request, Response } from "express";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";

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
          otherUser = { id: user._id.toString(), name: user.name, avatar: user.avatar };
        }
      }
      return { ...conv, id: conv._id.toString(), otherUser };
    })
  );

  res.json({ conversations: enriched });
}

export async function getConversationById(req: Request, res: Response) {
  const userId = req.userId!;
  const conversation = await Conversation.findById(req.params.id).lean();

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found." });
    return;
  }

  if (!conversation.participantIds.some((id) => id.toString() === userId)) {
    res.status(403).json({ error: "You are not a participant in this conversation." });
    return;
  }

  const otherUserId = conversation.participantIds.find(
    (id) => id.toString() !== userId
  );
  let otherUser = null;
  if (otherUserId) {
    const user = await User.findById(otherUserId).lean();
    if (user) {
      otherUser = { id: user._id.toString(), name: user.name, avatar: user.avatar };
    }
  }

  res.json({ conversation: { ...conversation, id: conversation._id.toString(), otherUser } });
}

export async function createConversation(req: Request, res: Response) {
  const { taskId } = req.body;

  if (!taskId) {
    res.status(400).json({ error: "taskId is required." });
    return;
  }

  const userId = req.userId!;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  // Only taskers (or users with both roles) can apply for tasks
  if (user.role !== "tasker" && user.role !== "both") {
    res.status(403).json({
      error: "Only taskers can apply for tasks. Update your role in your profile first.",
    });
    return;
  }

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  if (task.status !== "open") {
    res.status(400).json({ error: "This task is no longer accepting applications." });
    return;
  }

  if (task.posterId.toString() === userId) {
    res.status(400).json({ error: "You cannot apply for your own task." });
    return;
  }

  // Check if a conversation already exists between these two users
  const existing = await Conversation.findOne({
    participantIds: { $all: [userId, task.posterId.toString()] },
  });

  if (existing) {
    // Mark the task as in_progress if it's still open
    if (task.status === "open") {
      task.status = "in_progress";
      await task.save();
    }
    const existingObj = existing.toObject();
    res.status(200).json({
      conversation: { ...existingObj, id: existingObj._id.toString() },
      alreadyExists: true,
    });
    return;
  }

  // Create the conversation
  const newConversation = new Conversation({
    participantIds: [userId, task.posterId.toString()],
    lastMessage: "",
    lastTime: "",
  });
  await newConversation.save();

  // Mark the task as in_progress
  task.status = "in_progress";
  await task.save();

  const newConvObj = newConversation.toObject();
  res.status(201).json({
    conversation: { ...newConvObj, id: newConvObj._id.toString() },
    alreadyExists: false,
  });
}

export async function getMessages(req: Request, res: Response) {
  const convMessages = await Message.find({
    conversationId: req.params.conversationId,
  })
    .sort({ createdAt: 1 })
    .lean();

  const normalized = convMessages.map((m) => ({
    ...m,
    id: m._id.toString(),
  }));

  res.json({ messages: normalized });
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

  const msgObj = newMessage.toObject();
  res.status(201).json({ message: { ...msgObj, id: msgObj._id.toString() } });
}
