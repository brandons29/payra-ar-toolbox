import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

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
  if (grade === "B") return "text-blue-600 dark:text-blue-400";
  if (grade === "C") return "text-amber-600 dark:text-amber-400";
  if (grade === "D") return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export default function HealthScorecard() {
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
      const raw = answers[ci].reduce((s, a) => s + (a >= 0 ? a + 1 : 0), 0); // 1-4 per question
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
      <div className="page-container space-y-6" data-testid="page-scorecard-results">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight">AR Health Scorecard Results</h1>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retake
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="p-6 text-center space-y-2">
          <div className="mx-auto w-28 h-28 rounded-full border-4 border-primary/20 bg-primary/5 flex items-center justify-center">
            <div>
              <div className="text-2xl font-bold text-primary">{overallScore}</div>
              <div className={`text-lg font-bold ${getGradeColor(getGrade(overallScore))}`}>{getGrade(overallScore)}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your overall AR maturity score is <strong>{overallScore}/100</strong> compared to the industry average of <strong>52</strong>.
          </p>
        </Card>

        {/* Radar Chart */}
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Radar name="Your Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryScores.map((cat, i) => (
            <Card key={cat.name} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold">{cat.score}</span>
                  <span className={`text-sm font-bold ${getGradeColor(cat.grade)}`}>{cat.grade}</span>
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

  return (
    <div className="page-container max-w-3xl space-y-6" data-testid="page-scorecard">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">AR Health Scorecard</h1>
        <p className="text-sm text-muted-foreground">
          Answer 18 questions across 6 categories to get your AR maturity grade.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{cat.name} ({currentCat + 1} of {categories.length})</span>
          <span>{answeredCount}/{totalQuestions} answered</span>
        </div>
        <Progress value={(answeredCount / totalQuestions) * 100} className="h-1.5" />
      </div>

      {/* Questions */}
      <Card className="p-5 space-y-6">
        <h2 className="font-semibold text-base">{cat.name}</h2>
        {cat.questions.map((q, qi) => (
          <div key={qi} className="space-y-2">
            <p className="text-sm font-medium">{q.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleAnswer(currentCat, qi, oi)}
                  className={`text-left px-4 py-2.5 text-sm rounded-lg border transition-all ${
                    answers[currentCat][qi] === oi
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
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
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous
        </Button>
        {currentCat < categories.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setCurrentCat(currentCat + 1)}
          >
            Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={!allAnswered}>
            View Results <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
