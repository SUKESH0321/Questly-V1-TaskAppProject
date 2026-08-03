import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Star,
  User,
  Clock,
  Settings,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";

interface Notification {
  id: string;
  type: "application" | "message" | "payment" | "review" | "status" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("We couldn’t load your notifications right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifs =
    filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
      setError("We couldn’t update your notifications.");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      setError("We couldn’t update this notification.");
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return <User className="text-primary" />;
      case "message":
        return <MessageSquare className="text-blue-500" />;
      case "payment":
        return <DollarSign className="text-accent" />;
      case "review":
        return <Star className="text-amber-500" />;
      case "status":
        return <CheckCircle2 className="text-accent" />;
      case "system":
        return <Settings className="text-muted-foreground" />;
    }
  };

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return "bg-primary/10";
      case "message":
        return "bg-blue-500/10";
      case "payment":
        return "bg-accent/10";
      case "review":
        return "bg-amber-500/10";
      case "status":
        return "bg-accent/10";
      case "system":
        return "bg-muted";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading
              ? ""
              : unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded-full text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Notification List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifs.length === 0 ? (
        <div className="bg-muted/50 rounded-2xl p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            No notifications
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {filter === "unread"
              ? "You've read all your notifications!"
              : "You don't have any notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifs.map((notif) => (
            <button
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl transition-colors text-left ${
                notif.read
                  ? "bg-card hover:bg-muted/30"
                  : "bg-primary/5 hover:bg-primary/10 border border-primary/10"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${getIconBg(notif.type)} flex items-center justify-center flex-shrink-0`}
              >
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {notif.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notif.description}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {notif.time}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground flex-shrink-0 mt-3"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
