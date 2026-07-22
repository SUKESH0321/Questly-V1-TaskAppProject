import type { Request, Response } from "express";
import { notifications } from "../data/store.js";

export function getNotifications(req: Request, res: Response) {
  const userNotifications = notifications.filter((n) => n.userId === req.userId!);
  res.json({ notifications: userNotifications });
}

export function markAsRead(req: Request, res: Response) {
  const notification = notifications.find((n) => n.id === req.params.id);
  if (!notification) {
    res.status(404).json({ error: "Notification not found." });
    return;
  }
  notification.read = true;
  res.json({ notification });
}

export function markAllAsRead(req: Request, res: Response) {
  notifications
    .filter((n) => n.userId === req.userId!)
    .forEach((n) => (n.read = true));
  res.json({ success: true });
}