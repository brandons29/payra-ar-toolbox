import { Button } from "@/components/ui/button";
import { PAYRA_DEMO_URL } from "@/lib/constants";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";

interface BridgeToPayraProps {
  heading?: string;
  body: string;
  stat?: string;
  statLabel?: string;
  ctaText?: string;
  /** Tool-specific UTM content parameter */
  utmContent?: string;
}

export function BridgeToPayra({
  heading = "How Payra fixes this",
  body,
  stat,
  statLabel,
  ctaText = "See How Payra Fixes This",
  utmContent,
}: BridgeToPayraProps) {
  const demoUrl = utmContent
    ? `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=tool-results&utm_content=${utmContent}`
    : `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=tool-results`;

  return (
    <div
      className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent p-6 space-y-4"
      data-testid="bridge-to-payra"
    >
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="font-semibold text-sm">{heading}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      {stat && (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary tracking-tight">{stat}</span>
          {statLabel && <span className="text-xs text-muted-foreground font-medium">{statLabel}</span>}
        </div>
      )}
      <Button asChild size="sm" className="gap-2 mt-1">
        <a href={demoUrl} target="_blank" rel="noopener noreferrer" data-testid="link-payra-demo">
          {ctaText}
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </Button>
    </div>
  );
}

/**
 * Inline contextual CTA — smaller, appears mid-results to nudge toward demo.
 * Personalized with the user's actual numbers.
 */
interface InlineDemoCTAProps {
  /** Short, punchy message referencing user's numbers */
  message: string;
  utmContent?: string;
}

export function InlineDemoCTA({ message, utmContent }: InlineDemoCTAProps) {
  const demoUrl = utmContent
    ? `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=inline-cta&utm_content=${utmContent}`
    : `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=inline-cta`;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-primary/10 bg-primary/[0.03] px-5 py-4"
      data-testid="inline-demo-cta"
    >
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <p className="flex-1 text-sm text-foreground/80 leading-relaxed">{message}</p>
      <Button asChild size="sm" variant="default" className="shrink-0 gap-1.5">
        <a href={demoUrl} target="_blank" rel="noopener noreferrer" data-testid="link-inline-demo">
          Talk to an AR Expert
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </Button>
    </div>
  );
}
