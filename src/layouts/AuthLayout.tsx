import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-xl shadow-primary/5 rounded-2xl border border-border p-6 md:p-8 overflow-hidden relative">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                <span className="text-accent">Q</span>uestly
              </h1>
              <div className="w-12 h-1 bg-accent rounded-full mx-auto mt-2"></div>
              <p className="text-sm text-muted-foreground mt-3">Your hyperlocal task marketplace</p>
            </div>
            
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}