import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayraLogoFull } from "@/components/PayraLogo";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ArrowRight, TrendingDown, Zap, Clock3, Calendar } from "lucide-react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import {
  BlueprintGrid,
  ConcreteSpeckle,
  SteelCrosshatch,
} from "@/components/ConstructionPatterns";

const stats = [
  { value: "38%", label: "Average DSO Reduction", icon: TrendingDown },
  { value: "99%", label: "Auto-Reconciliation Rate", icon: Zap },
  { value: "16+", label: "Hours Saved Per Month", icon: Clock3 },
];

export default function Landing() {
  const { user } = useAuth();
  // If Supabase is active and user is logged in, go straight to dashboard.
  // If Supabase is active but no user, go to login.
  // If Supabase is not configured, go to dashboard (dev mode).
  const entryPath = !isSupabaseConfigured ? "/dashboard" : user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <PayraLogoFull />
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=landing&utm_campaign=header`} target="_blank" rel="noopener noreferrer" data-testid="link-demo-header">
                <Calendar className="mr-1 h-3.5 w-3.5" /> Book a Demo
              </a>
            </Button>
            {isSupabaseConfigured && !user && (
              <Button asChild size="sm" variant="ghost">
                <Link href="/login" data-testid="link-sign-in">Sign In</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={entryPath} data-testid="link-get-started">
                {isSupabaseConfigured && !user ? "Sign Up Free" : "Get Started"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — blueprint grid background */}
      <section className="py-16 px-4 relative overflow-hidden text-foreground">
        <BlueprintGrid />
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <Badge variant="secondary" className="mb-2">Free for your business</Badge>
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-hero-heading">
            Free AR Diagnostic Tools for Your Business
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Audit your accounts receivable process, benchmark against your industry,
            and find where you're leaving cash on the table — all in under 10 minutes.
          </p>
          <div className="pt-2">
            <Button asChild size="lg">
              <Link href={entryPath}>
                Start Your Audit <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tool Cards Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOOLS.map((tool) => (
              <Card key={tool.id} className="p-5 flex flex-col gap-3 group" data-testid={`card-tool-${tool.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <tool.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{tool.time}</Badge>
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                </div>
                <Button asChild variant="secondary" size="sm" className="w-full mt-auto">
                  <Link href={entryPath}>Start Free</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — concrete speckle texture */}
      <section className="py-12 px-4 bg-primary/5 dark:bg-primary/10 relative overflow-hidden">
        <ConcreteSpeckle />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <s.icon className="h-5 w-5 text-primary" />
                  <span className="text-xl font-bold text-primary">{s.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — steel crosshatch */}
      <section className="py-16 px-4 text-center space-y-4 relative overflow-hidden">
        <SteelCrosshatch />
        <div className="relative z-10 space-y-4">
          <h2 className="text-lg font-bold">Ready to optimize your AR?</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Run all 7 diagnostics in under 10 minutes, then see exactly how Payra can help.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg">
              <Link href={entryPath}>
                Start Your Free Audit <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=landing&utm_campaign=bottom-cta`} target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-1 h-4 w-4" /> Schedule a Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Powered by <a href={PAYRA_CTA_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-medium">PAYRA</a></span>
            <a href="https://payra.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </div>
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
