import type { Request, Response } from "express";
import { payments, tasks } from "../data/store.js";

export function initiatePayment(req: Request, res: Response) {
  const { taskId } = req.body;

  if (!taskId) {
    res.status(400).json({ error: "taskId is required." });
    return;
  }

  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  const existing = payments.find((p) => p.taskId === taskId);
  if (existing) {
    res.status(409).json({ error: "Payment already initiated for this task." });
    return;
  }

  const newPayment = {
    id: `pay-${Date.now()}`,
    taskId,
    payerId: req.userId!,
    payeeId: task.posterId,
    amount: task.budget,
    status: "held" as const,
    createdAt: new Date().toISOString(),
  };

  payments.push(newPayment);
  res.status(201).json({ payment: newPayment });
}

export function releasePayment(req: Request, res: Response) {
  const payment = payments.find((p) => p.taskId === req.params.taskId);
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }

  if (payment.status !== "held") {
    res.status(400).json({ error: `Cannot release a payment that is ${payment.status}.` });
    return;
  }

  payment.status = "released";
  payment.releasedAt = new Date().toISOString();

  res.json({ payment });
}

export function getPayment(req: Request, res: Response) {
  const payment = payments.find((p) => p.taskId === req.params.taskId);
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }
  res.json({ payment });
}