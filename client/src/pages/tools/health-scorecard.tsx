import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { ArrowRight, ArrowLeft, RotateCcw, Info, Lightbulb } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { useToolTracking } from "@/hooks/useToolTracking";

interface Question {
  text: string;
  options: { label: string; score: number }[];
}

interface Category {
  name: string;
  questions: Question[];
  payraFix: string;
  payraStat: string;
}

const categories: Category[] = [
  {
    name: "Collections Process",
    payraFix: "Payra automates collection sequences with AI-prioritized follow-ups, escalation rules, and multi-channel dunning — eliminating manual chase-downs.",
    payraStat: "75% decrease in collection calls",
    questions: [
      { text: "How do you currently follow up on overdue invoices?", options: [{ label: "Manually via email/phone", score: 1 }, { label: "Semi-automated with templates", score: 2 }, { label: "Automated sequences with escalation rules", score: 3 }, { label: "Fully automated with AI prioritization", score: 4 }] },
      { text: "How often do you review your collections queue?", options: [{ label: "Monthly or less", score: 1 }, { label: "Weekly", score: 2 }, { label: "Daily", score: 3 }, { label: "Real-time dashboard", score: 4 }] },
      { text: "Do you have defined escalation rules for delinquent accounts?", options: [{ label: "No formal process", score: 1 }, { label: "Informal guidelines", score: 2 }, { label: "Documented process", score: 3 }, { label: "Automated escalation workflows", score: 4 }] },
    ],
  },
  {
    name: "Cash Application",
    payraFix: "Payra auto-matches payments to invoices in real time — handling remittance data, partial payments, and deductions without manual intervention.",
    payraStat: "99% auto-reconciliation rate",
    questions: [
      { text: "How do you match incoming payments to open invoices?", options: [{ label: "Entirely manual, one by one", score: 1 }, { label: "Manual with spreadsheet help", score: 2 }, { label: "Semi-automated with ERP matching", score: 3 }, { label: "Fully automated matching", score: 4 }] },
      { text: "How long does your daily cash application process take?", options: [{ label: "Over 4 hours", score: 1 }, { label: "2-4 hours", score: 2 }, { label: "1-2 hours", score: 3 }, { label: "Under 1 hour or automated", score: 4 }] },
      { text: "What percentage of payments require manual intervention?", options: [{ label: "Over 50%", score: 1 }, { label: "25-50%", score: 2 }, { label: "10-25%", score: 3 }, { label: "Under 10%", score: 4 }] },
    ],
  },
  {
    name: "Customer Communication",
    payraFix: "Payra provides a branded self-service portal where customers view invoices, make payments, raise disputes, and access statements — 24/7.",
    payraStat: "16+ hours saved per month",
    questions: [
      { text: "Do your customers have access to a self-service payment portal?", options: [{ label: "No portal", score: 1 }, { label: "Basic statement access only", score: 2 }, { label: "Portal with payment capability", score: 3 }, { label: "Full portal with disputes, payments, and statements", score: 4 }] },
      { text: "How do customers receive invoices and statements?", options: [{ label: "Paper mail only", score: 1 }, { label: "Email attachments", score: 2 }, { label: "Email with online access", score: 3 }, { label: "Automated delivery via portal with notifications", score: 4 }] },
      { text: "How do customers raise disputes or discrepancies?", options: [{ label: "Phone calls only", score: 1 }, { label: "Email", score: 2 }, { label: "Email with tracking", score: 3 }, { label: "Self-service portal with workflow", score: 4 }] },
    ],
  },
  {
    name: "Credit Management",
    payraFix: "Payra automates credit applications, scoring, and limit monitoring — onboarding new customers in days, not weeks.",
    payraStat: "3-day average customer onboarding",
    questions: [
      { text: "How do you evaluate new customer credit applications?", options: [{ label: "No formal credit check", score: 1 }, { label: "Manual credit check", score: 2 }, { label: "Standardized process with credit reports", score: 3 }, { label: "Automated credit scoring with configurable rules", score: 4 }] },
      { text: "How long does it take to onboard a new credit customer?", options: [{ label: "Over 2 weeks", score: 1 }, { label: "1-2 weeks", score: 2 }, { label: "3-5 days", score: 3 }, { label: "Under 3 days", score: 4 }] },
      { text: "Do you regularly review and update credit limits?", options: [{ label: "Rarely/never", score: 1 }, { label: "Annually", score: 2 }, { label: "Quarterly", score: 3 }, { label: "Continuously monitored", score: 4 }] },
    ],
  },
  {
    name: "Reporting & Visibility",
    payraFix: "Payra delivers real-time dashboards with DSO tracking, aging trends, cash flow forecasting, and consolidated multi-entity views.",
    payraStat: "Real-time AR visibility",
    questions: [
      { text: "How do you access AR aging reports?", options: [{ label: "Manually pull from ERP when needed", score: 1 }, { label: "Scheduled ERP reports", score: 2 }, { label: "Dashboard with daily refresh", score: 3 }, { label: "Real-time dashboard with alerts", score: 4 }] },
      { text: "Can you see DSO trends over time?", options: [{ label: "Not tracked", score: 1 }, { label: "Calculated manually monthly", score: 2 }, { label: "Automated monthly reporting", score: 3 }, { label: "Real-time DSO tracking with forecasting", score: 4 }] },
      { text: "Can you see consolidated AR across entities?", options: [{ label: "Manual consolidation in spreadsheets", score: 1 }, { label: "No consolidated view / single entity", score: 2 }, { label: "Consolidated in ERP with effort", score: 3 }, { label: "Unified dashboard across all entities", score: 4 }] },
    ],
  },
  {
    name: "ERP Integration",
    payraFix: "Payra integrates natively with 12+ ERPs, providing bidirectional real-time sync — no CSV exports, no re-keying, no data discrepancies.",
    payraStat: "12+ native ERP integrations",
    questions: [
      { text: "How does AR data flow between your systems?", options: [{ label: "Manual re-keying between systems", score: 1 }, { label: "CSV export/import", score: 2 }, { label: "One-way automated sync", score: 3 }, { label: "Bidirectional real-time sync", score: 4 }] },
      { text: "How often do you reconcile AR data between systems?", options: [{ label: "Rarely/never", score: 1 }, { label: "Monthly", score: 2 }, { label: "Weekly", score: 3 }, { label: "Automatic/continuous", score: 4 }] },
      { text: "Do you experience data discrepancies between your ERP and actual receivables?", options: [{ label: "Frequently", score: 1 }, { label: "Sometimes", score: 2 }, { label: "Rarely", score: 3 }, { label: "Never — systems are always in sync", score: 4 }] },
    ],
  },
];

function getGrade(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getGradeColor(grade: string): string {
  if (grade === "A") return "text-emerald-600 dark:text-emerald-400";
  if (grade === "B") return "text-sky-600 dark:text-sky-400";
  if (grade === "C") return "text-amber-600 dark:text-amber-400";
  if (grade === "D") return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getGradeBg(grade: string): string {
  if (grade === "A") return "bg-emerald-50 dark:bg-emerald-950/30";
  if (grade === "B") return "bg-sky-50 dark:bg-sky-950/30";
  if (grade === "C") return "bg-amber-50 dark:bg-amber-950/30";
  if (grade === "D") return "bg-orange-50 dark:bg-orange-950/30";
  return "bg-red-50 dark:bg-red-950/30";
}

export default function HealthScorecard() {
  const { markStarted, reportProgress } = useToolTracking("health_scorecard");
  const { save, get } = useResults();
  const existing = get("health-scorecard");
  const [answers, setAnswers] = useState<number[][]>(
    existing
      ? (existing.data.answers as number[][])
      : categories.map((c) => c.questions.map(() => -1))
  );
  const [currentCat, setCurrentCat] = useState(0);
  const [showResults, setShowResults] = useState(!!existing);

  const totalQuestions = categories.reduce((s, c) => s + c.questions.length, 0);
  const answeredCount = answers.flat().filter((a) => a >= 0).length;
  const allAnswered = answeredCount === totalQuestions;

  const categoryScores = useMemo(() => {
    return categories.map((cat, ci) => {
      const raw = answers[ci].reduce((s, a) => s + (a >= 0 ? a + 1 : 0), 0);
      const maxRaw = cat.questions.length * 4;
      const normalized = maxRaw > 0 ? (raw / maxRaw) * 100 : 0;
      return { name: cat.name, score: Math.round(normalized), grade: getGrade(normalized) };
    });
  }, [answers]);

  const overallScore = useMemo(() => {
    const avg = categoryScores.reduce((s, c) => s + c.score, 0) / categoryScores.length;
    return Math.round(avg);
  }, [categoryScores]);

  const handleAnswer = (catIdx: number, qIdx: number, optIdx: number) => {
    const next = answers.map((a) => [...a]);
    next[catIdx][qIdx] = optIdx;
    setAnswers(next);
  };

  const handleSubmit = () => {
    save("health-scorecard", {
      answers,
      categoryScores,
      overallScore,
      headline: `Score: ${overallScore}/100 (${getGrade(overallScore)})`,
    });
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers(categories.map((c) => c.questions.map(() => -1)));
    setCurrentCat(0);
    setShowResults(false);
  };

  if (showResults) {
    const radarData = categoryScores.map((c) => ({
      category: c.name.split(" ")[0],
      score: c.score,
      benchmark: 52,
    }));

    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6" data-testid="page-scorecard-results" onChangeCapture={() => markStarted()} onClickCapture={() => markStarted()}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight">AR Health Scorecard Results</h1>
          <Button variant="secondary" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Retake
          </Button>
        </div>

        {/* Overall Score Card */}
        <Card className="premium-card p-8 text-center space-y-3">
          <div className="mx-auto w-28 h-28 rounded-full border-[5px] border-primary/20 flex items-center justify-center relative">
            <svg width="112" height="112" className="absolute inset-0 progress-ring">
              <circle cx="56" cy="56" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="5"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - overallScore / 100)}
                strokeLinecap="round"
                className="progress-ring-circle"
              />
            </svg>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-primary tracking-tight animate-count-up">{overallScore}</div>
              <div className={`text-base font-bold ${getGradeColor(getGrade(overallScore))}`}>{getGrade(overallScore)}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your overall AR maturity score is <strong>{overallScore}/100</strong> compared to the industry average of <strong>52</strong>.
          </p>
        </Card>

        {/* Contextual tip */}
        {overallScore < 60 && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-4">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Companies scoring below 60 typically see the largest ROI from AR automation — often recovering 30-40% of their manual processing costs within 6 months.
            </p>
          </div>
        )}

        {/* Radar Chart */}
        <Card className="premium-card p-5">
          <h3 className="text-sm font-semibold mb-1">Category Overview</h3>
          <p className="text-xs text-muted-foreground mb-3">Your scores vs. industry average (52)</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Radar name="Your Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Industry Avg" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="4 4" strokeWidth={1} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Inline CTA when overall score is poor */}
        {overallScore < 60 && (
          <InlineDemoCTA
            message={`A score of ${overallScore}/100 means major opportunities to improve. Schedule a demo to see exactly which areas Payra can transform.`}
            utmContent="scorecard-low-score"
          />
        )}

        {/* Category Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryScores.map((cat, i) => (
              <Card key={cat.name} className="premium-card p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{cat.score}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${getGradeColor(cat.grade)} ${getGradeBg(cat.grade)}`}>{cat.grade}</span>
                  </div>
                </div>
                <Progress value={cat.score} className="h-1.5" />
                {cat.score < 70 && (
                  <BridgeToPayra
                    body={categories[i].payraFix}
                    stat={categories[i].payraStat}
                    ctaText="See How Payra Fixes This"
                    utmContent={`scorecard-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <BridgeToPayra
          heading="Get Your Personalized AR Improvement Plan"
          body={`With a score of ${overallScore}/100, there are clear areas where automation can make a measurable difference. Let us walk you through a custom plan for your business.`}
          stat={`${overallScore}/100`}
          statLabel="Your AR Maturity Score"
          ctaText="Schedule Your AR Review"
          utmContent="scorecard-overall"
        />
      </div>
    );
  }

  const cat = categories[currentCat];
  const currentCatAnswered = answers[currentCat].filter((a) => a >= 0).length;
  const currentCatTotal = cat.questions.length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6" data-testid="page-scorecard">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">AR Health Scorecard</h1>
        <p className="text-sm text-muted-foreground">
          Answer 18 questions across 6 categories to get your AR maturity grade.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{cat.name} ({currentCat + 1} of {categories.length})</span>
          <span>{answeredCount}/{totalQuestions} answered</span>
        </div>
        <Progress value={(answeredCount / totalQuestions) * 100} className="h-1.5" />
        {/* Category step indicators */}
        <div className="flex gap-1.5 pt-1">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentCat(i)}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i === currentCat
                  ? "bg-primary"
                  : i < currentCat || answers[i].every(a => a >= 0)
                    ? "bg-primary/30"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Questions */}
      <Card className="premium-card p-6 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-base">{cat.name}</h2>
          <span className="text-xs text-muted-foreground">{currentCatAnswered}/{currentCatTotal}</span>
        </div>
        {cat.questions.map((q, qi) => (
          <div key={qi} className="space-y-2.5">
            <p className="text-sm font-medium">{q.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleAnswer(currentCat, qi, oi)}
                  className={`text-left px-4 py-3 text-sm rounded-xl border transition-all duration-150 ${
                    answers[currentCat][qi] === oi
                      ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                  }`}
                  data-testid={`button-q${currentCat}-${qi}-opt${oi}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCurrentCat(Math.max(0, currentCat - 1))}
          disabled={currentCat === 0}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </Button>
        {currentCat < categories.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setCurrentCat(currentCat + 1)}
            className="gap-1.5"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={!allAnswered} className="gap-1.5">
            View Results <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
