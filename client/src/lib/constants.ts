import { ClipboardCheck, Calculator, BarChart3, TrendingUp, Clock, DollarSign, Settings, type LucideIcon } from "lucide-react";

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  time: string;
  path: string;
}

export const TOOLS: ToolDefinition[] = [
  { id: "health-scorecard", name: "AR Health Scorecard", shortName: "Health Scorecard", description: "Grade your AR across 6 categories and see where you're losing cash", icon: ClipboardCheck, time: "~5 min", path: "/tools/health-scorecard" },
  { id: "dso-calculator", name: "DSO Calculator", shortName: "DSO Calculator", description: "Quantify how much capital is trapped by slow-paying invoices", icon: Calculator, time: "~2 min", path: "/tools/dso-calculator" },
  { id: "aging-analyzer", name: "AR Aging Analyzer", shortName: "Aging Analyzer", description: "Size your bad debt exposure across aging buckets", icon: BarChart3, time: "~3 min", path: "/tools/aging-analyzer" },
  { id: "cei-calculator", name: "CEI Calculator", shortName: "CEI Calculator", description: "Measure how effectively your team converts receivables to cash", icon: TrendingUp, time: "~2 min", path: "/tools/cei-calculator" },
  { id: "timeline-mapper", name: "Invoice-to-Cash Mapper", shortName: "Timeline Mapper", description: "Find the exact stages where your collections cycle stalls", icon: Clock, time: "~4 min", path: "/tools/timeline-mapper" },
  { id: "cost-calculator", name: "AR Cost Calculator", shortName: "Cost Calculator", description: "See the true per-invoice cost of your AR process vs. best-in-class", icon: DollarSign, time: "~3 min", path: "/tools/cost-calculator" },
  { id: "erp-readiness", name: "ERP Readiness Check", shortName: "ERP Readiness", description: "Confirm your ERP supports native AR automation with Payra", icon: Settings, time: "~2 min", path: "/tools/erp-readiness" },
];

export const INDUSTRY_BENCHMARKS = {
  Construction: { medianDSO: 65, topQuartileDSO: 45, scorecardAvg: 48 },
  Distribution: { medianDSO: 48, topQuartileDSO: 35, scorecardAvg: 55 },
  "Industrial/Wholesale": { medianDSO: 55, topQuartileDSO: 40, scorecardAvg: 52 },
  Other: { medianDSO: 52, topQuartileDSO: 38, scorecardAvg: 50 },
};

export type Industry = keyof typeof INDUSTRY_BENCHMARKS;

export const PAYRA_URL = "https://payra.com";
export const PAYRA_CTA_URL = "https://book.payra.com?utm_source=ar-toolbox&utm_medium=app&utm_campaign=tool-results";
export const PAYRA_DEMO_URL = "https://book.payra.com";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
