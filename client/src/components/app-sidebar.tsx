import { useLocation, Link } from "wouter";
import { LayoutDashboard, ListChecks, Calendar, LogOut, Sparkles, ExternalLink } from "lucide-react";
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
import { TOOLS, PAYRA_DEMO_URL } from "@/lib/constants";
import { useResults } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AppSidebar() {
  const [location] = useLocation();
  const { isCompleted, completedCount } = useResults();
  const { user, signOut } = useAuth();
  const progress = (completedCount / TOOLS.length) * 100;

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || null;
  const displayEmail = user?.email || null;

  return (
    <Sidebar data-testid="sidebar-nav">
      <SidebarHeader className="p-4 pb-3">
        <Link href="/">
          <PayraLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/results"}>
                  <Link href="/results">
                    <ListChecks className="h-4 w-4" />
                    <span>My Results</span>
                    {completedCount > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-5 font-medium">
                        {completedCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Diagnostic Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((tool) => {
                const done = isCompleted(tool.id);
                return (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      asChild
                      data-active={location === tool.path}
                    >
                      <Link href={tool.path}>
                        <tool.icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{tool.shortName}</span>
                        {done && (
                          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/15 shrink-0">
                            <Check className="h-2.5 w-2.5 text-primary" />
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Progress summary */}
        {completedCount > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">Progress</span>
                  <span className="text-[11px] font-semibold text-foreground">{completedCount}/{TOOLS.length}</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {/* User info */}
        {isSupabaseConfigured && user && (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-1 ring-primary/10">
              <span className="text-xs font-semibold text-primary">
                {(displayName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              {displayName && (
                <p className="text-xs font-medium truncate leading-tight">{displayName}</p>
              )}
              {displayEmail && (
                <p className="text-[10px] text-muted-foreground truncate leading-tight">{displayEmail}</p>
              )}
            </div>
            <button
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 rounded-md hover:bg-accent"
              title="Sign out"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* CTA — refined, less aggressive */}
        <a
          href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=sidebar&utm_campaign=persistent-cta`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-sidebar-cta"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">Get a Demo</span>
          <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
