import type { Request, Response, NextFunction } from "express";
import { users } from "../data/store.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Simple auth middleware that checks for a user-id header.
 * In production this would verify a JWT token.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    res.status(401).json({ error: "Authentication required. Provide x-user-id header." });
    return;
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: "Invalid user." });
    return;
  }

  req.userId = userId;
  next();
}