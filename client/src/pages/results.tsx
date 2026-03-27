import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResults } from "@/lib/store";
import { TOOLS, PAYRA_DEMO_URL } from "@/lib/constants";
import { ArrowRight, ClipboardList, Calendar, Sparkles, Check } from "lucide-react";

export default function Results() {
  const { results, completedCount } = useResults();

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" data-testid="page-results">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">My Results</h1>
          <p className="text-sm text-muted-foreground">
            {completedCount > 0
              ? `${completedCount} of ${TOOLS.length} diagnostics completed`
              : "Complete your first diagnostic to see results here."}
          </p>
        </div>
        {completedCount > 0 && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {completedCount}/{TOOLS.length} complete
          </Badge>
        )}
      </div>

      {completedCount === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
            <ClipboardList className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-semibold text-base">No results yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Start with any diagnostic tool to benchmark your AR performance against industry standards.
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {TOOLS.map((tool) => {
              const result = results.find((r) => r.toolId === tool.id);
              if (!result) return null;
              return (
                <Card key={tool.id} className="premium-card p-5 space-y-3" data-testid={`card-result-${tool.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                      <tool.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {result.completedAt.toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                    {result.data.headline && (
                      <p className="text-xs text-primary font-medium">{String(result.data.headline)}</p>
                    )}
                  </div>
                  <Button asChild variant="secondary" size="sm" className="w-full gap-1">
                    <Link href={tool.path}>
                      View Full Results <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Incomplete tools reminder */}
          {completedCount > 0 && completedCount < TOOLS.length && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Not started yet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TOOLS.filter(t => !results.find(r => r.toolId === t.id)).map((tool) => (
                  <Card key={tool.id} className="p-4 flex items-center gap-3 border-dashed">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tool.shortName}</p>
                      <p className="text-[10px] text-muted-foreground">{tool.time}</p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="shrink-0 h-7 px-2 text-xs">
                      <Link href={tool.path}>Start</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {completedCount > 0 && completedCount < TOOLS.length && (
            <Card className="p-5 text-center space-y-2.5 bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Already seeing areas to improve?
              </p>
              <Button asChild variant="outline" className="gap-1.5">
                <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=results&utm_campaign=partial-complete`} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-3.5 w-3.5" /> Book a Demo to Discuss Results
                </a>
              </Button>
            </Card>
          )}

          {completedCount === TOOLS.length && (
            <Card className="p-6 text-center space-y-3 border-primary/15 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">All 7 Diagnostics Complete</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                You've completed a full AR audit. Schedule a demo to turn these insights into measurable improvements.
              </p>
              <Button asChild className="gap-1.5">
                <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=results&utm_campaign=all-complete`} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-3.5 w-3.5" /> Schedule Your Payra Demo <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
