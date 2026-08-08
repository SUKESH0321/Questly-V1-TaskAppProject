import type { Request, Response } from "express";
import { Notification } from "../models/Notification.js";

export async function getNotifications(req: Request, res: Response) {
  const userNotifications = await Notification.find({ userId: req.userId! })
    .sort({ createdAt: -1 })
    .lean();

  const normalized = userNotifications.map((n) => ({
    ...n,
    id: n._id.toString(),
  }));

  res.json({ notifications: normalized });
}

export async function markAsRead(req: Request, res: Response) {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }
  notification.read = true;
  await notification.save();
  const notifObj = notification.toObject();
  res.json({ notification: { ...notifObj, id: notifObj._id.toString() } });
}

export async function markAllAsRead(req: Request, res: Response) {
  await Notification.updateMany(
    { userId: req.userId!, read: false },
    { $set: { read: true } }
  );
  res.json({ success: true });
}