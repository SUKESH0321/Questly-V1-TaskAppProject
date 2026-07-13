import { create } from "zustand";

export type UserRole = "customer" | "tasker" | "both" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  setRole: (role: UserRole) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // Mock login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      user: {
        id: "user-1",
        name: "Sukesh",
        email,
        role: "customer",
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    // Mock register
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      user: {
        id: "user-1",
        name,
        email,
        role: null,
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setRole: (role: UserRole) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    }));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));