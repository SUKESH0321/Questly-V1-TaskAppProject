import type { Request, Response } from "express";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

export async function getAllTasks(req: Request, res: Response) {
  const { search, category, minBudget, maxBudget, sortBy } = req.query;

  // Build filter
  const filter: Record<string, any> = {};

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (category && typeof category === "string" && category !== "All") {
    filter.category = category;
  }

  if (minBudget) {
    filter.budget = { ...filter.budget, $gte: Number(minBudget) };
  }
  if (maxBudget) {
    filter.budget = { ...filter.budget, $lte: Number(maxBudget) };
  }

  // Build sort
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sortBy && typeof sortBy === "string") {
    switch (sortBy) {
      case "budget_high":
        sortOption = { budget: -1 };
        break;
      case "budget_low":
        sortOption = { budget: 1 };
        break;
      case "date":
        sortOption = { createdAt: -1 };
        break;
    }
  }

  const tasks = await Task.find(filter).sort(sortOption).lean();

  const normalized = tasks.map((t) => ({
    ...t,
    id: t._id.toString(),
  }));

  res.json({ tasks: normalized });
}

export async function getTaskById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || id === "undefined") {
    res.status(400).json({ error: "A valid task id is required." });
    return;
  }

  try {
    const task = await Task.findById(id).lean();
    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }
    res.json({ task: { ...task, id: task._id.toString() } });
  } catch (err) {
    res.status(400).json({ error: "A valid task id is required." });
  }
}

export async function createTask(req: Request, res: Response) {
  const { title, description, category, budget, location, time, date } = req.body;

  if (!title || !description || !category || !budget) {
    res.status(400).json({ error: "Title, description, category, and budget are required." });
    return;
  }

  const userId = req.userId!;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const newTask = new Task({
    title,
    description,
    category,
    budget: Number(budget),
    location: location || "123 Main St, New York",
    time: time || "ASAP",
    date: date || new Date().toISOString().split("T")[0],
    posterId: userId,
    posterName: user.name,
    posterAvatar: user.avatar,
    posterRating: user.rating || 5.0,
  });

  await newTask.save();

  const saved = newTask.toObject();
  res.status(201).json({ task: { ...saved, id: saved._id.toString() } });
}

export async function updateTask(req: Request, res: Response) {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  if (task.posterId.toString() !== req.userId) {
    res.status(403).json({ error: "You can only update your own tasks." });
    return;
  }

  const { title, description, category, budget, location, time, date, status } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (category !== undefined) task.category = category;
  if (budget !== undefined) task.budget = Number(budget);
  if (location !== undefined) task.location = location;
  if (time !== undefined) task.time = time;
  if (date !== undefined) task.date = date;

  // Validate status transitions
  if (status !== undefined) {
    const validStatuses = ["open", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid task status." });
      return;
    }
    task.status = status;
  }

  await task.save();

  const saved = task.toObject();
  res.json({ task: { ...saved, id: saved._id.toString() } });
}

export async function assignWorker(req: Request, res: Response) {
  const { workerId } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  if (task.posterId.toString() !== req.userId) {
    res.status(403).json({ error: "You can only assign a worker to your own tasks." });
    return;
  }

  if (!workerId) {
    res.status(400).json({ error: "workerId is required." });
    return;
  }

  const worker = await User.findById(workerId);
  if (!worker) {
    res.status(404).json({ error: "Worker not found." });
    return;
  }

  if (task.status !== "open") {
    res.status(400).json({ error: "You can only assign a worker to an open task." });
    return;
  }

  task.workerId = worker._id;
  task.workerName = worker.name;
  task.status = "in_progress";
  await task.save();

  const saved = task.toObject();
  res.json({ task: { ...saved, id: saved._id.toString() } });
}
