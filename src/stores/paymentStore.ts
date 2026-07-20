import { create } from "zustand";
import type { EscrowStatus, Payment } from "@/types/payment";

interface PaymentState {
  payments: Record<string, Payment>; // keyed by taskId

  initiatePayment: (taskId: string, amount: number) => Promise<void>;
  releasePayment: (taskId: string) => Promise<void>;
  refundPayment: (taskId: string) => Promise<void>;
  disputePayment: (taskId: string) => void;
  getPayment: (taskId: string) => Payment | undefined;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: {},

  initiatePayment: async (taskId, amount) => {
    const newPayment: Payment = {
      id: crypto.randomUUID(),
      taskId,
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      payments: { ...state.payments, [taskId]: newPayment },
    }));

    // stand-in for the real gateway's processing time
    await delay(1200);

    set((state) => ({
      payments: {
        ...state.payments,
        [taskId]: { ...state.payments[taskId], status: "held" as EscrowStatus },
      },
    }));
  },

  releasePayment: async (taskId) => {
    await delay(800);
    set((state) => {
      const existing = state.payments[taskId];
      if (!existing) return state;
      return {
        payments: {
          ...state.payments,
          [taskId]: {
            ...existing,
            status: "released",
            releasedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  refundPayment: async (taskId) => {
    await delay(800);
    set((state) => {
      const existing = state.payments[taskId];
      if (!existing) return state;
      return {
        payments: { ...state.payments, [taskId]: { ...existing, status: "refunded" } },
      };
    });
  },

  disputePayment: (taskId) => {
    set((state) => {
      const existing = state.payments[taskId];
      if (!existing) return state;
      return {
        payments: { ...state.payments, [taskId]: { ...existing, status: "disputed" } },
      };
    });
  },

  getPayment: (taskId) => get().payments[taskId],
}));
