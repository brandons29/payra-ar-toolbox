import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderInput } from "@/components/SliderInput";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(153, 45%, 34%)",
  "hsl(200, 60%, 45%)",
  "hsl(40, 74%, 50%)",
  "hsl(0, 70%, 45%)",
  "hsl(270, 50%, 50%)",
];

export default function CostCalculator() {
  const { save } = useResults();
  const [arStaff, setArStaff] = useState(2);
  const [avgSalary, setAvgSalary] = useState(55_000);
  const [monthlyInvoices, setMonthlyInvoices] = useState(500);
  const [annualRevenue, setAnnualRevenue] = useState(20_000_000);
  const [currentDSO, setCurrentDSO] = useState(55);
  const [techCosts, setTechCosts] = useState(5_000);
  const [badDebt, setBadDebt] = useState(25_000);
  const [borrowingRate, setBorrowingRate] = useState(8);
  const [saved, setSaved] = useState(false);

  const calcs = useMemo(() => {
    const fteCost = arStaff * avgSalary * 1.3;
    const financingCost = (annualRevenue / 365) * currentDSO * (borrowingRate / 100);
    const opportunityCost = currentDSO > 35 ? (annualRevenue / 365) * (currentDSO - 35) * 0.10 : 0;
    const totalCost = fteCost + techCosts + financingCost + badDebt + opportunityCost;
    const annualInvoices = monthlyInvoices * 12;
    const costPerInvoice = annualInvoices > 0 ? totalCost / annualInvoices : 0;
    const costPerDollar = annualRevenue > 0 ? totalCost / annualRevenue : 0;
    const benchmarkCPI = 1.20;
    const excessCost = Math.max(0, (costPerInvoice - benchmarkCPI) * annualInvoices);

    const breakdown = [
      { name: "FTE / Labor", value: fteCost },
      { name: "Technology", value: techCosts },
      { name: "Financing", value: financingCost },
      { name: "Bad Debt", value: badDebt },
      { name: "Opportunity", value: opportunityCost },
    ];

    const payraSavings = totalCost * 0.65; // 60-70% reduction

    return { fteCost, financingCost, opportunityCost, totalCost, costPerInvoice, costPerDollar, benchmarkCPI, excessCost, breakdown, payraSavings };
  }, [arStaff, avgSalary, monthlyInvoices, annualRevenue, currentDSO, techCosts, badDebt, borrowingRate]);

  const handleSave = () => {
    save("cost-calculator", {
      arStaff, avgSalary, monthlyInvoices, annualRevenue, currentDSO, techCosts, badDebt, borrowingRate,
      totalCost: calcs.totalCost,
      costPerInvoice: calcs.costPerInvoice,
      headline: `${formatCurrency(calcs.costPerInvoice)}/invoice (benchmark: $1.20)`,
    });
    setSaved(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" data-testid="page-cost">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">AR Cost Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Calculate the true total cost of your accounts receivable process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="premium-card lg:col-span-2 p-6 space-y-4">
          <h2 className="font-semibold text-sm">Your AR Operation</h2>
          <SliderInput label="Number of AR Staff" value={arStaff} onChange={setArStaff} min={1} max={20} testId="slider-ar-staff" />
          <SliderInput label="Average AR Salary" value={avgSalary} onChange={setAvgSalary} min={30_000} max={100_000} step={5_000} prefix="$" testId="slider-salary" />
          <SliderInput label="Monthly Invoice Volume" value={monthlyInvoices} onChange={setMonthlyInvoices} min={10} max={5_000} step={10} testId="slider-invoices" />
          <SliderInput label="Annual Revenue" value={annualRevenue} onChange={setAnnualRevenue} min={1_000_000} max={500_000_000} step={1_000_000} prefix="$" testId="slider-revenue" />
          <SliderInput label="Current DSO" value={currentDSO} onChange={setCurrentDSO} min={15} max={120} suffix="days" testId="slider-dso" />
          <div className="space-y-1">
            <Label className="text-sm">Annual Technology Costs</Label>
            <Input type="number" value={techCosts} onChange={(e) => setTechCosts(Number(e.target.value))} className="text-sm" data-testid="input-tech" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Annual Bad Debt Write-offs</Label>
            <Input type="number" value={badDebt} onChange={(e) => setBadDebt(Number(e.target.value))} className="text-sm" data-testid="input-bad-debt" />
          </div>
          <SliderInput label="Borrowing Rate" value={borrowingRate} onChange={setBorrowingRate} min={1} max={20} suffix="%" testId="slider-borrowing" />
          <Button onClick={handleSave} className="w-full" size="sm">
            {saved ? "Saved" : "Save Results"}
          </Button>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Key Metrics */}
          <Card className="premium-card p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Cost Per Invoice</p>
                <p className="text-2xl font-bold text-primary tracking-tight">{formatCurrency(calcs.costPerInvoice)}</p>
                <p className="text-xs text-muted-foreground">Best-in-class: {formatCurrency(calcs.benchmarkCPI)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Annual AR Cost</p>
                <p className="text-xl font-bold tracking-tight">{formatCurrency(calcs.totalCost)}</p>
              </div>
            </div>
            {calcs.excessCost > 0 && (
              <Badge variant="destructive">
                {formatCurrency(calcs.excessCost)}/year in excess AR cost
              </Badge>
            )}
          </Card>

          {/* Donut Chart */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={calcs.breakdown.filter((b) => b.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {calcs.breakdown.filter((b) => b.value > 0).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Breakdown Table */}
          <Card className="premium-card p-5">
            <h3 className="font-semibold text-sm mb-3">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Component</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Amount</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.breakdown.map((b) => (
                    <tr key={b.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2">{b.name}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(b.value)}</td>
                      <td className="py-2 text-right text-muted-foreground">
                        {calcs.totalCost > 0 ? ((b.value / calcs.totalCost) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-2">Total</td>
                    <td className="py-2 text-right">{formatCurrency(calcs.totalCost)}</td>
                    <td className="py-2 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Inline CTA when excess cost is significant */}
          {calcs.excessCost > 10000 && (
            <InlineDemoCTA
              message={`You're spending ${formatCurrency(calcs.excessCost)}/year more than best-in-class. See how Payra eliminates that gap in a quick demo.`}
              utmContent="cost-excess"
            />
          )}

          <BridgeToPayra
            heading="Cut Your AR Costs by 60-70%"
            body={`Payra reduces cost-per-invoice by 60-70% through automation. At your volume of ${monthlyInvoices.toLocaleString()} invoices/month, that's approximately ${formatCurrency(calcs.payraSavings)} in annual savings — let us walk you through the ROI.`}
            stat="60-70%"
            statLabel="Cost-per-invoice reduction"
            ctaText="Schedule a Cost Review"
            utmContent="cost-calculator"
          />
        </div>
      </div>
    </div>
  );
}
