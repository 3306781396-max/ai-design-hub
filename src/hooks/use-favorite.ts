"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";
import { isFavorited, toggleFavorite, getFavorites } from "@/lib/supabase";
import { logError } from "@/lib/logger";

// ============================================================
// useFavorite Hook
// - Logged in: uses Supabase "favorites" table
// - Guest: uses localStorage (backward compatible)
// ============================================================

export function useFavorite(toolId: string): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const { user } = useAuth();

  // Load initial state
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (user) {
          // Logged in: check Supabase
          const favorited = await isFavorited(user.id, toolId);
          if (mounted) setOn(favorited);
        } else {
          // Guest: check localStorage
          const raw = localStorage.getItem("aid-hub_favorites") || "[]";
          const data: string[] = JSON.parse(raw);
          if (mounted) setOn(data.includes(toolId));
        }
      } catch {
        // Ignore errors (e.g., Supabase not initialized)
      }
    }

    load();
    return () => { mounted = false; };
  }, [toolId, user?.id]);

  // Toggle favorite
  const toggle = useCallback(async () => {
    if (user) {
      // Logged in: use Supabase
      try {
        const added = await toggleFavorite(user.id, toolId);
        setOn(added);
      } catch (err) {
        logError("Failed to toggle favorite", err);
      }
    } else {
      // Guest: use localStorage (backward compatible)
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
    }
  }, [toolId, user]);

  return [on, toggle];
}

// ============================================================
// useFavorites Hook (returns all favorite tool IDs)
// ============================================================

export function useFavorites(): string[] {
  const [ids, setIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (user) {
          // Logged in: fetch from Supabase
          const favIds = await getFavorites(user.id);
          if (mounted) setIds(favIds);
        } else {
          // Guest: read from localStorage
          const raw = localStorage.getItem("aid-hub_favorites") || "[]";
          const data: string[] = JSON.parse(raw);
          if (mounted) setIds(data);
        }
      } catch {
        // Ignore errors
      }
    }

    load();
    return () => { mounted = false; };
  }, [user?.id]);

  return ids;
}
