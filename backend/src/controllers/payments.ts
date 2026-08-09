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

  // Only the poster (task creator) can pay/hold payment for their own task
  if (task.posterId.toString() !== req.userId) {
    res
      .status(403)
      .json({ error: "Only the task poster can pay for this task." });
    return;
  }

  const existing = await Payment.findOne({ taskId });
  if (existing) {
    res.status(409).json({ error: "Payment already initiated for this task." });
    return;
  }

  // Payee is the assigned worker (tasker) if present, otherwise nobody is paid
  if (!task.workerId) {
    res
      .status(400)
      .json({ error: "A tasker must be assigned to this task before payment can be made." });
    return;
  }

  const newPayment = new Payment({
    taskId,
    payerId: req.userId!,
    payeeId: task.workerId,
    payeeName: task.workerName || "",
    amount: task.budget,
    status: "held",
  });

  await newPayment.save();

  const paymentObj = newPayment.toObject();
  res.status(201).json({ payment: { ...paymentObj, id: paymentObj._id.toString() } });
}

export async function releasePayment(req: Request, res: Response) {
  const payment = await Payment.findOne({ taskId: req.params.taskId });
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }

  // Only the payer (poster) can release the escrowed payment
  if (payment.payerId.toString() !== req.userId) {
    res
      .status(403)
      .json({ error: "Only the payer can release this payment." });
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

  // When payment is released, mark the task as completed
  await Task.findByIdAndUpdate(payment.taskId, { status: "completed" });

  const paymentObj = payment.toObject();
  res.json({ payment: { ...paymentObj, id: paymentObj._id.toString() } });
}

export async function getPayment(req: Request, res: Response) {
  const payment = await Payment.findOne({ taskId: req.params.taskId }).lean();
  if (!payment) {
    res.status(404).json({ error: "Payment not found for this task." });
    return;
  }

  res.json({ payment: { ...payment, id: payment._id.toString() } });
}

export async function getMyPayments(req: Request, res: Response) {
  const payments = await Payment.find({
    $or: [{ payerId: req.userId }, { payeeId: req.userId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const normalized = payments.map((p) => ({
    ...p,
    id: p._id.toString(),
  }));

  res.json({ payments: normalized });
}
