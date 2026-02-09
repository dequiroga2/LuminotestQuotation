import { Link, useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { signOut } from "@/lib/firebase";
import { usePersistentCart } from "@/hooks/use-persistent-cart";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated } = useFirebaseAuth();
  const [location] = useLocation();
  const cart = usePersistentCart();
  const cartCount = cart.getTotalEssays();

  if (!isAuthenticated) return null;

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

          {/* Cart Icon with Badge */}
          {cartCount > 0 && (
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          )}

          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block text-muted-foreground">
              {user?.displayName || user?.email || "Usuario"}
            </span>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
