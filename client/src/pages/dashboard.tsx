import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL, formatPercent } from "@/lib/constants";
import { useResults } from "@/lib/store";
import { Check, ArrowRight, CircleCheck, Calendar } from "lucide-react";
import { MeasurementMarks } from "@/components/ConstructionPatterns";

export default function Dashboard() {
  const { completedCount, isCompleted, overallScore, get } = useResults();
  const progress = (completedCount / TOOLS.length) * 100;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative" data-testid="page-dashboard">
      {/* Subtle measurement marks background for dashboard */}
      <div className="absolute inset-0 pointer-events-none text-foreground overflow-hidden">
        <MeasurementMarks />
      </div>

      {/* Welcome */}
      <div className="space-y-1 relative z-10">
        <h1 className="text-xl font-bold" data-testid="text-welcome">AR Toolbox Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Run diagnostics on your accounts receivable process and find opportunities.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="p-5 space-y-3 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-sm">Your Progress</h2>
          <Badge variant="secondary">{completedCount} of {TOOLS.length} complete</Badge>
        </div>
        <Progress value={progress} className="h-2" />
        {overallScore !== null && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm text-muted-foreground">AR Health Score:</span>
            <span className="font-bold text-primary text-lg">{Math.round(overallScore)}/100</span>
          </div>
        )}
        {completedCount === TOOLS.length && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-primary/5">
            <CircleCheck className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">All diagnostics complete. <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=all-complete`} target="_blank" rel="noopener noreferrer" className="text-primary underline">Schedule a demo to improve these numbers</a>.</p>
          </div>
        )}
        {completedCount > 0 && completedCount < TOOLS.length && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">Already seeing opportunities? <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=mid-progress`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium">Book a demo</a> to discuss your results so far.</p>
          </div>
        )}
      </Card>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {TOOLS.map((tool) => {
          const done = isCompleted(tool.id);
          const result = get(tool.id);
          return (
            <Card key={tool.id} className="p-4 flex flex-col gap-3" data-testid={`card-dash-${tool.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <tool.icon className="h-4 w-4 text-primary" />
                </div>
                {done ? (
                  <Badge variant="default" className="text-xs"><Check className="h-3 w-3 mr-1" /> Done</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">{tool.time}</Badge>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{tool.name}</h3>
                {done && result?.data?.headline && (
                  <p className="text-xs text-muted-foreground mt-1">{String(result.data.headline)}</p>
                )}
              </div>
              <Button asChild variant={done ? "secondary" : "default"} size="sm" className="w-full">
                <Link href={tool.path}>
                  {done ? "View Results" : "Start"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="p-5 bg-primary/5 dark:bg-primary/10 text-center space-y-3 relative z-10">
        <h2 className="font-semibold text-sm">Want to improve these numbers?</h2>
        <p className="text-sm text-muted-foreground">See how Payra's ERP-native AR automation can reduce your DSO by 38%, automate collections, and save 16+ hours a month.</p>
        <Button asChild className="gap-1.5">
          <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=dashboard&utm_campaign=bottom-cta`} target="_blank" rel="noopener noreferrer">
            <Calendar className="h-3.5 w-3.5" /> Schedule a Demo <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Button>
      </Card>
    </div>
  );
}
