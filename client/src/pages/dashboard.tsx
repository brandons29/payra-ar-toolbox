import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TOOLS, PAYRA_DEMO_URL } from "@/lib/constants";
import { useResults } from "@/lib/store";
import { Check, ArrowRight, Calendar, TrendingDown, Clock, DollarSign, Sparkles, Target } from "lucide-react";
import { trackDemoClick } from "@/lib/analytics";

/** Animated SVG progress ring */
function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight">{Math.round(progress)}%</span>
        <span className="text-[10px] text-muted-foreground font-medium">Complete</span>
      </div>
    </div>
  );
}

/** Industry insight cards for engagement */
const INDUSTRY_INSIGHTS = [
  {
    icon: TrendingDown,
    stat: "38%",
    label: "Average DSO Reduction",
    description: "Companies using automated AR see DSO drop by 38% within 6 months",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Clock,
    stat: "16+ hrs",
    label: "Monthly Time Saved",
    description: "AR automation eliminates manual data entry, follow-ups, and reconciliation",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    icon: DollarSign,
    stat: "99%",
    label: "Auto-Reconciliation",
    description: "Automated payment matching eliminates manual cash application errors",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
];

export default function Dashboard() {
  const { completedCount, isCompleted, overallScore, get } = useResults();
  const progress = (completedCount / TOOLS.length) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8" data-testid="page-dashboard">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-welcome">AR Diagnostics</h1>
          <p className="text-sm text-muted-foreground">
            Benchmark your accounts receivable process and find hidden savings.
          </p>
        </div>
        {completedCount > 0 && (
          <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0 self-start">
            <Link href="/results">
              <Target className="h-3.5 w-3.5" />
              View All Results
            </Link>
          </Button>
        )}
      </div>

      {/* Progress + Score Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress Ring Card */}
        <Card className="premium-card p-6 flex items-center gap-6">
          <ProgressRing progress={progress} />
          <div className="space-y-2 flex-1 min-w-0">
            <h2 className="font-semibold text-sm">Your Progress</h2>
            <p className="text-xs text-muted-foreground">
              {completedCount === 0
                ? "Start your first diagnostic to begin your assessment."
                : completedCount === TOOLS.length
                  ? "All diagnostics complete. View your full results."
                  : `${completedCount} of ${TOOLS.length} tools complete. Keep going.`}
            </p>
            {completedCount > 0 && completedCount < TOOLS.length && (
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3" />
                Complete all 7 for a full AR assessment
              </div>
            )}
          </div>
        </Card>

        {/* AR Health Score */}
        <Card className="premium-card metric-glow p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AR Health Score</span>
              {overallScore !== null && (
                <Badge className="status-pill status-pill-info text-[10px]">
                  {overallScore >= 70 ? "Good" : overallScore >= 50 ? "Fair" : "Needs Work"}
                </Badge>
              )}
            </div>
            {overallScore !== null ? (
              <div className="animate-count-up">
                <span className="text-3xl font-bold text-primary tracking-tight">{Math.round(overallScore)}</span>
                <span className="text-lg text-muted-foreground font-light">/100</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground/30">--</div>
            )}
            <p className="text-xs text-muted-foreground">
              {overallScore !== null
                ? `${overallScore >= 52 ? "Above" : "Below"} the industry average of 52`
                : "Complete the Health Scorecard to get your score"}
            </p>
          </div>
        </Card>

        {/* Quick CTA */}
        <Card className="p-6 border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex flex-col h-full justify-between gap-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Ready to improve?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                See how Payra's ERP-native AR automation can reduce your DSO by 38% and save 16+ hours per month.
              </p>
            </div>
            <Button asChild size="sm" className="gap-1.5 w-full">
              <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=top-cta`} target="_blank" rel="noopener noreferrer" onClick={() => trackDemoClick("dashboard_top_cta")}>
                <Calendar className="h-3.5 w-3.5" />
                Schedule a Demo
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </Card>
      </div>

      {/* Tool Cards */}
      <div>
        <h2 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Diagnostic Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {TOOLS.map((tool) => {
            const done = isCompleted(tool.id);
            const result = get(tool.id);
            return (
              <Card
                key={tool.id}
                className="premium-card p-5 flex flex-col gap-3 group"
                data-testid={`card-dash-${tool.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  {done ? (
                    <span className="status-pill status-pill-success">
                      <Check className="h-3 w-3" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/60 font-medium">{tool.time}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  {done && result?.data?.headline && (
                    <p className="text-xs text-primary font-medium mt-1.5">{String(result.data.headline)}</p>
                  )}
                </div>
                <Button asChild variant={done ? "secondary" : "default"} size="sm" className="w-full gap-1">
                  <Link href={tool.path}>
                    {done ? "View Results" : "Start Assessment"} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Industry Insights */}
      <div>
        <h2 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Industry Benchmarks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INDUSTRY_INSIGHTS.map((insight, i) => (
            <Card key={i} className="premium-card p-5 space-y-3">
              <div className={`h-9 w-9 rounded-lg ${insight.bg} flex items-center justify-center`}>
                <insight.icon className={`h-4.5 w-4.5 ${insight.color}`} />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold tracking-tight ${insight.color}`}>{insight.stat}</span>
                  <span className="text-xs text-muted-foreground">{insight.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      {completedCount === TOOLS.length && (
        <Card className="p-6 text-center space-y-3 border-primary/15 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent animate-fade-in-up">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">All 7 Diagnostics Complete</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            You've completed a full AR audit. Schedule a demo to turn these insights into measurable improvements.
          </p>
          <Button asChild className="gap-1.5">
            <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=all-complete`} target="_blank" rel="noopener noreferrer" onClick={() => trackDemoClick("dashboard_all_complete")}>
              <Calendar className="h-3.5 w-3.5" /> Schedule a Demo <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </Card>
      )}
    </div>
  );
}
