import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

/**
 * Sends a virtual_pageview to GTM/dataLayer on every SPA route change.
 * Place once in the top-level layout (App.tsx).
 */
export function usePageTracking() {
  const [location] = useLocation();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double-firing on the same path
    if (location === prevLocation.current) return;
    prevLocation.current = location;

    // Build a readable title from the path
    const title = pathToTitle(location);
    trackPageView(location, title);
  }, [location]);
}

function pathToTitle(path: string): string {
  if (path === "/" || path === "/login") return "Login";
  if (path === "/dashboard") return "Dashboard";
  if (path === "/results") return "Results";
  if (path.startsWith("/tools/")) {
    const toolSlug = path.replace("/tools/", "");
    return (
      "Tool: " +
      toolSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
  }
  return "Payra AR Toolbox";
}
