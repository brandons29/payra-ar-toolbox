// In-memory store for tool results (no localStorage due to iframe sandbox)
// This will be replaced by Supabase when connected

import { useSyncExternalStore, useCallback } from "react";
import { trackToolComplete, trackLeadGenerated, type ToolName } from "@/lib/analytics";

/** Map tool slug IDs to analytics-friendly names */
const TOOL_ID_TO_NAME: Record<string, ToolName> = {
  "health-scorecard": "health_scorecard",
  "dso-calculator": "dso_calculator",
  "aging-analyzer": "aging_analyzer",
  "cei-calculator": "cei_calculator",
  "timeline-mapper": "timeline_mapper",
  "cost-calculator": "cost_calculator",
  "erp-readiness": "erp_readiness",
};

export interface StoredResult {
  toolId: string;
  data: Record<string, unknown>;
  completedAt: Date;
}

class ResultsStore {
  private results: Map<string, StoredResult> = new Map();
  private listeners: Set<() => void> = new Set();
  private snapshot: StoredResult[] = [];
  private version = 0;

  save(toolId: string, data: Record<string, unknown>) {
    this.results.set(toolId, { toolId, data, completedAt: new Date() });
    this.snapshot = Array.from(this.results.values());
    this.version++;
    this.notify();

    // Fire analytics events
    const toolName = TOOL_ID_TO_NAME[toolId];
    if (toolName) {
      trackToolComplete(toolName, {
        tools_completed: this.results.size,
        // Include key result metrics for audience building
        ...(data.overallScore != null && { overall_score: data.overallScore }),
        ...(data.headline && { result_headline: data.headline }),
      });
      trackLeadGenerated(toolName);
    }
  }

  get(toolId: string): StoredResult | undefined {
    return this.results.get(toolId);
  }

  getAll(): StoredResult[] {
    return this.snapshot;
  }

  isCompleted(toolId: string): boolean {
    return this.results.has(toolId);
  }

  getCompletedCount(): number {
    return this.results.size;
  }

  getOverallScore(): number | null {
    const scorecard = this.results.get("health-scorecard");
    if (!scorecard) return null;
    return scorecard.data.overallScore as number;
  }

  getVersion(): number {
    return this.version;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const resultsStore = new ResultsStore();

export function useResults() {
  const version = useSyncExternalStore(
    (cb) => resultsStore.subscribe(cb),
    () => resultsStore.getVersion()
  );

  // These are stable reads keyed to the version
  const results = resultsStore.getAll();
  const completedCount = resultsStore.getCompletedCount();
  const overallScore = resultsStore.getOverallScore();

  const save = useCallback((toolId: string, data: Record<string, unknown>) => {
    resultsStore.save(toolId, data);
  }, []);

  const get = useCallback((toolId: string) => {
    return resultsStore.get(toolId);
  }, [version]);

  const isCompleted = useCallback((toolId: string) => {
    return resultsStore.isCompleted(toolId);
  }, [version]);

  return { results, save, get, isCompleted, completedCount, overallScore };
}
