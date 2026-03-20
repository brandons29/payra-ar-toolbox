import { useState, useEffect } from "react";
import { Switch, Route, Router, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Results from "@/pages/results";
import HealthScorecard from "@/pages/tools/health-scorecard";
import DSOCalculator from "@/pages/tools/dso-calculator";
import AgingAnalyzer from "@/pages/tools/aging-analyzer";
import CEICalculator from "@/pages/tools/cei-calculator";
import TimelineMapper from "@/pages/tools/timeline-mapper";
import CostCalculator from "@/pages/tools/cost-calculator";
import ERPReadiness from "@/pages/tools/erp-readiness";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";

/** Routes that require auth when Supabase is configured */
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();

  // If Supabase not configured, skip auth check (dev mode)
  if (!isSupabaseConfigured) return <Component />;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

  return <Component />;
}

/** Root route: always gate through login — no public landing page */
function RootRedirect() {
  const { user, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show spinner while checking auth (max 3 seconds)
  if (loading && !timedOut) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Authenticated → dashboard, otherwise → login. No landing page.
  return <Redirect to={user ? "/dashboard" : "/login"} />;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/results">{() => <ProtectedRoute component={Results} />}</Route>
      <Route path="/tools/health-scorecard">{() => <ProtectedRoute component={HealthScorecard} />}</Route>
      <Route path="/tools/dso-calculator">{() => <ProtectedRoute component={DSOCalculator} />}</Route>
      <Route path="/tools/aging-analyzer">{() => <ProtectedRoute component={AgingAnalyzer} />}</Route>
      <Route path="/tools/cei-calculator">{() => <ProtectedRoute component={CEICalculator} />}</Route>
      <Route path="/tools/timeline-mapper">{() => <ProtectedRoute component={TimelineMapper} />}</Route>
      <Route path="/tools/cost-calculator">{() => <ProtectedRoute component={CostCalculator} />}</Route>
      <Route path="/tools/erp-readiness">{() => <ProtectedRoute component={ERPReadiness} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  usePageTracking();
  const isLogin = location === "/login";
  const isRoot = location === "/";

  // Login and root redirect get their own full-screen layouts
  if (isLogin || isRoot) {
    return (
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-2 p-2 border-b shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-y-auto">
            <AppRoutes />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router hook={useHashLocation}>
            <AppLayout />
          </Router>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
