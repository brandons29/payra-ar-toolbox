import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { INDUSTRY_BENCHMARKS, type Industry, formatCurrency, formatPercent } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useToolTracking } from "@/hooks/useToolTracking";

const BUCKETS = [
  { label: "Current (0-30 days)", key: "current", writeOffRate: 0.015, color: "hsl(192, 80%, 54%)" },
  { label: "31-60 days", key: "d31_60", writeOffRate: 0.05, color: "hsl(153, 68%, 42%)" },
  { label: "61-90 days", key: "d61_90", writeOffRate: 0.15, color: "hsl(32, 90%, 55%)" },
  { label: "91-120 days", key: "d91_120", writeOffRate: 0.30, color: "hsl(15, 80%, 50%)" },
  { label: "Over 120 days", key: "d120plus", writeOffRate: 0.50, color: "hsl(7, 88%, 59%)" },
];

export default function AgingAnalyzer() {
  const { markStarted, reportProgress } = useToolTracking("aging_analyzer");
  const { save } = useResults();
  const [totalAR, setTotalAR] = useState(2_000_000);
  const [buckets, setBuckets] = useState<Record<string, number>>({
    current: 1_000_000,
    d31_60: 400_000,
    d61_90: 300_000,
    d91_120: 200_000,
    d120plus: 100_000,
  });
  const [industry, setIndustry] = useState<Industry>("Construction");
  const [saved, setSaved] = useState(false);

  const setBucket = (key: string, value: number) => {
    setBuckets((prev) => ({ ...prev, [key]: value }));
  };

  const bucketsSum = Object.values(buckets).reduce((s, v) => s + v, 0);
  const sumMismatch = Math.abs(bucketsSum - totalAR) > 1;

  const calcs = useMemo(() => {
    const analysis = BUCKETS.map((b) => {
      const amount = buckets[b.key] || 0;
      const pct = totalAR > 0 ? (amount / totalAR) * 100 : 0;
      const exposure = amount * b.writeOffRate;
      return { ...b, amount, pct, exposure };
    });

    const totalExposure = analysis.reduce((s, a) => s + a.exposure, 0);
    const over60 = analysis.slice(2).reduce((s, a) => s + a.amount, 0);
    const over60Pct = totalAR > 0 ? (over60 / totalAR) * 100 : 0;
    const over90 = analysis.slice(3).reduce((s, a) => s + a.amount, 0);
    const over90Pct = totalAR > 0 ? (over90 / totalAR) * 100 : 0;

    let riskRating: string;
    let riskColor: string;
    if (over60Pct < 10) { riskRating = "Low"; riskColor = "text-emerald-600 dark:text-emerald-400"; }
    else if (over60Pct < 20) { riskRating = "Moderate"; riskColor = "text-amber-600 dark:text-amber-400"; }
    else if (over60Pct < 30) { riskRating = "High"; riskColor = "text-orange-600 dark:text-orange-400"; }
    else { riskRating = "Critical"; riskColor = "text-red-600 dark:text-red-400"; }

    const aggressiveRecovery = over60 * 0.65;
    const moderateRecovery = over60 * 0.40;

    const chartData = analysis.map((a) => ({
      name: a.label,
      amount: a.amount,
      exposure: a.exposure,
      color: a.color,
    }));

    return { analysis, totalExposure, over60Pct, over90Pct, riskRating, riskColor, aggressiveRecovery, moderateRecovery, chartData };
  }, [buckets, totalAR]);

  const handleSave = () => {
    save("aging-analyzer", {
      totalAR, buckets, industry,
      totalExposure: calcs.totalExposure,
      riskRating: calcs.riskRating,
      headline: `${calcs.riskRating} risk — ${formatCurrency(calcs.totalExposure)} at risk`,
    });
    setSaved(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" data-testid="page-aging" onChangeCapture={() => markStarted()} onClickCapture={() => markStarted()}>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">AR Aging Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Assess bad debt exposure and collection risk across your receivables portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="premium-card lg:col-span-2 p-6 space-y-4">
          <h2 className="font-semibold text-sm">Enter AR Balances</h2>
          <div className="space-y-1">
            <Label className="text-sm">Industry</Label>
            <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(INDUSTRY_BENCHMARKS).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Total AR Balance</Label>
            <Input type="number" value={totalAR} onChange={(e) => setTotalAR(Number(e.target.value))} className="text-sm" data-testid="input-total-ar" />
          </div>
          {BUCKETS.map((b) => (
            <div key={b.key} className="space-y-1">
              <Label className="text-sm">{b.label}</Label>
              <Input type="number" value={buckets[b.key]} onChange={(e) => setBucket(b.key, Number(e.target.value))} className="text-sm" data-testid={`input-${b.key}`} />
            </div>
          ))}
          {sumMismatch && (
            <p className="text-xs text-destructive">Buckets total ({formatCurrency(bucketsSum)}) doesn't match Total AR ({formatCurrency(totalAR)})</p>
          )}
          <Button onClick={handleSave} className="w-full" size="sm">
            {saved ? "Saved" : "Save Results"}
          </Button>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="premium-card p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Bad Debt Exposure</p>
                <p className="text-xl font-bold tracking-tight text-primary">{formatCurrency(calcs.totalExposure)}</p>
              </div>
              <Badge variant={calcs.riskRating === "Low" ? "default" : "destructive"} className="text-sm">
                <span className={calcs.riskColor}>{calcs.riskRating} Risk</span>
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Over 60 Days</p>
                <p className="font-bold">{formatPercent(calcs.over60Pct)}</p>
                <p className="text-xs text-muted-foreground">Best practice: &lt;10%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Over 90 Days</p>
                <p className="font-bold">{formatPercent(calcs.over90Pct)}</p>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Aging Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={calcs.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {calcs.chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Matrix */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Collections Priority</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Bucket</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Risk %</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Exposure</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.analysis.map((a) => (
                    <tr key={a.key} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2">{a.label}</td>
                      <td className="py-2">{formatCurrency(a.amount)}</td>
                      <td className="py-2">{formatPercent(a.writeOffRate * 100, 1)}</td>
                      <td className="py-2 font-medium">{formatCurrency(a.exposure)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recovery */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-2">Recovery Scenarios</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Aggressive (65%)</p>
                <p className="font-bold">{formatCurrency(calcs.aggressiveRecovery)} within 90 days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Moderate (40%)</p>
                <p className="font-bold">{formatCurrency(calcs.moderateRecovery)} within 90 days</p>
              </div>
            </div>
          </Card>

          {/* Inline CTA if high risk */}
          {(calcs.riskRating === "High" || calcs.riskRating === "Critical") && (
            <InlineDemoCTA
              message={`With ${formatCurrency(calcs.totalExposure)} at risk, see how Payra recovers overdue receivables before they become write-offs.`}
              utmContent="aging-high-risk"
            />
          )}

          <BridgeToPayra
            heading="Recover Overdue Cash Faster"
            body={`Payra's automated collection sequences reduce the 60+ day bucket by 75% within 90 days. That could recover up to ${formatCurrency(calcs.aggressiveRecovery)} of your overdue receivables.`}
            stat="75%"
            statLabel="Reduction in 60+ day receivables"
            ctaText="Schedule a Collections Review"
            utmContent="aging-analyzer"
          />
        </div>
      </div>
    </div>
  );
}
