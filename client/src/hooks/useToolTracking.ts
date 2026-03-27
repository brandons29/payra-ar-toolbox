import { useEffect, useRef } from "react";
import { trackToolView, trackToolStart, trackToolProgress, type ToolName } from "@/lib/analytics";

/**
 * Hook for tool pages — fires tool_view on mount and tool_start on first interaction.
 * Also exposes reportProgress() for milestone tracking.
 *
 * Usage:
 *   const { reportProgress } = useToolTracking("dso_calculator");
 */
export function useToolTracking(tool: ToolName) {
  const startFired = useRef(false);

  // Fire tool_view once on mount
  useEffect(() => {
    trackToolView(tool);
    startFired.current = false; // reset if tool changes
  }, [tool]);

  /** Call this when user first interacts (types, clicks, selects) */
  const markStarted = () => {
    if (!startFired.current) {
      startFired.current = true;
      trackToolStart(tool);
    }
  };

  /** Call on milestones (25, 50, 75, 100) */
  const reportProgress = (pct: number) => {
    markStarted(); // ensure start is tracked
    trackToolProgress(tool, pct);
  };

  return { markStarted, reportProgress };
}
