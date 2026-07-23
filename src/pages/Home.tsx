import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  MapPin, 
  Wrench, 
  Brush, 
  Truck, 
  BookOpen, 
  Leaf,
  ChevronRight,
  Plus,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/shared/TaskCard";
import CategoryCard from "@/components/shared/CategoryCard";
import { useAuthStore } from "@/stores/authStore";
import { useTaskStore } from "@/stores/taskStore";

export default function Home() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const navigate = useNavigate();

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const categories = [
    { name: "Cleaning", icon: Brush, count: 124 },
    { name: "Repairs", icon: Wrench, count: 85 },
    { name: "Delivery", icon: Truck, count: 210 },
    { name: "Tutoring", icon: BookOpen, count: 42 },
    { name: "Gardening", icon: Leaf, count: 67 },
  ];

  // Use tasks from store (fetched from backend)
  const displayTasks = tasks.slice(0, 4);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Greeting & Quick Actions */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-primary/10 to-accent/10 p-6 md:p-8 rounded-3xl border border-primary/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Welcome back</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Hello, {user?.name || "Sukesh"}!</h2>
          <p className="text-muted-foreground">Ready to get things done today?</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button size="lg" className="flex-1 md:flex-none rounded-full px-8 shadow-lg shadow-primary/25" onClick={() => navigate("/tasks/create")}>
            <Plus className="mr-2 h-5 w-5" />
            Post a Task
          </Button>
          <Button size="lg" variant="secondary" className="flex-1 md:flex-none rounded-full px-8" onClick={() => navigate("/tasks")}>
            <MapPin className="mr-2 h-5 w-5" />
            Find Tasks
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Explore Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">Find what you need help with</p>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/80 hidden md:flex">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={i} name={cat.name} icon={cat.icon} count={cat.count} />
          ))}
        </div>
      </section>

      {/* Recommended Tasks */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tasks Near You</h2>
            <p className="text-sm text-muted-foreground mt-1">Recently posted in your area</p>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View Map <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                category={task.category}
                budget={`₹${task.budget}`}
                distance={task.distance}
                time={task.time}
                rating={task.rating}
                imageUrl={task.imageUrl}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-secondary rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-xl">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mb-4 border-primary/20">Tasker Mode</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">Want to earn extra money?</h2>
          <p className="text-muted-foreground text-lg mb-6">Join thousands of taskers earning money by helping people in their local community.</p>
          <Button size="lg" className="rounded-full">Become a Tasker</Button>
        </div>
        <div className="relative z-10 hidden md:block">
          {/* Placeholder for illustration */}
          <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
            <Briefcase className="h-20 w-20 text-primary opacity-80" />
          </div>
        </div>
      </section>
    </div>
  );
}


