import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Share2,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { usePaymentStore } from "@/stores/paymentStore";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { ReleasePaymentButton } from "@/components/payments/ReleasePaymentButton";
import { EscrowBadge } from "@/components/shared/EscrowBadge";

interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  location: string;
  distance: string;
  time: string;
  date: string;
  imageUrl?: string;
  status: string;
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
}

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const payment = usePaymentStore((s) =>
    task ? s.getPayment(task.id) : undefined,
  );
  const safeTask = task ?? null;

  useEffect(() => {
    if (!id) {
      setError("No task ID provided");
      setIsLoading(false);
      return;
    }
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        const fetchedTask = res.data?.task;
        setTask(fetchedTask || null);
        if (!fetchedTask) {
          setError("Task not found");
        }
      } catch (err) {
        setError("Task not found");
        console.error("Failed to fetch task", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-16 h-16 rounded-full bg-muted animate-pulse mb-4" />
        <div className="h-6 bg-muted rounded w-48 animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded w-64 animate-pulse" />
      </div>
    );
  }

  if (error || !safeTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Task not found
        </h2>
        <p className="text-muted-foreground mb-4">
          This task doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/tasks">Browse Tasks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 w-full bg-muted">
        {safeTask.imageUrl ? (
          <img
            src={safeTask.imageUrl}
            alt={safeTask.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/30">
              {safeTask.category || "Task"}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md"
            asChild
          >
            <Link to="/tasks">
              <ArrowLeft size={20} />
            </Link>
          </Button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md"
          >
            <Share2 size={20} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md"
          >
            <Bookmark size={20} />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {safeTask.category || "General"}
                </Badge>
                {safeTask.status === "open" && (
                  <Badge
                    variant="outline"
                    className="text-amber-500 border-amber-500/30 bg-amber-500/5"
                  >
                    Open
                  </Badge>
                )}
                {payment && <EscrowBadge status={payment.status} />}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {safeTask.title || "Untitled task"}
              </h1>
            </div>

            <div className="text-left md:text-right">
              <div className="text-sm text-muted-foreground mb-1">Budget</div>
              <div className="text-3xl font-bold text-primary">
                ₹{safeTask.budget || 0}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-border mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                <MapPin />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">
                  {safeTask.location || "Location unavailable"}
                </p>
                <span className="text-xs text-primary font-medium mt-1 inline-block">
                  {safeTask.distance || "Distance unavailable"} away
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                <Calendar />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  {safeTask.time || "Time TBD"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {safeTask.date || "Date TBD"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {safeTask.description || "No description provided."}
              </p>
            </div>

            {/* Payment / Escrow Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <div className="p-4 rounded-2xl border border-border bg-muted/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {!payment && "Payment hasn't been made for this task yet."}
                    {payment?.status === "pending" &&
                      "Payment is being processed."}
                    {payment?.status === "held" &&
                      "Payment is held in escrow until the task is completed."}
                    {payment?.status === "released" &&
                      "Payment has been released to the tasker."}
                    {payment?.status === "refunded" && "Payment was refunded."}
                    {payment?.status === "disputed" &&
                      "Payment is under dispute."}
                  </p>
                </div>

                {!payment && (
                  <Button onClick={() => setPaymentModalOpen(true)}>
                    Pay & Confirm ₹{safeTask.budget || 0}
                  </Button>
                )}

                {payment?.status === "held" && (
                  <ReleasePaymentButton taskId={safeTask.id} />
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Posted By</h2>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={safeTask.posterAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(safeTask.posterName || "Task poster")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold flex items-center gap-1">
                      {safeTask.posterName || "Task poster"}
                      <ShieldCheck size={16} className="text-accent" />
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center text-amber-500">
                        <Star size={14} className="fill-current" />
                        <span className="ml-1 font-medium text-foreground">
                          {(safeTask.posterRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span>•</span>
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-xl font-bold mb-4">Map</h2>
              <div className="h-48 rounded-2xl bg-muted border border-border flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      'url("https://www.transparenttextures.com/patterns/cubes.png")',
                  }}
                ></div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center absolute">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Apply Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border z-50 md:hidden">
        <Button
          size="lg"
          className="w-full text-lg shadow-lg shadow-primary/25"
        >
          Apply for ₹{safeTask.budget || 0}
        </Button>
      </div>

      {/* Desktop Apply Action */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/30 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <CheckCircle2 />
          Apply for Task
        </Button>
      </div>

      <PaymentModal
        taskId={safeTask.id}
        amount={safeTask.budget || 0}
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
      />
    </div>
  );
}
