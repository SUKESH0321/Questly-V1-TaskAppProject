import type { Request, Response } from "express";
import { users } from "../data/store.js";

export function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    res.status(409).json({ error: "A user with this email already exists." });
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In production: hash the password
    role: null as "customer" | "tasker" | "both" | null,
    rating: 5.0,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, rating: newUser.rating },
  });
}

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const user = users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    // In production: compare hashed passwords
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, rating: user.rating },
  });
}

export function getMe(req: Request, res: Response) {
  const user = users.find((u) => u.id === req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, rating: user.rating },
  });
}