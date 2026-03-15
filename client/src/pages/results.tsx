import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResults } from "@/lib/store";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL } from "@/lib/constants";
import { ArrowRight, ClipboardList, Calendar } from "lucide-react";

export default function Results() {
  const { results, completedCount } = useResults();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" data-testid="page-results">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">My Results</h1>
        <p className="text-sm text-muted-foreground">
          View results from all completed diagnostic tools.
        </p>
      </div>

      {completedCount === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto" />
          <h2 className="font-semibold text-base">No results yet</h2>
          <p className="text-sm text-muted-foreground">
            Complete your first diagnostic tool to see results here.
          </p>
          <Button asChild size="sm">
            <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => {
              const result = results.find((r) => r.toolId === tool.id);
              if (!result) return null;
              return (
                <Card key={tool.id} className="p-4 space-y-2" data-testid={`card-result-${tool.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <tool.icon className="h-4 w-4 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.completedAt.toLocaleDateString()}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  {result.data.headline && (
                    <p className="text-xs text-muted-foreground">{String(result.data.headline)}</p>
                  )}
                  <Button asChild variant="secondary" size="sm" className="w-full">
                    <Link href={tool.path}>View Full Results</Link>
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* CTA after partial or full completion */}
          {completedCount > 0 && completedCount < TOOLS.length && (
            <Card className="p-5 bg-muted/30 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You've completed {completedCount} of {TOOLS.length} tools. Already seeing areas to improve?
              </p>
              <Button asChild variant="outline" className="gap-1.5">
                <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=results&utm_campaign=partial-complete`} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-3.5 w-3.5" /> Book a Demo to Discuss Results
                </a>
              </Button>
            </Card>
          )}

          {completedCount === TOOLS.length && (
            <Card className="p-5 bg-primary/5 dark:bg-primary/10 text-center space-y-3">
              <h2 className="font-semibold text-sm">All 7 Diagnostics Complete</h2>
              <p className="text-sm text-muted-foreground">
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
