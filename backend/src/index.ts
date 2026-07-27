import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import paymentRoutes from "./routes/payments.js";
import messageRoutes from "./routes/messages.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/conversations", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------- Start ----------
async function start() {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Questly API server running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start();