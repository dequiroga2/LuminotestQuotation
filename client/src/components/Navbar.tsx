import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, FileText } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            LUMINOTEST <span className="text-primary font-light">SAS</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant={location === "/dashboard" ? "secondary" : "ghost"} size="sm" className="hidden sm:flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block text-muted-foreground">
              {user.firstName ? `Hola, ${user.firstName}` : user.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
