import { useLocation, Link } from "wouter";
import { LayoutDashboard, ListChecks, Calendar, LogOut } from "lucide-react";
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

export function AppSidebar() {
  const [location] = useLocation();
  const { isCompleted } = useResults();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || null;
  const displayEmail = user?.email || null;

  return (
    <Sidebar data-testid="sidebar-nav">
      <SidebarHeader className="p-4">
        <Link href="/">
          <PayraLogo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
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

        <SidebarGroup>
          <SidebarGroupLabel>Diagnostic Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((tool) => (
                <SidebarMenuItem key={tool.id}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === tool.path}
                  >
                    <Link href={tool.path}>
                      <tool.icon className="h-4 w-4" />
                      <span className="flex-1 truncate">{tool.shortName}</span>
                      {isCompleted(tool.id) && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {/* User info */}
        {isSupabaseConfigured && user && (
          <div className="flex items-center gap-2 px-1">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Sign out"
              data-testid="button-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <Button asChild size="sm" className="w-full gap-1.5">
          <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=sidebar&utm_campaign=persistent-cta`} target="_blank" rel="noopener noreferrer" data-testid="link-sidebar-cta">
            <Calendar className="h-4 w-4" />
            Schedule a Demo
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
