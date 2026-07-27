import type { Request, Response } from "express";
import { Payment } from "../models/Payment.js";
import { Task } from "../models/Task.js";

export async function initiatePayment(req: Request, res: Response) {
  const { taskId } = req.body;

  if (!taskId) {
    res.status(400).json({ error: "taskId is required." });
    return;
  }

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  const existing = await Payment.findOne({ taskId });
  if (existing) {
    res.status(409).json({ error: "Payment already initiated for this task." });
    return;
  }

  const newPayment = new Payment({
    taskId,
    payerId: req.userId!,
    payeeId: task.posterId,
    amount: task.budget,
    status: "held",
  });

  await newPayment.save();

  res.status(201).json({ payment: newPayment.toObject() });
}

export async function releasePayment(req: Request, res: Response) {
  const payment = await Payment.findOne({ taskId: req.params.taskId });
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }

  if (payment.status !== "held") {
    res
      .status(400)
      .json({ error: `Cannot release a payment that is ${payment.status}.` });
    return;
  }

  payment.status = "released";
  payment.releasedAt = new Date();
  await payment.save();

  res.json({ payment: payment.toObject() });
}

export async function getPayment(req: Request, res: Response) {
  const payment = await Payment.findOne({ taskId: req.params.taskId }).lean();
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }

  res.json({ payment });
}