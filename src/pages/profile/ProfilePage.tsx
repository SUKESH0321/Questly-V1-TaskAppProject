import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useTaskStore } from "@/stores/taskStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Settings,
  LogOut,
  Edit3,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editLocation, setEditLocation] = useState(user?.location || "");

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const userTasks = tasks.filter((t) => t.posterId === user?.id);
  const completedTasks = userTasks.filter((t) => t.status === "completed");
  const activeTasks = userTasks.filter((t) => t.status === "open");

  const handleSaveProfile = () => {
    updateUser({ name: editName, phone: editPhone, location: editLocation });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center border-2 border-card">
              <CheckCircle2 size={14} className="text-accent-foreground" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3 max-w-md">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full Name" />
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" />
                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="Location" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user?.name || "User"}</h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail size={14} /> {user?.email}
                </p>
                {user?.phone && (
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Phone size={14} /> {user.phone}
                  </p>
                )}
                {user?.location && (
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <MapPin size={14} /> {user.location}
                  </p>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {user?.role === "customer" ? "Customer" : user?.role === "tasker" ? "Tasker" : user?.role === "both" ? "Both" : "New User"}
                  </Badge>
                  <div className="flex items-center text-amber-500 text-sm">
                    <Star size={14} className="fill-current" />
                    <span className="ml-1 font-medium text-foreground">5.0</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={14} className="mr-1" /> Edit
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleLogout}>
              <LogOut size={14} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-2xl font-bold">{completedTasks.length}</span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
              <Clock size={20} />
            </div>
            <span className="text-2xl font-bold">{activeTasks.length}</span>
            <span className="text-xs text-muted-foreground">Active</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
              <DollarSign size={20} />
            </div>
            <span className="text-2xl font-bold">₹0</span>
            <span className="text-xs text-muted-foreground">Earned</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground mb-2">
              <Star size={20} />
            </div>
            <span className="text-2xl font-bold">5.0</span>
            <span className="text-xs text-muted-foreground">Rating</span>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Tasks</h2>
        {userTasks.length === 0 ? (
          <div className="bg-muted/50 rounded-2xl p-8 text-center border border-border">
            <User size={40} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="font-medium text-foreground">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Post your first task to get started!</p>
            <Button className="mt-4" onClick={() => navigate("/tasks/create")}>Post a Task</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {userTasks.map((task) => (
              <div
                key={task.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.category} • ₹{task.budget}</p>
                </div>
                <Badge
                  className={
                    task.status === "open"
                      ? "bg-amber-500/10 text-amber-500"
                      : task.status === "in_progress"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-accent/10 text-accent"
                  }
                >
                  {task.status === "open" ? "Open" : task.status === "in_progress" ? "In Progress" : "Completed"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Settings Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left">
            <Settings size={20} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Account Settings</p>
              <p className="text-xs text-muted-foreground">Manage your account details</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left">
            <ShieldCheck size={20} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Privacy & Security</p>
              <p className="text-xs text-muted-foreground">Manage your privacy settings</p>
            </div>
          </button>
          <button
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-xs text-muted-foreground">Log out of your account</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}