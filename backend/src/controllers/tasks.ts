import type { Request, Response } from "express";
import { tasks, users } from "../data/store.js";

export function getAllTasks(req: Request, res: Response) {
  const { search, category, minBudget, maxBudget, sortBy } = req.query;

  let filtered = [...tasks];

  // Filter: search by title, category, description
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Filter: by category
  if (category && typeof category === "string" && category !== "All") {
    filtered = filtered.filter((t) => t.category === category);
  }

  // Filter: budget range
  if (minBudget) {
    filtered = filtered.filter((t) => t.budget >= Number(minBudget));
  }
  if (maxBudget) {
    filtered = filtered.filter((t) => t.budget <= Number(maxBudget));
  }

  // Sort
  if (sortBy && typeof sortBy === "string") {
    switch (sortBy) {
      case "budget_high":
        filtered.sort((a, b) => b.budget - a.budget);
        break;
      case "budget_low":
        filtered.sort((a, b) => a.budget - b.budget);
        break;
      case "date":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "distance":
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
    }
  }

  // Return tasks without sensitive fields
  const result = filtered.map(({ ...t }) => t);
  res.json({ tasks: result });
}

export function getTaskById(req: Request, res: Response) {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }
  res.json({ task });
}

export function createTask(req: Request, res: Response) {
  const { title, description, category, budget, location, time, date } = req.body;

  if (!title || !description || !category || !budget) {
    res.status(400).json({ error: "Title, description, category, and budget are required." });
    return;
  }

  const userId = req.userId!;
  const user = users.find((u) => u.id === userId);

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description,
    category,
    budget: Number(budget),
    rating: 0,
    location: location || "123 Main St, New York",
    distance: "0.5 miles",
    time: time || "ASAP",
    date: date || new Date().toISOString().split("T")[0],
    status: "open" as const,
    posterId: userId,
    posterName: user?.name || "Unknown",
    posterAvatar: user?.avatar,
    posterRating: user?.rating || 5.0,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  res.status(201).json({ task: newTask });
}

export function updateTask(req: Request, res: Response) {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  if (task.posterId !== req.userId) {
    res.status(403).json({ error: "You can only update your own tasks." });
    return;
  }

  const { title, description, category, budget, status } = req.body;
  if (title) task.title = title;
  if (description) task.description = description;
  if (category) task.category = category;
  if (budget) task.budget = Number(budget);
  if (status) task.status = status;

  res.json({ task });
}