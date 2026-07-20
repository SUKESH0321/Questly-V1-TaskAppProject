import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/stores/paymentStore";

interface PaymentModalProps {
  taskId: string;
  amount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PaymentModal({ taskId, amount, open, onOpenChange, onSuccess }: PaymentModalProps) {
  const initiatePayment = usePaymentStore((s) => s.initiatePayment);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    await initiatePayment(taskId, amount);
    setIsProcessing(false);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm & Hold Payment</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This amount will be held in escrow until the task is marked complete and you release it to the tasker.
          </p>
          <p className="mt-4 text-2xl font-semibold">₹{amount}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={isProcessing}>
            {isProcessing ? "Processing..." : `Pay ₹${amount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
