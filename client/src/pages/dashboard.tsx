import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL, formatPercent } from "@/lib/constants";
import { useResults } from "@/lib/store";
import { Check, ArrowRight, CircleCheck, Calendar, Sparkles, TrendingUp, ExternalLink, BarChart3, Clock } from "lucide-react";

export default function Dashboard() {
  const { completedCount, isCompleted, overallScore, get } = useResults();
  const progress = (completedCount / TOOLS.length) * 100;

  // Find the next uncompleted tool
  const nextTool = TOOLS.find((t) => !isCompleted(t.id));

  return (
    <div className="page-container space-y-8" data-testid="page-dashboard">
      {/* Hero section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight" data-testid="text-welcome">AR Diagnostics</h1>
            {overallScore !== null && (
              <Badge variant="outline" className="font-semibold text-primary border-primary/20 bg-primary/5">
                Score: {Math.round(overallScore)}/100
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Each tool takes 2–5 minutes and produces real dollar figures — trapped cash, excess cost, bad debt exposure — so you know exactly where to focus.
          </p>
        </div>
        {nextTool && completedCount < TOOLS.length && (
          <Button asChild size="sm" className="gap-1.5 shrink-0 self-start">
            <Link href={nextTool.path} data-testid="button-continue-audit">
              {completedCount === 0 ? "Start First Diagnostic" : "Continue to Next Tool"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* Progress section — only show if started */}
      {completedCount > 0 && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold">Your Progress</h2>
              <p className="text-xs text-muted-foreground">
                {completedCount === TOOLS.length
                  ? "All 7 diagnostics complete — your full AR picture is ready."
                  : `${TOOLS.length - completedCount} tools remaining — keep going for the full picture`
                }
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-foreground">{completedCount}</span>
              <span className="text-sm text-muted-foreground">/{TOOLS.length}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />

          {completedCount === TOOLS.length && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <CircleCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm flex-1">
                All 7 diagnostics complete. Ready to act on what you found?{" "}
                <a
                  href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=all-complete`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  Review your results with a Payra AR specialist
                </a>{" "}
                and get a custom improvement plan.
              </p>
            </div>
          )}
          {completedCount > 0 && completedCount < TOOLS.length && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">
                Already spotting trapped cash or collections gaps?{" "}
                <a
                  href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=mid-progress`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  Walk through your findings with an expert
                </a>{" "}
                — no obligation.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Empty state for first-time users */}
      {completedCount === 0 && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/8 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-semibold text-base">Find out where your cash is stuck</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Start with the AR Health Scorecard for a broad overview, then dive into DSO, aging, and collections specifics.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~10 min for all 7</span>
            <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Real dollar figures</span>
          </div>
        </Card>
      )}

      {/* Tool Cards — refined grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Diagnostic Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const done = isCompleted(tool.id);
            const result = get(tool.id);
            return (
              <Link key={tool.id} href={tool.path} className="group">
                <Card
                  className="p-5 h-full flex flex-col gap-4 transition-all duration-200 hover:shadow-md hover:border-border hover:-translate-y-0.5 cursor-pointer"
                  data-testid={`card-dash-${tool.id}`}
                >
                  {/* Icon + status row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    {done ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" /> Done
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                        {tool.time}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {done && result?.data?.headline
                        ? String(result.data.headline)
                        : tool.description
                      }
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center text-xs font-medium text-primary group-hover:gap-2 gap-1 transition-all">
                    {done ? "View Results" : "Run This Tool"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-1">
            <h2 className="text-sm font-semibold">Turn these findings into faster collections</h2>
            <p className="text-sm text-muted-foreground">
              Payra customers reduce DSO by 38% and reclaim 16+ hours/month with ERP-native AR automation. See how it works for your numbers.
            </p>
          </div>
          <Button asChild className="gap-2 shrink-0">
            <a
              href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=bottom-cta`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              See Payra with My Numbers
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
