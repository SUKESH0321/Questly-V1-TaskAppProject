import { create } from "zustand";
import api from "@/lib/api";

export type UserRole = "customer" | "tasker" | "both" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  rating: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  setRole: (role: UserRole) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      localStorage.setItem("questly_token", token);
      localStorage.setItem("questly_user_id", user.id);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error?: string } } }).response?.data?.error || "Login failed"
          : "Login failed";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { user, token } = res.data;
      localStorage.setItem("questly_token", token);
      localStorage.setItem("questly_user_id", user.id);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error?: string } } }).response?.data?.error || "Registration failed"
          : "Registration failed";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  setRole: async (role: UserRole) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    }));
    try {
      const res = await api.patch("/auth/me", { role });
      const updated = res.data.user;
      set({ user: updated });
    } catch (err) {
      console.error("Failed to update role", err);
    }
  },

  logout: () => {
    localStorage.removeItem("questly_token");
    localStorage.removeItem("questly_user_id");
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  updateUser: async (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
    try {
      const res = await api.patch("/auth/me", data);
      const updated = res.data.user;
      set({ user: updated });
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem("questly_token");
    if (!token) {
      set({ isAuthenticated: false, isLoading: false, user: null });
      return;
    }

    set({ isLoading: true });

    try {
      const res = await api.get("/auth/me");
      const user = res.data.user;
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      localStorage.removeItem("questly_token");
      localStorage.removeItem("questly_user_id");
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },
}));