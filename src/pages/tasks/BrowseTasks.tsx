import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Map as MapIcon, List, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/shared/TaskCard";
import { useTaskStore } from "@/stores/taskStore";
import type { TaskFilters } from "@/stores/taskStore";

export default function BrowseTasks() {
  const navigate = useNavigate();
  const { fetchTasks, filterTasks } = useTaskStore();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    category: "All",
    minBudget: undefined,
    maxBudget: undefined,
    maxDistance: 10,
    minRating: undefined,
    sortBy: undefined,
  });

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["All"]));

  // Fetch tasks from backend on mount
  useEffect(() => {
    fetchTasks(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredTasks = useMemo(() => {
    return filterTasks(filters);
  }, [filters, filterTasks]);

  const handleCategoryToggle = (cat: string) => {
    const newSet = new Set(selectedCategories);
    if (cat === "All") {
      setSelectedCategories(new Set(["All"]));
      setFilters((prev) => ({ ...prev, category: "All" }));
      return;
    }
    newSet.delete("All");
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    if (newSet.size === 0) {
      newSet.add("All");
      setFilters((prev) => ({ ...prev, category: "All" }));
    } else {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
    setSelectedCategories(newSet);
  };

  const handleSort = (sortBy: TaskFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-64px)]">
      {/* Left sidebar filters (Desktop) */}
      <div className={`${showFilters ? "block" : "hidden"} lg:block w-72 border-r border-border bg-card p-6 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Filters</h2>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(false)}>
            Close
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Distance</h3>
            <input 
              type="range" 
              className="w-full accent-primary" 
              min="1" 
              max="50" 
              value={filters.maxDistance || 10}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 mile</span>
              <span>{filters.maxDistance || 10} miles</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Budget</h3>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min" 
                className="h-9 text-sm"
                value={filters.minBudget || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, minBudget: e.target.value ? parseInt(e.target.value) : undefined }))}
              />
              <span>-</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="h-9 text-sm"
                value={filters.maxBudget || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxBudget: e.target.value ? parseInt(e.target.value) : undefined }))}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {["All", "Cleaning", "Delivery", "Moving", "Plumbing", "Tutoring", "Repairs", "Furniture Assembly"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    checked={selectedCategories.has(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Rating</h3>
            <div className="flex flex-col gap-2">
              {[4, 3, 2].map((stars) => (
                <label key={stars} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    className="text-primary focus:ring-primary h-4 w-4"
                    checked={filters.minRating === stars}
                    onChange={() => setFilters((prev) => ({ ...prev, minRating: prev.minRating === stars ? undefined : stars }))}
                  />
                  <span className="text-sm">{stars}+ Stars</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setFilters({
                search: "",
                category: "All",
                minBudget: undefined,
                maxBudget: undefined,
                maxDistance: 10,
                minRating: undefined,
                sortBy: undefined,
              });
              setSelectedCategories(new Set(["All"]));
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search tasks, keywords..." 
                className="pl-9 w-full bg-background"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md transition-colors ${viewMode === "map" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MapIcon size={18} />
              </button>
            </div>
            
            <Button 
              variant="outline" 
              className="lg:hidden flex items-center gap-2"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge 
              variant="secondary" 
              className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap cursor-pointer"
              onClick={() => handleSort("distance")}
            >
              Near Me
            </Badge>
            <Badge 
              variant="outline" 
              className="px-3 py-1 whitespace-nowrap flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date <ChevronDown size={12} />
            </Badge>
            <Badge 
              variant="outline" 
              className="px-3 py-1 whitespace-nowrap flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("budget_high")}
            >
              Highest Price <ChevronDown size={12} />
            </Badge>
            <Badge 
              variant="outline" 
              className="px-3 py-1 whitespace-nowrap flex items-center gap-1 cursor-pointer"
              onClick={() => handleSort("budget_low")}
            >
              Lowest Price <ChevronDown size={12} />
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {viewMode === "list" ? (
            filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-bold text-lg text-foreground">No tasks found</h3>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="cursor-pointer">
                    <TaskCard
                      title={task.title}
                      category={task.category}
                      budget={`₹${task.budget}`}
                      distance={task.distance}
                      time={task.time}
                      rating={task.rating}
                      imageUrl={task.imageUrl}
                      posterName={task.posterName}
                      posterId={task.posterId}
                      poster={task.posterAvatar}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl bg-muted border border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-50" style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
              }}></div>
              
              {/* Fake Map Markers */}
              {filteredTasks.slice(0, 3).map((task, i) => (
                <div 
                  key={task.id}
                  className="absolute animate-bounce cursor-pointer"
                  style={{ 
                    top: `${25 + i * 20}%`, 
                    left: `${25 + i * 20}%`,
                    animationDelay: `${i * 200}ms`
                  }}
                >
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-full text-xs font-bold">
                    ₹{task.budget}
                  </div>
                  <div className="w-3 h-3 bg-primary rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                </div>
              ))}
              
              <div className="bg-card/80 backdrop-blur-md p-4 rounded-xl shadow-lg relative z-10 text-center max-w-sm">
                <MapIcon className="w-12 h-12 text-primary mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-lg">Interactive Map View</h3>
                <p className="text-sm text-muted-foreground mt-1">Google Maps API integration would go here. Showing dummy markers for visualization.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}