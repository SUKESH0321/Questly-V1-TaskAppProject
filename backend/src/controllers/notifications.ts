import type { Request, Response } from "express";
import { Notification } from "../models/Notification.js";

export async function getNotifications(req: Request, res: Response) {
  const userNotifications = await Notification.find({ userId: req.userId! })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ notifications: userNotifications });
}

export async function markAsRead(req: Request, res: Response) {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }
  notification.read = true;
  await notification.save();
  res.json({ notification: notification.toObject() });
}

export async function markAllAsRead(req: Request, res: Response) {
  await Notification.updateMany(
    { userId: req.userId!, read: false },
    { $set: { read: true } }
  );
  res.json({ success: true });
}