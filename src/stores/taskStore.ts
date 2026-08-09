import { create } from "zustand";
import api from "@/lib/api";

export interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  location: string;
  distance: string;
  time: string;
  date: string;
  rating: number;
  imageUrl?: string;
  status: "open" | "in_progress" | "completed";
  posterId: string;
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
  workerId?: string;
  workerName?: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  addTask: (task: { title: string; category: string; description: string; budget: number; location: string; time: string; date: string }) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: string, status: Task["status"]) => Promise<Task>;
  assignWorker: (id: string, workerId: string) => Promise<Task>;
  getTaskById: (id: string) => Task | undefined;
  filterTasks: (filters: TaskFilters) => Task[];
}

export interface TaskFilters {
  search?: string;
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  maxDistance?: number;
  minRating?: number;
  sortBy?: "date" | "budget_high" | "budget_low" | "distance";
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (filters?: TaskFilters) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.category && filters.category !== "All") params.set("category", filters.category);
      if (filters?.minBudget) params.set("minBudget", String(filters.minBudget));
      if (filters?.maxBudget) params.set("maxBudget", String(filters.maxBudget));
      if (filters?.sortBy) params.set("sortBy", filters.sortBy);

      const res = await api.get(`/tasks?${params.toString()}`);
      const rawTasks = Array.isArray(res.data?.tasks) ? res.data.tasks : [];
      // Normalize: ensure every task has an `id` (backend may return `_id`)
      const taskList = rawTasks.map((t: any) => ({
        ...t,
        id: t.id ?? t._id?.toString?.(),
      }));
      set({ tasks: taskList, isLoading: false });
    } catch {
      set({ tasks: [], isLoading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      const res = await api.post("/tasks", taskData);
      const rawTask = res.data?.task;
      if (!rawTask) {
        throw new Error("Task creation did not return a task");
      }
      const newTask = {
        ...rawTask,
        id: rawTask.id ?? rawTask._id?.toString?.(),
      };
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
      return newTask;
    } catch (err) {
      console.error("Failed to create task", err);
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await api.patch(`/tasks/${id}`, data);
      const rawTask = res.data?.task;
      if (!rawTask) {
        throw new Error("Task update did not return a task");
      }
      const updatedTask = {
        ...rawTask,
        id: rawTask.id ?? rawTask._id?.toString?.(),
      };
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
      return updatedTask;
    } catch (err) {
      console.error("Failed to update task", err);
      throw err;
    }
  },

  updateTaskStatus: async (id, status) => {
    return get().updateTask(id, { status });
  },

  assignWorker: async (id, workerId) => {
    try {
      const res = await api.post(`/tasks/${id}/assign`, { workerId });
      const rawTask = res.data?.task;
      if (!rawTask) {
        throw new Error("Worker assignment did not return a task");
      }
      const updatedTask = {
        ...rawTask,
        id: rawTask.id ?? rawTask._id?.toString?.(),
      };
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
      return updatedTask;
    } catch (err) {
      console.error("Failed to assign worker", err);
      throw err;
    }
  },

  getTaskById: (id: string) => {
    return get().tasks.find((t) => t.id === id);
  },

  filterTasks: (filters: TaskFilters) => {
    let filtered = [...get().tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== "All") {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.minBudget !== undefined) {
      filtered = filtered.filter((t) => t.budget >= filters.minBudget!);
    }
    if (filters.maxBudget !== undefined) {
      filtered = filtered.filter((t) => t.budget <= filters.maxBudget!);
    }

    if (filters.maxDistance !== undefined) {
      filtered = filtered.filter((t) => parseFloat(t.distance) <= filters.maxDistance!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((t) => t.rating >= filters.minRating!);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
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

    return filtered;
  },
}));