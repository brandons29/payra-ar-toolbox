import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SliderInput } from "@/components/SliderInput";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Step {
  name: string;
  label: string;
  daysLabel: string;
  daysDefault: number;
  daysMax: number;
  benchmark: number;
  internal: boolean;
  extraType: "toggle" | "dropdown" | "slider";
  extraLabel: string;
  extraOptions?: string[];
  extraDefault?: string | number | boolean;
}

const STEPS: Step[] = [
  { name: "Invoice Creation", label: "Invoice Creation", daysLabel: "Days from service delivery to invoice", daysDefault: 2, daysMax: 10, benchmark: 0.5, internal: true, extraType: "toggle", extraLabel: "Is this automated?" },
  { name: "Invoice Delivery", label: "Invoice Delivery", daysLabel: "Days until customer receives invoice", daysDefault: 1, daysMax: 7, benchmark: 0.5, internal: true, extraType: "dropdown", extraLabel: "Delivery method", extraOptions: ["Paper mail", "Email attachment", "Portal", "Auto-delivered"] },
  { name: "Customer Approval", label: "Customer Approval", daysLabel: "Average days for customer to approve", daysDefault: 10, daysMax: 30, benchmark: 7, internal: false, extraType: "slider", extraLabel: "% of invoices disputed", extraDefault: 10 },
  { name: "Payment Initiation", label: "Payment Initiation", daysLabel: "Average days from approval to payment", daysDefault: 15, daysMax: 30, benchmark: 10, internal: false, extraType: "dropdown", extraLabel: "Primary payment method", extraOptions: ["Check", "ACH", "Wire", "Credit Card", "Mixed"] },
  { name: "Cash Application", label: "Cash Application", daysLabel: "Days to match and apply payment", daysDefault: 3, daysMax: 10, benchmark: 0.5, internal: true, extraType: "toggle", extraLabel: "Is this automated?" },
  { name: "ERP Reconciliation", label: "ERP Reconciliation", daysLabel: "Days to reconcile in ERP", daysDefault: 1, daysMax: 5, benchmark: 0.25, internal: true, extraType: "dropdown", extraLabel: "Sync method", extraOptions: ["Manual re-key", "CSV import", "One-way sync", "Bidirectional sync"] },
];

export default function TimelineMapper() {
  const { save } = useResults();
  const [currentStep, setCurrentStep] = useState(0);
  const [days, setDays] = useState(STEPS.map((s) => s.daysDefault));
  const [extras, setExtras] = useState<(string | number | boolean)[]>(
    STEPS.map((s) => s.extraDefault ?? (s.extraType === "toggle" ? false : s.extraType === "dropdown" ? (s.extraOptions?.[0] || "") : 0))
  );
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalDays = days.reduce((s, d) => s + d, 0);
  const totalBenchmark = STEPS.reduce((s, step) => s + step.benchmark, 0);

  const calcs = useMemo(() => {
    const internalDays = STEPS.reduce((s, step, i) => s + (step.internal ? days[i] : 0), 0);
    const bottleneckIdx = days.reduce((maxI, d, i) => {
      const overBenchmark = d - STEPS[i].benchmark;
      return overBenchmark > days[maxI] - STEPS[maxI].benchmark ? i : maxI;
    }, 0);

    const chartData = STEPS.map((step, i) => ({
      name: step.name.split(" ")[0],
      days: days[i],
      benchmark: step.benchmark,
      isBottleneck: i === bottleneckIdx,
      aboveBenchmark: days[i] > step.benchmark,
    }));

    return { internalDays, bottleneckIdx, chartData };
  }, [days]);

  const handleSave = () => {
    save("timeline-mapper", {
      days, extras,
      totalDays,
      headline: `${totalDays} day cycle (benchmark: ${totalBenchmark.toFixed(0)} days)`,
    });
    setSaved(true);
  };

  if (showResults) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" data-testid="page-timeline-results">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight">Invoice-to-Cash Timeline Results</h1>
          <Button variant="secondary" size="sm" onClick={() => { setShowResults(false); setCurrentStep(0); }}>
            Edit Inputs
          </Button>
        </div>

        {/* Summary */}
        <Card className="premium-card p-5 space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Cycle Time</p>
              <p className="text-2xl font-bold text-primary tracking-tight">{totalDays} days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Benchmark</p>
              <p className="text-lg font-bold">{totalBenchmark.toFixed(1)} days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Internal Bottlenecks</p>
              <p className="text-lg font-bold">{calcs.internalDays} days you control</p>
            </div>
          </div>
          <Badge variant={totalDays > totalBenchmark * 2 ? "destructive" : "secondary"}>
            Biggest bottleneck: {STEPS[calcs.bottleneckIdx].name} — {days[calcs.bottleneckIdx]} days vs. {STEPS[calcs.bottleneckIdx].benchmark} day benchmark
          </Badge>
        </Card>

        {/* Timeline Chart */}
        <Card className="premium-card p-5">
          <h3 className="font-semibold text-sm mb-3">Timeline Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={calcs.chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Days", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={80} />
              <Tooltip formatter={(v: number) => `${v} days`} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {calcs.chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.aboveBenchmark ? "hsl(15, 80%, 50%)" : "hsl(var(--primary))"} />
                ))}
              </Bar>
              <Bar dataKey="benchmark" fill="none" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-primary inline-block" /> Your time</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-orange-500 inline-block" /> Above benchmark</span>
          </div>
        </Card>

        {/* Step Details */}
        <Card className="premium-card p-5">
          <h3 className="font-semibold text-sm mb-3">Step-by-Step Analysis</h3>
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2 border-b last:border-0 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium">{step.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({step.internal ? "Internal" : "External"})</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className={days[i] > step.benchmark ? "text-orange-600 dark:text-orange-400 font-medium" : "text-foreground"}>
                    {days[i]}d
                  </span>
                  <span className="text-muted-foreground">vs {step.benchmark}d</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Inline CTA when cycle is way over benchmark */}
        {totalDays > totalBenchmark * 1.5 && (
          <InlineDemoCTA
            message={`Your cycle is ${Math.round(totalDays - totalBenchmark)} days longer than benchmark. A 15-minute walkthrough can show you where Payra cuts the most time.`}
            utmContent="timeline-over-benchmark"
          />
        )}

        <BridgeToPayra
          heading="Shorten Your Invoice-to-Cash Cycle"
          body={`Payra eliminates the 3 biggest internal bottlenecks: cash application (0 days with auto-reconciliation), collections follow-up (automated same-day dunning), and customer disputes (self-service portal). That's ${calcs.internalDays} days you can remove from your cycle.`}
          stat={`${calcs.internalDays} days`}
          statLabel="of internal delay Payra can eliminate"
          ctaText="Schedule a Cycle Review"
          utmContent="timeline-mapper"
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} size="sm">{saved ? "Saved" : "Save Results"}</Button>
        </div>
      </div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6" data-testid="page-timeline">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Invoice-to-Cash Timeline Mapper</h1>
        <p className="text-sm text-muted-foreground">Map each step in your invoice-to-cash cycle to find bottlenecks.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {STEPS.length}: {step.name}</p>

      <Card className="premium-card p-6 space-y-5">
        <h2 className="font-semibold text-base">{step.label}</h2>
        <SliderInput
          label={step.daysLabel}
          value={days[currentStep]}
          onChange={(v) => { const n = [...days]; n[currentStep] = v; setDays(n); }}
          min={0}
          max={step.daysMax}
          suffix="days"
          testId={`slider-step-${currentStep}`}
        />
        <div className="text-xs text-muted-foreground">Benchmark: {step.benchmark} days</div>

        {/* Extra input */}
        {step.extraType === "toggle" && (
          <div className="flex items-center gap-2">
            <Switch
              checked={extras[currentStep] as boolean}
              onCheckedChange={(v) => { const n = [...extras]; n[currentStep] = v; setExtras(n); }}
              data-testid={`toggle-step-${currentStep}`}
            />
            <Label className="text-sm">{step.extraLabel}</Label>
          </div>
        )}
        {step.extraType === "dropdown" && step.extraOptions && (
          <div className="space-y-1">
            <Label className="text-sm">{step.extraLabel}</Label>
            <Select
              value={extras[currentStep] as string}
              onValueChange={(v) => { const n = [...extras]; n[currentStep] = v; setExtras(n); }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {step.extraOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        {step.extraType === "slider" && (
          <SliderInput
            label={step.extraLabel}
            value={extras[currentStep] as number}
            onChange={(v) => { const n = [...extras]; n[currentStep] = v; setExtras(n); }}
            min={0}
            max={50}
            suffix="%"
            testId={`slider-extra-${currentStep}`}
          />
        )}
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="secondary" size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button size="sm" onClick={() => setCurrentStep(currentStep + 1)}>
            Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        ) : (
          <Button size="sm" onClick={() => setShowResults(true)}>
            View Results <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
