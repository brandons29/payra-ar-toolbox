import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BridgeToPayra, InlineDemoCTA } from "@/components/BridgeToPayra";
import { useResults } from "@/lib/store";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { PAYRA_CTA_URL } from "@/lib/constants";
import { useToolTracking } from "@/hooks/useToolTracking";

interface ERPData {
  supported: boolean;
  complexity: "simple" | "moderate" | "complex";
  days: number;
  notes: string;
}

const ERP_DB: Record<string, ERPData> = {
  "Vista Viewpoint": { supported: true, complexity: "simple", days: 5, notes: "Native bidirectional integration. Full AR data sync including job costing and AIA billing." },
  "Foundation Software": { supported: true, complexity: "simple", days: 7, notes: "Native integration with construction-specific AR workflows." },
  "Epicor Prophet 21": { supported: true, complexity: "simple", days: 7, notes: "Native integration with distribution-specific features." },
  "Command Alkon": { supported: true, complexity: "moderate", days: 10, notes: "Integration available for ready-mix and aggregates billing workflows." },
  "Sage Intacct": { supported: true, complexity: "simple", days: 5, notes: "Native cloud-to-cloud integration. Fastest setup time." },
  "Sage 100": { supported: true, complexity: "moderate", days: 10, notes: "Integration via Sage 100 API. Supports on-premise and hosted." },
  "Sage 300": { supported: true, complexity: "moderate", days: 10, notes: "Integration via Sage 300 API." },
  "NetSuite": { supported: true, complexity: "simple", days: 5, notes: "Native SuiteApp integration. Real-time bidirectional sync." },
  "QuickBooks Enterprise": { supported: true, complexity: "simple", days: 3, notes: "Quick setup via QuickBooks API. Ideal for smaller operations." },
  "Acumatica": { supported: true, complexity: "simple", days: 5, notes: "Native cloud integration with full AR module sync." },
  "Microsoft Dynamics 365": { supported: true, complexity: "moderate", days: 10, notes: "Integration via Dynamics API. Supports Business Central and Finance." },
  "Microsoft Dynamics GP": { supported: true, complexity: "moderate", days: 12, notes: "Integration available for GP environments." },
  "SYSPRO": { supported: true, complexity: "moderate", days: 10, notes: "Integration via SYSPRO API for manufacturing and distribution." },
  "SAP Business One": { supported: true, complexity: "moderate", days: 12, notes: "Integration via SAP B1 Service Layer API." },
};

const ERP_NAMES = Object.keys(ERP_DB);

const INTEGRATION_FEATURES = [
  "Bidirectional AR data sync",
  "Automated invoice import",
  "Payment posting & reconciliation",
  "Customer data sync",
  "Real-time balance updates",
];

export default function ERPReadiness() {
  const { markStarted, reportProgress } = useToolTracking("erp_readiness");
  const { save } = useResults();
  const [erp, setERP] = useState("");
  const [otherERP, setOtherERP] = useState("");
  const [version, setVersion] = useState("");
  const [hosting, setHosting] = useState("Cloud");
  const [automationLevel, setAutomationLevel] = useState("None");
  const [exportMethod, setExportMethod] = useState("CSV/Excel export");
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedERP = erp === "Other" ? otherERP : erp;
  const erpData = ERP_DB[erp] || null;

  const complexityScore = erpData
    ? erpData.complexity === "simple" ? 100 : erpData.complexity === "moderate" ? 85 : 70
    : 40;

  const handleSubmit = () => {
    save("erp-readiness", {
      erp: selectedERP, version, hosting, automationLevel, exportMethod,
      supported: !!erpData,
      complexityScore,
      headline: erpData ? `${selectedERP}: Compatible (${erpData.days} days)` : `${selectedERP || "Other"}: Assessment needed`,
    });
    setSaved(true);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6" data-testid="page-erp-results" onChangeCapture={() => markStarted()} onClickCapture={() => markStarted()}>
        <h1 className="text-xl font-bold tracking-tight">ERP Readiness Results</h1>

        <Card className="p-6 text-center space-y-4">
          {erpData ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-lg font-bold">
                Payra has a native integration with {selectedERP}
              </h2>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Badge variant="default">Compatibility: {complexityScore}%</Badge>
                <Badge variant="secondary">
                  {erpData.complexity.charAt(0).toUpperCase() + erpData.complexity.slice(1)} Setup
                </Badge>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h2 className="text-lg font-bold">
                We're expanding our integration library
              </h2>
              <p className="text-sm text-muted-foreground">
                Let us assess your specific ERP to determine compatibility and timeline.
              </p>
            </>
          )}
        </Card>

        {erpData && (
          <>
            <Card className="premium-card p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Setup Timeline</p>
                  <p className="text-lg font-bold">{erpData.days} business days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Complexity</p>
                  <p className="text-lg font-bold capitalize">{erpData.complexity}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{erpData.notes}</p>
            </Card>

            <Card className="premium-card p-6 space-y-3">
              <h3 className="font-semibold text-sm">What the Integration Includes</h3>
              <ul className="space-y-2">
                {INTEGRATION_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <BridgeToPayra
          heading={erpData ? `Go Live with ${selectedERP} in ${erpData.days} Days` : "Let's Discuss Your ERP"}
          body={erpData
            ? `With ${selectedERP}, you'll be fully integrated in ${erpData.days} business days — with bidirectional sync, automated reconciliation, and zero manual re-keying. Schedule a demo to see the integration in action.`
            : "We're actively adding new integrations. Let's discuss your specific ERP and build a custom integration plan."
          }
          stat={erpData ? `${erpData.days} days` : undefined}
          statLabel={erpData ? "to full integration" : undefined}
          ctaText={erpData ? "Schedule an Integration Demo" : "Schedule a Call About Your ERP"}
          utmContent={erpData ? `erp-${selectedERP.toLowerCase().replace(/\s+/g, "-")}` : "erp-other"}
        />

        <div className="flex justify-between gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowResults(false)}>Edit Inputs</Button>
          {!saved && <Button size="sm" onClick={handleSubmit}>Save Results</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6" data-testid="page-erp">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">ERP Readiness Check</h1>
        <p className="text-sm text-muted-foreground">
          Check Payra's compatibility with your ERP system and see estimated setup time.
        </p>
      </div>

      <Card className="premium-card p-6 space-y-5">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Which ERP do you use?</Label>
          <Select value={erp} onValueChange={setERP}>
            <SelectTrigger data-testid="select-erp"><SelectValue placeholder="Select your ERP" /></SelectTrigger>
            <SelectContent>
              {ERP_NAMES.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {erp === "Other" && (
            <Input placeholder="Enter your ERP name" value={otherERP} onChange={(e) => setOtherERP(e.target.value)} className="mt-2 text-sm" data-testid="input-other-erp" />
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Current version (optional)</Label>
          <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g., 2024.1" className="text-sm" data-testid="input-version" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Hosting model</Label>
          <RadioGroup value={hosting} onValueChange={setHosting} className="flex gap-4">
            {["Cloud", "On-Premise", "Hybrid"].map((opt) => (
              <div key={opt} className="flex items-center gap-1.5">
                <RadioGroupItem value={opt} id={`host-${opt}`} />
                <Label htmlFor={`host-${opt}`} className="text-sm">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Current AR automation level in your ERP</Label>
          <RadioGroup value={automationLevel} onValueChange={setAutomationLevel}>
            {["None", "Basic (invoicing only)", "Moderate (invoicing + basic reporting)", "Advanced (full AR suite)"].map((opt) => (
              <div key={opt} className="flex items-center gap-1.5">
                <RadioGroupItem value={opt} id={`auto-${opt}`} />
                <Label htmlFor={`auto-${opt}`} className="text-sm">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">How do you currently export data?</Label>
          <RadioGroup value={exportMethod} onValueChange={setExportMethod}>
            {["API", "CSV/Excel export", "Manual", "No export"].map((opt) => (
              <div key={opt} className="flex items-center gap-1.5">
                <RadioGroupItem value={opt} id={`export-${opt}`} />
                <Label htmlFor={`export-${opt}`} className="text-sm">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={!erp || (erp === "Other" && !otherERP)}>
          Check Compatibility <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
