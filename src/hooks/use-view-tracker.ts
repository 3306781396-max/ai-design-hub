"use client";

import { useEffect, useState } from "react";

const VIEW_KEY = "ai_design_hub_views";
const SESSION_KEY = "ai_design_hub_viewed_session";

/**
 * Track tool page views using localStorage.
 * - Increments view count once per session per tool (sessionStorage based dedup)
 * - Returns the current total view count for display
 */
export function useViewTracker(toolSlug: string, initialClicks: number): number {
  const [displayClicks, setDisplayClicks] = useState(initialClicks);

  useEffect(() => {
    if (!toolSlug) return;

    // Check if already viewed in this session
    const viewedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
    if (viewedSession.includes(toolSlug)) {
      // Already counted this session, just read the stored count
      const allViews = JSON.parse(localStorage.getItem(VIEW_KEY) || "{}");
      const stored = allViews[toolSlug];
      if (stored !== undefined) {
        setDisplayClicks(initialClicks + stored);
      }
      return;
    }

    // Mark as viewed in this session
    viewedSession.push(toolSlug);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(viewedSession));

    // Increment count in localStorage
    const allViews = JSON.parse(localStorage.getItem(VIEW_KEY) || "{}");
    if (!allViews[toolSlug]) {
      allViews[toolSlug] = 0;
    }
    allViews[toolSlug] += 1;
    localStorage.setItem(VIEW_KEY, JSON.stringify(allViews));

    const newTotal = initialClicks + allViews[toolSlug];
    setDisplayClicks(newTotal);
  }, [toolSlug, initialClicks]);

  return displayClicks;
}

/**
 * Get view count for a tool (for sorting etc.)
 */
export function getViewCount(toolSlug: string, initialClicks: number): number {
  if (typeof window === "undefined") return initialClicks;
  const allViews = JSON.parse(localStorage.getItem(VIEW_KEY) || "{}");
  const stored = allViews[toolSlug] || 0;
  return initialClicks + stored;
}

/**
 * Get all view counts (for use in tool lists / sorting)
 */
export function getAllViewCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(VIEW_KEY) || "{}");
}
