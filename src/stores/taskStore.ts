import { create } from "zustand";

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
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status" | "rating" | "posterName" | "posterRating">) => void;
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

const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Assemble IKEA Wardrobe",
    category: "Furniture Assembly",
    description: "Need help assembling a new IKEA wardrobe in my bedroom. Tools and instructions provided.",
    budget: 50,
    location: "123 Main St, New York",
    distance: "1.2 miles",
    time: "Today, 2:00 PM",
    date: "2026-07-13",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1595514535415-3bdc1b4d081e?q=80&w=600&auto=format&fit=crop",
    status: "open",
    posterName: "Sarah Jenkins",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    posterRating: 4.9,
    createdAt: "2026-07-13T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Deep Clean 2BHK Apartment",
    category: "Cleaning",
    description: "Need a thorough deep cleaning of my 2-bedroom apartment including bathrooms, kitchen and windows.",
    budget: 120,
    location: "456 Oak Ave, New York",
    distance: "0.8 miles",
    time: "Tomorrow, 9:00 AM",
    date: "2026-07-14",
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    status: "open",
    posterName: "Michael Chen",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    posterRating: 4.7,
    createdAt: "2026-07-13T09:00:00Z",
  },
  {
    id: "task-3",
    title: "Deliver Documents to Downtown",
    category: "Delivery",
    description: "Need someone to pick up and deliver important documents to downtown office.",
    budget: 25,
    location: "789 Pine Rd, New York",
    distance: "3.5 miles",
    time: "Within 2 hours",
    date: "2026-07-13",
    rating: 4.5,
    status: "open",
    posterName: "Emily Rodriguez",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    posterRating: 4.8,
    createdAt: "2026-07-13T08:30:00Z",
  },
  {
    id: "task-4",
    title: "Fix Leaking Kitchen Sink",
    category: "Plumbing",
    description: "Kitchen sink is leaking under the cabinet. Need a plumber to fix it ASAP.",
    budget: 80,
    location: "321 Elm St, New York",
    distance: "2.1 miles",
    time: "Today, Any time",
    date: "2026-07-13",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57cb640d2?q=80&w=600&auto=format&fit=crop",
    status: "open",
    posterName: "David Kim",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    posterRating: 4.6,
    createdAt: "2026-07-13T07:00:00Z",
  },
  {
    id: "task-5",
    title: "Help Move Sofa",
    category: "Moving",
    description: "Need help moving a large sofa from second floor apartment to moving truck.",
    budget: 40,
    location: "654 Maple Dr, New York",
    distance: "5.0 miles",
    time: "Saturday, 10:00 AM",
    date: "2026-07-18",
    rating: 4.7,
    status: "open",
    posterName: "Lisa Thompson",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    posterRating: 5.0,
    createdAt: "2026-07-12T15:00:00Z",
  },
  {
    id: "task-6",
    title: "Math Tutor for 10th Grader",
    category: "Tutoring",
    description: "Looking for a math tutor for my 10th grade son. Focus on algebra and geometry.",
    budget: 35,
    location: "987 Cedar Ln, New York",
    distance: "1.5 miles",
    time: "Weekly, Evenings",
    date: "2026-07-14",
    rating: 4.9,
    status: "open",
    posterName: "James Wilson",
    posterAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704i",
    posterRating: 4.5,
    createdAt: "2026-07-12T10:00:00Z",
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: DEFAULT_TASKS,

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: "open",
      rating: 0,
      posterName: "You",
      posterRating: 5.0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
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
      filtered = filtered.filter((t) => {
        const dist = parseFloat(t.distance);
        return dist <= filters.maxDistance!;
      });
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