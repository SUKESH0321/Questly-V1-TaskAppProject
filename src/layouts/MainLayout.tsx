import { Outlet, Link, useLocation } from "react-router-dom";
import { Search, Bell, User, Home, MapPin, MessageSquare, Plus } from "lucide-react";

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/tasks", label: "Tasks", icon: MapPin },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/profile", label: "Profile", icon: User },
];

export default function MainLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6">
          <Link to="/home">
            <h1 className="text-2xl font-bold text-primary">
              <span className="text-accent">Q</span>uestly
            </h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "text-accent bg-accent/10 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative pb-20 md:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between md:px-8">
          <div className="md:hidden">
            <Link to="/home">
              <h1 className="text-xl font-bold text-primary">
                <span className="text-accent">Q</span>uestly
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search for tasks..." 
              className="w-full pl-9 pr-4 py-2 bg-muted rounded-full border-none focus:ring-2 focus:ring-accent/30 outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/notifications"
              className="relative p-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </Link>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium hover:bg-accent/30 transition-colors">
                U
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Floating Action Button (Mobile) */}
        <Link
          to="/tasks/create"
          className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg shadow-accent/30 flex items-center justify-center z-50 hover:bg-accent/90 transition-colors"
        >
          <Plus size={24} />
        </Link>

        {/* Bottom Navigation (Mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around py-3 px-2 pb-safe z-40">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive(item.path) ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}