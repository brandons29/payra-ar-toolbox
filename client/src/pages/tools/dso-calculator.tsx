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
import { Check, ArrowDown, ArrowUp } from "lucide-react";

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
    <div className="page-container space-y-6" data-testid="page-dso">
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight">DSO Calculator</h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Calculate how much working capital you could unlock by reducing Days Sales Outstanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2 p-6 space-y-5 self-start lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold">Your Numbers</h2>
          <div className="space-y-1.5">
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
          <Button onClick={handleSave} className="w-full gap-2" size="sm">
            {saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : "Save Results"}
          </Button>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Hero metrics — two-column stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 space-y-1.5">
              <p className="metric-label">Freed Working Capital</p>
              <p className="text-xl font-bold text-primary tracking-tight" data-testid="text-freed-capital">
                {formatCurrency(calcs.freedCapital)}
              </p>
            </Card>
            <Card className="p-5 space-y-1.5">
              <p className="metric-label">Annual Savings</p>
              <p className="text-xl font-bold tracking-tight" data-testid="text-annual-savings">
                {formatCurrency(calcs.annualSavings)}<span className="text-sm font-normal text-muted-foreground">/yr</span>
              </p>
            </Card>
          </div>

          {/* DSO benchmark badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={calcs.dsoVsMedian > 0 ? "destructive" : "default"}
              className="gap-1"
            >
              {calcs.dsoVsMedian > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(calcs.dsoVsMedian)} days {calcs.dsoVsMedian > 0 ? "above" : "below"} {industry} median ({benchmarks.medianDSO}d)
            </Badge>
          </div>

          {/* Scenario Table */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Reduction Scenarios</h3>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm" data-testid="table-scenarios">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Reduction</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Freed Capital</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.scenarios.map((s) => (
                    <tr key={s.reduction} className="border-b last:border-0">
                      <td className="py-3 text-muted-foreground">{s.reduction} days</td>
                      <td className="py-3 font-semibold">{formatCurrency(s.freedCapital)}</td>
                      <td className="py-3 font-semibold">{formatCurrency(s.annualSavings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Chart */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">12-Month Savings Projection</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={calcs.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  labelFormatter={(l) => `Month ${String(l).replace("M", "")}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Line type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Inline CTA after chart */}
          {calcs.freedCapital > 50000 && (
            <InlineDemoCTA
              message={`${formatCurrency(calcs.freedCapital)} in working capital waiting to be unlocked. A 15-minute walkthrough shows the fastest path to freeing it.`}
              utmContent="dso-freed-capital"
            />
          )}

          {/* Benchmarks */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">{industry} Benchmarks</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <p className="metric-label">Median DSO</p>
                <p className="text-lg font-bold">{benchmarks.medianDSO} <span className="text-sm font-normal text-muted-foreground">days</span></p>
              </div>
              <div className="space-y-0.5">
                <p className="metric-label">Top Quartile</p>
                <p className="text-lg font-bold">{benchmarks.topQuartileDSO} <span className="text-sm font-normal text-muted-foreground">days</span></p>
              </div>
            </div>
          </Card>

          <BridgeToPayra
            heading="Reduce your DSO by up to 38%"
            body={`Payra customers in ${industry.toLowerCase()} reduce DSO by an average of 38% with ERP-native automation. For your company, that means approximately ${formatCurrency(revenue / 365 * currentDSO * 0.38)} freed from receivables and back on your balance sheet.`}
            stat="38%"
            statLabel="Average DSO Reduction"
            ctaText="See My DSO Improvement Plan"
            utmContent="dso-calculator"
          />
        </div>
      </div>
    </div>
  );
}
