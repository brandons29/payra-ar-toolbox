import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayraLogoFull } from "@/components/PayraLogo";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  TrendingDown,
  Zap,
  Clock3,
  Calendar,
  CheckCircle2,
  Shield,
  BarChart3,
  DollarSign,
  Users,
  Building2,
  ChevronRight,
} from "lucide-react";
import { BlueprintGrid } from "@/components/ConstructionPatterns";

const stats = [
  { value: "38%", label: "Average DSO reduction with Payra", icon: TrendingDown },
  { value: "99%", label: "Auto-reconciliation accuracy", icon: Zap },
  { value: "16+", label: "Hours reclaimed per month", icon: Clock3 },
];

const outcomes = [
  {
    icon: DollarSign,
    title: "Quantify trapped cash — down to the dollar",
    description: "See exactly how much working capital is stuck in overdue invoices and the monthly carrying cost to your business.",
  },
  {
    icon: BarChart3,
    title: "Benchmark DSO, CEI & aging vs. your industry",
    description: "Compare your collections performance against real medians for construction, distribution, and industrial companies.",
  },
  {
    icon: Clock3,
    title: "Pinpoint where your invoice-to-cash cycle stalls",
    description: "Map every step from invoice creation to payment posting and surface the exact stages costing you days.",
  },
  {
    icon: Shield,
    title: "Size your bad debt exposure before it hits the P&L",
    description: "Break down risk concentration in your aging buckets so you can act on overdue accounts before they become write-offs.",
  },
];

const trustLogos = [
  "Construction",
  "Distribution",
  "Industrial & Manufacturing",
  "Wholesale",
];

export default function Landing() {
  const { user } = useAuth();
  const entryPath = !isSupabaseConfigured ? "/dashboard" : user ? "/dashboard" : "/login";
  const signupPath = !isSupabaseConfigured ? "/dashboard" : "/login?mode=signup";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <PayraLogoFull />
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <button
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-foreground transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => document.getElementById("outcomes")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-foreground transition-colors"
            >
              Outcomes
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
              <a
                href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=landing&utm_campaign=header`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-demo-header"
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Talk to AR Experts
              </a>
            </Button>
            {isSupabaseConfigured && !user && (
              <Button asChild size="sm" variant="ghost">
                <Link href="/login" data-testid="link-sign-in">Sign In</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={entryPath} data-testid="link-get-started">
                {isSupabaseConfigured && !user ? "Run Your Free AR Audit" : "Go to Dashboard"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BlueprintGrid />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
              <Zap className="h-3 w-3 mr-1.5" /> 100% free — no credit card, no commitment
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight" data-testid="text-hero-heading">
              Stop leaving cash trapped in receivables.{" "}
              <span className="text-gradient-payra">Find the leaks in 10 minutes.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              7 free diagnostic tools purpose-built for construction, distribution, and industrial AR leaders.
              Benchmark your DSO, quantify trapped cash, expose collections bottlenecks, and get a prioritized action plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
                <Link href={signupPath} data-testid="link-hero-cta">
                  Audit My AR — Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
                <a
                  href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=landing&utm_campaign=hero`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-hero-demo"
                >
                  <Calendar className="h-4 w-4" />
                  Review My AR with an Expert
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Results in 10 min</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Industry benchmarks included</span>
            </p>
          </div>
        </div>
      </section>

      {/* Social proof / ICP bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Purpose-built for</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {trustLogos.map((label) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary/60" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2.5 mb-1">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-bold text-foreground">{s.value}</span>
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Tool Overview */}
      <section id="tools" className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <Badge variant="outline" className="text-xs font-medium">7 Free Diagnostic Tools</Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              A complete AR audit — from DSO to ERP readiness
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Each tool targets a specific collections metric. Run all 7 in under 10 minutes to get a full
              picture of where your cash is stuck and what to fix first.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOOLS.map((tool, i) => (
              <Card
                key={tool.id}
                className="p-5 flex flex-col gap-3 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                data-testid={`card-tool-${tool.id}`}
                onClick={() => {
                  window.location.hash = entryPath;
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{tool.time}</Badge>
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                </div>
                <div className="flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all mt-auto">
                  Run This Diagnostic
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">From signup to action plan in 10 minutes</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Three steps to a data-backed AR improvement roadmap.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your free account", desc: "Sign up in seconds with Google, Microsoft, or email. No credit card — no strings attached." },
              { step: "02", title: "Run your diagnostics", desc: "Answer targeted questions about your AR process. Each of the 7 tools takes 2–5 minutes and produces real dollar figures." },
              { step: "03", title: "Get your prioritized action plan", desc: "See scores, industry benchmarks, and exactly where to focus. Then review findings with a Payra AR specialist if you want help acting on them." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/8 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section id="outcomes" className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Walk away knowing exactly where your cash is stuck
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Every tool produces concrete numbers — not vague scores — so you can prioritize with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {outcomes.map((o) => (
              <Card key={o.title} className="p-6 flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <o.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">{o.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">From an AR leader who ran the audit</span>
          </div>
          <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic">
            "We found $340K in trapped cash we didn't know about — in under 10 minutes.
            The DSO benchmarks gave us the ammo to overhaul our collections process."
          </blockquote>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">AR Director</span> · Mid-Market Distribution Company
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
        <BlueprintGrid />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Your AR is either building cash flow or bleeding it. Find out which.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Run all 7 diagnostics free — no commitment, no credit card, no sales call.
            Just hard numbers about your DSO, trapped cash, and collections gaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
              <Link href={signupPath} data-testid="link-bottom-cta">
                Audit My AR — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
              <a
                href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=landing&utm_campaign=bottom-cta`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="h-4 w-4" />
                Review Findings with an Expert
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              &copy; {new Date().getFullYear()}{" "}
              <a href={PAYRA_CTA_URL} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                Payra
              </a>
            </span>
            <a href="https://payra.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
          <span className="text-xs text-muted-foreground/60">
            Payra AR Toolbox
          </span>
        </div>
      </footer>
    </div>
  );
}
