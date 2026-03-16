import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SliderInput } from "@/components/SliderInput";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { INDUSTRY_BENCHMARKS, type Industry, formatCurrency } from "@/lib/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

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

    // Scenario table
    const scenarios = [5, 10, 20].map((days) => ({
      reduction: days,
      freedCapital: dailyRevenue * days,
      annualSavings: dailyRevenue * days * (costOfCapital / 100),
    }));

    // 12-month projection
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const progressFactor = Math.min(1, month / 9); // ramp over 9 months
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
    <div className="p-6 max-w-4xl mx-auto space-y-6" data-testid="page-dso">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">DSO Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Calculate how much working capital you could unlock by reducing Days Sales Outstanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 p-5 space-y-5">
          <h2 className="font-semibold text-sm">Your Numbers</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">Industry</label>
            <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
              <SelectTrigger data-testid="select-industry"><SelectValue /></SelectTrigger>
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
          <Card className="p-5 space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Freed Working Capital</p>
              <p className="text-xl font-bold text-primary" data-testid="text-freed-capital">
                {formatCurrency(calcs.freedCapital)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual Borrowing Savings</p>
              <p className="text-lg font-bold" data-testid="text-annual-savings">
                {formatCurrency(calcs.annualSavings)}/yr
              </p>
            </div>
            <Badge variant={calcs.dsoVsMedian > 0 ? "destructive" : "default"}>
              Your DSO of {currentDSO} days is {Math.abs(calcs.dsoVsMedian)} days {calcs.dsoVsMedian > 0 ? "above" : "below"} the {industry} median
            </Badge>
          </Card>

          {/* Scenario Table */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">Reduction Scenarios</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Reduction</th>
                    <th className="pb-2 font-medium text-muted-foreground">Freed Capital</th>
                    <th className="pb-2 font-medium text-muted-foreground">Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.scenarios.map((s) => (
                    <tr key={s.reduction} className="border-b last:border-0">
                      <td className="py-2">{s.reduction} days</td>
                      <td className="py-2 font-medium">{formatCurrency(s.freedCapital)}</td>
                      <td className="py-2 font-medium">{formatCurrency(s.annualSavings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Chart */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">12-Month Savings Projection</h3>
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
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Industry Benchmarks — {industry}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Median DSO</p>
                <p className="font-bold">{benchmarks.medianDSO} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Top Quartile DSO</p>
                <p className="font-bold">{benchmarks.topQuartileDSO} days</p>
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
