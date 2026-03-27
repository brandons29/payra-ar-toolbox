import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SliderInput } from "@/components/SliderInput";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { INDUSTRY_BENCHMARKS, type Industry, formatCurrency } from "@/lib/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Lightbulb, ArrowDown } from "lucide-react";

export default function DSOCalculator() {
  const { save } = useResults();
  const [revenue, setRevenue] = useState(10_000_000);
  const [currentDSO, setCurrentDSO] = useState(60);
  const [targetDSO, setTargetDSO] = useState(39);
  const [costOfCapital, setCostOfCapital] = useState(9);
  const [industry, setIndustry] = useState<Industry>("Construction");
  const [saved, setSaved] = useState(false);

  const benchmarks = INDUSTRY_BENCHMARKS[industry];

  const calcs = useMemo(() => {
    const dailyRevenue = revenue / 365;
    const freedCapital = dailyRevenue * (currentDSO - targetDSO);
    const annualSavings = freedCapital * (costOfCapital / 100);
    const dsoReduction = currentDSO - targetDSO;
    const dsoVsMedian = currentDSO - benchmarks.medianDSO;

    const scenarios = [5, 10, 20].map((days) => ({
      reduction: days,
      freedCapital: dailyRevenue * days,
      annualSavings: dailyRevenue * days * (costOfCapital / 100),
    }));

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const progressFactor = Math.min(1, month / 9);
      const achievedReduction = dsoReduction * progressFactor;
      const cumulativeSavings = (dailyRevenue * achievedReduction * (costOfCapital / 100) * month) / 12;
      return {
        month: `M${month}`,
        savings: Math.round(cumulativeSavings),
        dso: Math.round(currentDSO - achievedReduction),
      };
    });

    return { freedCapital, annualSavings, dsoReduction, dsoVsMedian, scenarios, monthlyData };
  }, [revenue, currentDSO, targetDSO, costOfCapital, benchmarks]);

  const handleSave = () => {
    save("dso-calculator", {
      revenue, currentDSO, targetDSO, costOfCapital, industry,
      freedCapital: calcs.freedCapital,
      annualSavings: calcs.annualSavings,
      headline: `${formatCurrency(calcs.freedCapital)} freed capital`,
    });
    setSaved(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" data-testid="page-dso">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">DSO Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Calculate how much working capital you could unlock by reducing Days Sales Outstanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="premium-card lg:col-span-2 p-6 space-y-5">
          <h2 className="font-semibold text-sm">Your Numbers</h2>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Industry</label>
            <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
              <SelectTrigger data-testid="select-industry" className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(INDUSTRY_BENCHMARKS).map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SliderInput label="Annual Revenue" value={revenue} onChange={setRevenue} min={1_000_000} max={500_000_000} step={1_000_000} prefix="$" testId="slider-revenue" />
          <SliderInput label="Current DSO" value={currentDSO} onChange={(v) => { setCurrentDSO(v); if (targetDSO >= v) setTargetDSO(v - 1); }} min={15} max={120} suffix="days" testId="slider-current-dso" />
          <SliderInput label="Target DSO" value={targetDSO} onChange={setTargetDSO} min={10} max={Math.max(11, currentDSO - 1)} suffix="days" testId="slider-target-dso" />
          <SliderInput label="Cost of Capital" value={costOfCapital} onChange={setCostOfCapital} min={1} max={20} suffix="%" testId="slider-cost-capital" />
          <Button onClick={handleSave} className="w-full" size="sm">
            {saved ? "Saved" : "Save Results"}
          </Button>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Hero Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="premium-card metric-glow p-5 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Freed Working Capital</p>
              <p className="text-2xl font-bold text-primary tracking-tight animate-count-up" data-testid="text-freed-capital">
                {formatCurrency(calcs.freedCapital)}
              </p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <ArrowDown className="h-3 w-3" />
                <span>{calcs.dsoReduction}-day reduction</span>
              </div>
            </Card>
            <Card className="premium-card metric-glow p-5 space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Annual Savings</p>
              <p className="text-2xl font-bold tracking-tight animate-count-up" data-testid="text-annual-savings">
                {formatCurrency(calcs.annualSavings)}<span className="text-sm text-muted-foreground font-normal">/yr</span>
              </p>
              <Badge variant={calcs.dsoVsMedian > 0 ? "destructive" : "default"} className="text-[10px]">
                {Math.abs(calcs.dsoVsMedian)} days {calcs.dsoVsMedian > 0 ? "above" : "below"} median
              </Badge>
            </Card>
          </div>

          {/* Contextual insight */}
          {calcs.dsoVsMedian > 10 && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-4">
              <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Your DSO is {calcs.dsoVsMedian} days above the {industry} median. In construction and distribution, even a 5-day reduction can free significant working capital. The top quartile achieves {benchmarks.topQuartileDSO} days.
              </p>
            </div>
          )}

          {/* Scenario Table */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Reduction Scenarios</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Reduction</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Freed Capital</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.scenarios.map((s) => (
                    <tr key={s.reduction} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 flex items-center gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5 text-primary" />
                        {s.reduction} days
                      </td>
                      <td className="py-2.5 font-semibold">{formatCurrency(s.freedCapital)}</td>
                      <td className="py-2.5 font-semibold">{formatCurrency(s.annualSavings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Chart */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-1">12-Month Savings Projection</h3>
            <p className="text-xs text-muted-foreground mb-4">Cumulative savings from DSO reduction over time</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={calcs.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Month ${String(l).replace("M", "")}`} />
                <Line type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Inline CTA after chart */}
          {calcs.freedCapital > 50000 && (
            <InlineDemoCTA
              message={`At ${formatCurrency(calcs.freedCapital)} in potential freed capital, a 15-minute demo could show you the fastest path to get there.`}
              utmContent="dso-freed-capital"
            />
          )}

          {/* Benchmarks */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Industry Benchmarks — {industry}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Median DSO</p>
                <p className="text-lg font-bold">{benchmarks.medianDSO} <span className="text-xs font-normal text-muted-foreground">days</span></p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Quartile</p>
                <p className="text-lg font-bold text-primary">{benchmarks.topQuartileDSO} <span className="text-xs font-normal text-muted-foreground">days</span></p>
              </div>
            </div>
          </Card>

          <BridgeToPayra
            heading="See How Payra Reduces DSO"
            body={`Payra customers in ${industry.toLowerCase()} reduce DSO by an average of 38%. For your company, that would free approximately ${formatCurrency(revenue / 365 * currentDSO * 0.38)} in working capital — let us show you how.`}
            stat="38%"
            statLabel="Average DSO Reduction"
            ctaText="Schedule Your DSO Review"
            utmContent="dso-calculator"
          />
        </div>
      </div>
    </div>
  );
}
