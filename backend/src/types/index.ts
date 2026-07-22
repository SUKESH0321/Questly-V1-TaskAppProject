export type UserRole = "customer" | "tasker" | "both";
export type TaskStatus = "open" | "in_progress" | "completed";
export type EscrowStatus = "pending" | "held" | "released" | "refunded" | "disputed";
export type NotificationType = "application" | "message" | "payment" | "review" | "status" | "system";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole | null;
  phone?: string;
  location?: string;
  avatar?: string;
  rating: number;
  createdAt: string;
}

export interface Task {
  id: string;
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
  posterId: string;
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  taskId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  status: EscrowStatus;
  createdAt: string;
  releasedAt?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastTime: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  time: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
}