import type { Request, Response } from "express";
import { User } from "../models/User.js";

/**
 * Builds a safe, public-facing payload for a user.
 * Never exposes email or any sensitive fields.
 */
function publicUserPayload(user: Record<string, any>) {
  return {
    id: user._id,
    name: user.name,
    role: user.role,
    phone: user.phone || "",
    location: user.location || "",
    avatar: user.avatar || "",
    portfolioImages: user.portfolioImages || [],
    rating: user.rating,
    createdAt: user.createdAt,
  };
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || id === "undefined") {
    res.status(400).json({ error: "A valid user id is required." });
    return;
  }

  try {
    const user = await User.findById(id).lean();
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    res.json({ user: publicUserPayload(user) });
  } catch {
    res.status(400).json({ error: "A valid user id is required." });
  }
}