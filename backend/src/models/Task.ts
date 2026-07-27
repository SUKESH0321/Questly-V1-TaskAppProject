import mongoose, { Schema, Document } from "mongoose";

export type TaskStatus = "open" | "in_progress" | "completed";

export interface ITask extends Document {
  title: string;
  description: string;
  category: string;
  budget: number;
  rating: number;
  location: string;
  distance: string;
  time: string;
  date: string;
  imageUrl?: string;
  status: TaskStatus;
  posterId: mongoose.Types.ObjectId;
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    location: { type: String, default: "123 Main St, New York" },
    distance: { type: String, default: "0.5 miles" },
    time: { type: String, default: "ASAP" },
    date: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["open", "in_progress", "completed"], default: "open" },
    posterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    posterName: { type: String, required: true },
    posterAvatar: { type: String, default: "" },
    posterRating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);