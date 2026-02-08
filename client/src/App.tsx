import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Reglamento from "@/pages/Reglamento";
import Producto from "@/pages/Producto";
import Ensayo from "@/pages/Ensayo";
import QuotationSuccess from "@/pages/QuotationSuccess";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/quote/reglamento">
        {() => <ProtectedRoute component={Reglamento} />}
      </Route>
      <Route path="/quote/producto">
        {() => <ProtectedRoute component={Producto} />}
      </Route>
      <Route path="/quote/ensayo">
        {() => <ProtectedRoute component={Ensayo} />}
      </Route>
      <Route path="/success">
        {() => <ProtectedRoute component={QuotationSuccess} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
