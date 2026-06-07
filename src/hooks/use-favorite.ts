"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";

// ============================================================
// useFavorite Hook - uses localStorage for all users
// ============================================================

export function useFavorite(toolId: string): [boolean, () => void] {
  const [on, setOn] = useState(false);

  // Load initial state
  useEffect(() => {
    let mounted = true;
    try {
      const raw = localStorage.getItem("aid-hub_favorites") || "[]";
      const data: string[] = JSON.parse(raw);
      if (mounted) setOn(data.includes(toolId));
    } catch {
      // Ignore
    }
    return () => { mounted = false; };
  }, [toolId]);

  // Toggle favorite
  const toggle = useCallback(() => {
    try {
      const raw = localStorage.getItem("aid-hub_favorites") || "[]";
      const data: string[] = JSON.parse(raw);
      const isCurrentlyFavorited = data.includes(toolId);
      const next = isCurrentlyFavorited
        ? data.filter((id) => id !== toolId)
        : [...data, toolId];
      localStorage.setItem("aid-hub_favorites", JSON.stringify(next));
      setOn(!isCurrentlyFavorited);
    } catch {}
  }, [toolId]);

  return [on, toggle];
}

// ============================================================
// useFavorites Hook (returns all favorite tool IDs)
// ============================================================

export function useFavorites(): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    try {
      const raw = localStorage.getItem("aid-hub_favorites") || "[]";
      const data: string[] = JSON.parse(raw);
      if (mounted) setIds(data);
    } catch {
      // Ignore
    }
    return () => { mounted = false; };
  }, []);

  return ids;
}
