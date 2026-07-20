import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaymentStore } from "@/stores/paymentStore";

export function ReleasePaymentButton({ taskId }: { taskId: string }) {
  const releasePayment = usePaymentStore((s) => s.releasePayment);
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = async () => {
    setIsReleasing(true);
    await releasePayment(taskId);
    setIsReleasing(false);
  };

  return (
    <Button onClick={handleRelease} disabled={isReleasing}>
      {isReleasing ? "Releasing..." : "Confirm Task & Release Payment"}
    </Button>
  );
}
