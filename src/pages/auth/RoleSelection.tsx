import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { User, Briefcase, Settings } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { setRole } = useAuthStore();

  const handleSelect = (role: "customer" | "tasker" | "both") => {
    setRole(role);
    if (role === "customer") {
      navigate("/home");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">How do you want to use Questly?</h2>
        <p className="text-muted-foreground text-sm mt-2">You can always change this later in settings.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => handleSelect("customer")}
          className="w-full p-4 rounded-xl border-2 border-transparent bg-muted hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">I need things done</h3>
            <p className="text-xs text-muted-foreground">Post tasks and hire local people.</p>
          </div>
        </button>

        <button 
          onClick={() => handleSelect("tasker")}
          className="w-full p-4 rounded-xl border-2 border-transparent bg-muted hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">I want to earn money</h3>
            <p className="text-xs text-muted-foreground">Find local tasks and get paid.</p>
          </div>
        </button>

        <button 
          onClick={() => handleSelect("both")}
          className="w-full p-4 rounded-xl border-2 border-transparent bg-muted hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Settings size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Both</h3>
            <p className="text-xs text-muted-foreground">I want to post tasks and complete them.</p>
          </div>
        </button>
      </div>
    </div>
  );
}