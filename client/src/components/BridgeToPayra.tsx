import { Button } from "@/components/ui/button";
import { PAYRA_DEMO_URL } from "@/lib/constants";
import { ArrowRight, Calendar } from "lucide-react";
import { trackDemoClick } from "@/lib/analytics";

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
  heading = "How Payra Helps",
  body,
  stat,
  statLabel,
  ctaText = "Schedule a Demo",
  utmContent,
}: BridgeToPayraProps) {
  const demoUrl = utmContent
    ? `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=tool-results&utm_content=${utmContent}`
    : `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=tool-results`;

  return (
    <div
      className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-5 space-y-3"
      data-testid="bridge-to-payra"
    >
      <h3 className="font-semibold text-sm text-primary flex items-center gap-1.5">
        {heading}
      </h3>
      <p className="text-sm text-foreground/80 leading-relaxed">{body}</p>
      {stat && (
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-primary">{stat}</span>
          {statLabel && <span className="text-xs text-muted-foreground">{statLabel}</span>}
        </div>
      )}
      <Button asChild size="sm" className="mt-2 gap-1.5">
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-payra-demo"
          onClick={() => trackDemoClick("bridge_to_payra", utmContent)}
        >
          <Calendar className="h-3.5 w-3.5" />
          {ctaText}
          <ArrowRight className="h-3.5 w-3.5" />
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
  /** Short, punchy message referencing user's numbers, e.g. "You could free $274K..." */
  message: string;
  utmContent?: string;
}

export function InlineDemoCTA({ message, utmContent }: InlineDemoCTAProps) {
  const demoUrl = utmContent
    ? `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=inline-cta&utm_content=${utmContent}`
    : `${PAYRA_DEMO_URL}?utm_source=ar-toolbox&utm_medium=app&utm_campaign=inline-cta`;

  return (
    <div
      className="flex items-center gap-3 rounded-md border border-primary/15 bg-primary/5 px-4 py-3"
      data-testid="inline-demo-cta"
    >
      <p className="flex-1 text-sm text-foreground/80">{message}</p>
      <Button asChild size="sm" variant="default" className="shrink-0 gap-1.5">
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-inline-demo"
          onClick={() => trackDemoClick("inline_cta", utmContent)}
        >
          <Calendar className="h-3.5 w-3.5" />
          Book a Demo
        </a>
      </Button>
    </div>
  );
}
