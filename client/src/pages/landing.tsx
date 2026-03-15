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
  { value: "38%", label: "Average DSO Reduction", icon: TrendingDown },
  { value: "99%", label: "Auto-Reconciliation Rate", icon: Zap },
  { value: "16+", label: "Hours Saved Per Month", icon: Clock3 },
];

const outcomes = [
  {
    icon: DollarSign,
    title: "Unlock trapped cash",
    description: "See exactly how much revenue is stuck in slow-paying invoices and what it's costing you monthly.",
  },
  {
    icon: BarChart3,
    title: "Benchmark against peers",
    description: "Compare your DSO, CEI, and aging distribution to industry medians for construction, distribution, and industrial.",
  },
  {
    icon: Clock3,
    title: "Find process bottlenecks",
    description: "Map your invoice-to-cash timeline step by step and pinpoint where days are being lost.",
  },
  {
    icon: Shield,
    title: "Assess bad debt exposure",
    description: "Quantify risk in your receivables portfolio before write-offs hit the P&L.",
  },
];

const trustLogos = [
  "Construction",
  "Distribution",
  "Industrial",
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
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Demo
              </a>
            </Button>
            {isSupabaseConfigured && !user && (
              <Button asChild size="sm" variant="ghost">
                <Link href="/login" data-testid="link-sign-in">Sign In</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={entryPath} data-testid="link-get-started">
                {isSupabaseConfigured && !user ? "Start Free Audit" : "Get Started"}
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
              <Zap className="h-3 w-3 mr-1.5" /> Free for your business — no credit card required
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight" data-testid="text-hero-heading">
              Your accounts receivable is leaking cash.{" "}
              <span className="text-gradient-payra">Find out where.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              7 free diagnostic tools built for construction, distribution, and industrial companies.
              Audit your AR process, benchmark against your industry, and get a clear action plan — in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
                <Link href={signupPath} data-testid="link-hero-cta">
                  Start Your Free Audit
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
                  Book a Demo
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-4 pt-1">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Takes 10 min</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Instant results</span>
            </p>
          </div>
        </div>
      </section>

      {/* Social proof / ICP bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Built for</p>
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
            <Badge variant="outline" className="text-xs font-medium">7 Diagnostic Tools</Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Everything you need to audit your AR
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Each tool is purpose-built for companies in construction, distribution, and industrial sectors.
              Complete all 7 in under 10 minutes for a full diagnostic report.
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
                  Start Free
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
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">How it works</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Three steps to a complete AR diagnostic.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign up free", desc: "Create your account in seconds with Google, Microsoft, or email. No credit card needed." },
              { step: "02", title: "Run diagnostics", desc: "Answer targeted questions about your AR process. Each tool takes 2–5 minutes and surfaces real numbers." },
              { step: "03", title: "Get your report", desc: "See your scores, benchmarks, and a prioritized action plan. Share with your team or book a demo to discuss." },
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
              What you'll discover
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Walk away with concrete numbers and a clear picture of your AR health.
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
            <span className="text-sm font-medium text-muted-foreground">Trusted by AR teams</span>
          </div>
          <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed italic">
            "We ran the full audit in 8 minutes and found $340K in trapped cash we didn't know about.
            The DSO benchmarks alone justified switching our process."
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
            Ready to see what your AR is really costing you?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Run all 7 diagnostics for free — no commitment, no credit card, no sales pitch. Just clear data about your AR process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
              <Link href={signupPath} data-testid="link-bottom-cta">
                Start Your Free Audit
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
                Schedule a Demo
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
