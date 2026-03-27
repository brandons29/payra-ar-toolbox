import { useLocation, Link } from "wouter";
import { LayoutDashboard, ListChecks, Calendar, LogOut, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { PayraLogo } from "./PayraLogo";
import { TOOLS, PAYRA_DEMO_URL, PAYRA_PRIVACY_URL } from "@/lib/constants";
import { useResults } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight } from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();
  const { isCompleted, completedCount } = useResults();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || null;
  const displayEmail = user?.email || null;
  const progress = (completedCount / TOOLS.length) * 100;

  return (
    <Sidebar data-testid="sidebar-nav">
      <SidebarHeader className="px-4 py-4">
        <Link href="/">
          <PayraLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/dashboard" || location === "/"}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Mini progress tracker */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium">Progress</span>
            <span>{completedCount}/{TOOLS.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">Diagnostic Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((tool) => {
                const done = isCompleted(tool.id);
                const isActive = location === tool.path;
                return (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                    >
                      <Link href={tool.path}>
                        <tool.icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{tool.shortName}</span>
                        {done ? (
                          <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </span>
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/results"}>
                  <Link href="/results">
                    <ListChecks className="h-4 w-4" />
                    <span>My Results</span>
                    {completedCount > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">
                        {completedCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 pt-2 space-y-3">
        {/* User info */}
        {isSupabaseConfigured && user && (
          <div className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
              <span className="text-xs font-semibold text-primary">
                {(displayName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              {displayName && (
                <p className="text-xs font-medium truncate">{displayName}</p>
              )}
              {displayEmail && (
                <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
              )}
            </div>
            <button
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 rounded-md hover:bg-muted"
              title="Sign out"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <Button asChild size="sm" className="w-full gap-1.5 h-9 text-xs font-medium">
          <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=sidebar&utm_campaign=persistent-cta`} target="_blank" rel="noopener noreferrer" data-testid="link-sidebar-cta">
            <Calendar className="h-3.5 w-3.5" />
            Schedule a Demo
            <ArrowRight className="h-3 w-3" />
          </a>
        </Button>

        <div className="flex justify-center">
          <a
            href={PAYRA_PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
