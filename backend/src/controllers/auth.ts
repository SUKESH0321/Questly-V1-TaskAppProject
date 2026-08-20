import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ error: "A user with this email already exists." });
    return;
  }

  const newUser = new User({
    name,
    email,
    password,
    role: null,
    rating: 5.0,
  });

  await newUser.save();
  const token = generateToken(String(newUser._id));

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      rating: newUser.rating,
    },
    token,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = generateToken(String(user._id));

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rating: user.rating,
    },
    token,
  });
}

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      avatar: user.avatar || "",
      portfolioImages: user.portfolioImages || [],
      rating: user.rating,
    },
  });
}

export async function updateMe(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { name, phone, location, role, avatar, portfolioImages } = req.body;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (avatar !== undefined) user.avatar = avatar;

  // Validate and update portfolioImages when provided: array of up to 5
  // image data URLs or http(s) URLs.
  if (portfolioImages !== undefined) {
    const isValidPortfolio =
      Array.isArray(portfolioImages) &&
      portfolioImages.length <= 5 &&
      portfolioImages.every(
        (img: unknown) =>
          typeof img === "string" &&
          (img.startsWith("data:image/") || /^https?:\/\//i.test(img)),
      );
    if (!isValidPortfolio) {
      res.status(400).json({
        error: "portfolioImages must be an array of up to 5 image data URLs or http(s) URLs.",
      });
      return;
    }
    user.portfolioImages = portfolioImages;
  }

  if (role !== undefined) {
    if (!["customer", "tasker", "both", null].includes(role)) {
      res.status(400).json({ error: "Invalid role." });
      return;
    }
    user.role = role;
  }

  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      avatar: user.avatar || "",
      portfolioImages: user.portfolioImages || [],
      rating: user.rating,
    },
  });
}
