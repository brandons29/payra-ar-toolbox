import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/constants";

const TIERS = [
  { label: "Top Quartile", min: 90, max: 100, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Above Average", min: 80, max: 89.99, color: "text-blue-600 dark:text-blue-400" },
  { label: "Average", min: 70, max: 79.99, color: "text-amber-600 dark:text-amber-400" },
  { label: "Below Average", min: 60, max: 69.99, color: "text-orange-600 dark:text-orange-400" },
  { label: "Critical", min: 0, max: 59.99, color: "text-red-600 dark:text-red-400" },
];

function getTier(score: number) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[TIERS.length - 1];
}

export default function CEICalculator() {
  const { save } = useResults();
  const [beginningAR, setBeginningAR] = useState(1_500_000);
  const [endingAR, setEndingAR] = useState(1_200_000);
  const [endingCurrentAR, setEndingCurrentAR] = useState(800_000);
  const [creditSales, setCreditSales] = useState(2_000_000);
  const [annualRevenue, setAnnualRevenue] = useState(20_000_000);
  const [saved, setSaved] = useState(false);

  const calcs = useMemo(() => {
    const numerator = beginningAR + creditSales - endingAR;
    const denominator = beginningAR + creditSales - endingCurrentAR;
    const cei = denominator > 0 ? (numerator / denominator) * 100 : 0;
    const clampedCEI = Math.min(100, Math.max(0, cei));
    const tier = getTier(clampedCEI);

    // Dollar impact: 1-point improvement
    const dollarPerPoint = annualRevenue > 0 ? annualRevenue / 100 : 0;

    // Interpretation
    let interpretation = "";
    if (clampedCEI >= 90) {
      interpretation = "Your collections team is performing at an elite level. You're collecting the vast majority of what's owed in a timely manner.";
    } else if (clampedCEI >= 80) {
      interpretation = "Your collections are above average, but there's room to improve. A few process improvements could push you into top-quartile territory.";
    } else if (clampedCEI >= 70) {
      interpretation = "Your collections effectiveness is average. Significant working capital is sitting uncollected — process automation would make a measurable difference.";
    } else if (clampedCEI >= 60) {
      interpretation = "Your collections are below average. You're likely leaving substantial cash on the table and may have process gaps in follow-ups or cash application.";
    } else {
      interpretation = "Your collections process needs urgent attention. A significant portion of revenue is going uncollected, which directly impacts your cash flow and growth.";
    }

    return { cei: clampedCEI, tier, dollarPerPoint, interpretation };
  }, [beginningAR, endingAR, endingCurrentAR, creditSales, annualRevenue]);

  const handleSave = () => {
    save("cei-calculator", {
      beginningAR, endingAR, endingCurrentAR, creditSales, annualRevenue,
      cei: calcs.cei,
      headline: `CEI: ${formatPercent(calcs.cei)} (${calcs.tier.label})`,
    });
    setSaved(true);
  };

  // Gauge visualization
  const gaugeAngle = (calcs.cei / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="page-container space-y-6" data-testid="page-cei">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">CEI Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Measure your Collection Effectiveness Index — the percentage of receivables collected in a given period.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 p-6 space-y-5 self-start lg:sticky lg:top-20">
          <h2 className="font-semibold text-sm">Period Data</h2>
          {[
            { label: "Beginning AR Balance", value: beginningAR, setter: setBeginningAR, id: "beginning-ar" },
            { label: "Credit Sales During Period", value: creditSales, setter: setCreditSales, id: "credit-sales" },
            { label: "Ending Total AR Balance", value: endingAR, setter: setEndingAR, id: "ending-ar" },
            { label: "Ending Current AR (not yet due)", value: endingCurrentAR, setter: setEndingCurrentAR, id: "ending-current" },
            { label: "Annual Revenue", value: annualRevenue, setter: setAnnualRevenue, id: "annual-revenue" },
          ].map((field) => (
            <div key={field.id} className="space-y-1">
              <Label className="text-sm">{field.label}</Label>
              <Input
                type="number"
                value={field.value}
                onChange={(e) => field.setter(Number(e.target.value))}
                className="text-sm"
                data-testid={`input-${field.id}`}
              />
            </div>
          ))}
          <div className="pt-1 p-3 rounded-md bg-muted/50 text-xs text-muted-foreground">
            <strong>CEI Formula:</strong> (Beginning AR + Credit Sales - Ending AR) / (Beginning AR + Credit Sales - Ending Current AR) x 100
          </div>
          <Button onClick={handleSave} className="w-full" size="sm">
            {saved ? "Saved" : "Save Results"}
          </Button>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Gauge */}
          <Card className="p-6 text-center space-y-3">
            <div className="mx-auto w-40 h-24 relative">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                {/* Background arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
                {/* Filled arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(calcs.cei / 100) * 251.3} 251.3`}
                />
                <text x="100" y="85" textAnchor="middle" className="text-2xl font-bold" fill="hsl(var(--foreground))" fontSize="28">
                  {formatPercent(calcs.cei)}
                </text>
                <text x="100" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">
                  CEI Score
                </text>
              </svg>
            </div>
            <Badge variant="secondary" className="text-sm">
              <span className={calcs.tier.color}>{calcs.tier.label}</span>
            </Badge>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{calcs.interpretation}</p>
          </Card>

          {/* Dollar Impact */}
          <Card className="p-5 space-y-2">
            <h3 className="font-semibold text-sm">Dollar Impact</h3>
            <p className="text-sm">
              Each 1-point improvement in CEI = <strong className="text-primary">{formatCurrency(calcs.dollarPerPoint)}</strong> in additional collected revenue per period.
            </p>
            {calcs.cei < 90 && (
              <p className="text-sm text-muted-foreground">
                Reaching top quartile (90%) would mean collecting an additional <strong>{formatCurrency((90 - calcs.cei) * calcs.dollarPerPoint)}</strong>.
              </p>
            )}
          </Card>

          {/* Benchmark Bar */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-sm">Benchmark Comparison</h3>
            <div className="space-y-2">
              {TIERS.map((tier) => (
                <div key={tier.label} className="flex items-center gap-2">
                  <span className="text-xs w-24 text-muted-foreground">{tier.label}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full relative">
                    <div
                      className="h-3 rounded-full bg-primary/20"
                      style={{ width: `${((tier.max - tier.min) / 100) * 100}%`, marginLeft: `${(tier.min / 100) * 100}%` }}
                    />
                    {calcs.cei >= tier.min && calcs.cei <= tier.max && (
                      <div
                        className="absolute top-0 h-3 w-1 bg-primary rounded-full"
                        style={{ left: `${(calcs.cei / 100) * 100}%` }}
                      />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground w-16">{tier.min}-{Math.round(tier.max)}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Inline CTA when below top quartile */}
          {calcs.cei < 90 && (
            <InlineDemoCTA
              message={`A ${formatPercent(90 - calcs.cei)} gap to top-quartile CEI = ${formatCurrency((90 - calcs.cei) * calcs.dollarPerPoint)} in uncollected cash each period. Let us show you the fastest way to close it.`}
              utmContent="cei-below-90"
            />
          )}

          <BridgeToPayra
            heading="Push your CEI above 90% — automatically"
            body={`Payra's automated follow-ups and self-service payment portal make it effortless for customers to pay on time. That means collecting ${formatCurrency((90 - Math.min(calcs.cei, 89)) * calcs.dollarPerPoint)} more per period — without chasing.`}
            stat=">90%"
            statLabel="Average CEI with Payra"
            ctaText="See How to Close the Gap"
            utmContent="cei-calculator"
          />
        </div>
      </div>
    </div>
  );
}
