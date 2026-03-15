import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResults } from "@/lib/store";
import { TOOLS, PAYRA_CTA_URL, PAYRA_DEMO_URL } from "@/lib/constants";
import { ArrowRight, ClipboardList, Sparkles, ExternalLink, BarChart3, Clock, FileText } from "lucide-react";

export default function Results() {
  const { results, completedCount } = useResults();

  return (
    <div className="page-container space-y-6" data-testid="page-results">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight">My Results</h1>
          <p className="text-sm text-muted-foreground">
            {completedCount === 0
              ? "View results from all completed diagnostic tools."
              : `${completedCount} of ${TOOLS.length} tools completed`
            }
          </p>
        </div>
        {completedCount > 0 && completedCount < TOOLS.length && (
          <Button asChild size="sm" variant="outline" className="gap-1.5 shrink-0 self-start">
            <Link href="/dashboard">
              Continue Audit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {completedCount === 0 ? (
        <Card className="p-12 text-center space-y-4 border-dashed">
          <div className="mx-auto h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-semibold text-base">No results yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Complete your first diagnostic tool to see results here. Each tool takes 2–5 minutes.
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/dashboard" data-testid="link-go-dashboard">Go to Dashboard <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => {
              const result = results.find((r) => r.toolId === tool.id);
              if (!result) return null;
              return (
                <Link key={tool.id} href={tool.path} className="group">
                  <Card
                    className="p-5 h-full space-y-3 transition-all duration-200 hover:shadow-md hover:border-border hover:-translate-y-0.5 cursor-pointer"
                    data-testid={`card-result-${tool.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                        <tool.icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {result.completedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
                      {result.data.headline && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{String(result.data.headline)}</p>
                      )}
                    </div>
                    <div className="flex items-center text-xs font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                      View Full Results
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Contextual CTAs */}
          {completedCount > 0 && completedCount < TOOLS.length && (
            <Card className="p-5 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  You've completed {completedCount} of {TOOLS.length} tools. Already seeing areas to improve?
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
                <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=results&utm_campaign=partial-complete`} target="_blank" rel="noopener noreferrer">
                  <Sparkles className="h-3.5 w-3.5" /> Discuss Results
                </a>
              </Button>
            </Card>
          )}

          {completedCount === TOOLS.length && (
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 space-y-1">
                  <h2 className="text-sm font-semibold">All 7 Diagnostics Complete</h2>
                  <p className="text-sm text-muted-foreground">
                    You've completed a full AR audit. Turn these insights into measurable improvements.
                  </p>
                </div>
                <Button asChild className="gap-2 shrink-0">
                  <a href={`${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=results&utm_campaign=all-complete`} target="_blank" rel="noopener noreferrer">
                    <Sparkles className="h-3.5 w-3.5" /> Schedule Demo <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
