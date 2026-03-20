/**
 * Analytics utility for Payra AR Toolbox
 * Pushes events to GTM dataLayer for GA4 and Google Ads tracking.
 *
 * Event naming follows GA4 conventions (snake_case).
 * All events are prefixed with context so they're easy to filter in GA4.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/** Ensure dataLayer exists */
function getDataLayer(): Record<string, unknown>[] {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/** Push a raw event to the dataLayer */
export function pushEvent(
  eventName: string,
  params: Record<string, unknown> = {},
) {
  getDataLayer().push({ event: eventName, ...params });
}

// ─── Virtual Pageviews (SPA) ───────────────────────────────────────────

/** Push a virtual pageview — call on every route change */
export function trackPageView(path: string, title?: string) {
  pushEvent("virtual_pageview", {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

// ─── Auth Events ───────────────────────────────────────────────────────

export function trackLogin(method: "google" | "microsoft" | "email") {
  pushEvent("login", { method });
}

export function trackSignUp(method: "google" | "microsoft" | "email") {
  pushEvent("sign_up", { method });
}

// ─── Tool Events ───────────────────────────────────────────────────────

export type ToolName =
  | "health_scorecard"
  | "dso_calculator"
  | "aging_analyzer"
  | "cei_calculator"
  | "timeline_mapper"
  | "cost_calculator"
  | "erp_readiness";

/** User opens / lands on a tool page */
export function trackToolView(tool: ToolName) {
  pushEvent("tool_view", { tool_name: tool });
}

/** User starts interacting (first input or click inside a tool) */
export function trackToolStart(tool: ToolName) {
  pushEvent("tool_start", { tool_name: tool });
}

/**
 * User completes a tool (submits / sees results).
 * Pass key metrics so we can build audiences in GA4.
 */
export function trackToolComplete(
  tool: ToolName,
  results?: Record<string, unknown>,
) {
  pushEvent("tool_complete", { tool_name: tool, ...results });
}

/** User downloads or shares a tool result (PDF, etc.) */
export function trackToolDownload(tool: ToolName, format: string = "pdf") {
  pushEvent("tool_download", { tool_name: tool, format });
}

// ─── CTA / Conversion Events ──────────────────────────────────────────

/** User clicks the "Schedule a Demo" or any Bridge-to-Payra CTA */
export function trackDemoClick(
  source: string,
  utmContent?: string,
) {
  pushEvent("demo_cta_click", {
    cta_source: source,
    utm_content: utmContent,
  });
}

/** 
 * Lead generated — fires when a user completes a tool AND 
 * we have their email from auth. Maps to the existing GTM 
 * "lead_generated" event tag.
 */
export function trackLeadGenerated(tool: ToolName, email?: string) {
  pushEvent("lead_generated", {
    tool_name: tool,
    // Don't push PII to dataLayer — just a flag
    has_email: !!email,
  });
}

// ─── Navigation Events ─────────────────────────────────────────────────

/** User navigates between tools via sidebar or dashboard */
export function trackNavigation(from: string, to: string) {
  pushEvent("navigation", { nav_from: from, nav_to: to });
}
