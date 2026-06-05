"use client";

import { useState, useEffect } from "react";

export function useFavorite(toolId: string): [boolean, () => void] {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("aid-hub_favorites") || "[]") as string[];
      setOn(data.includes(toolId));
    } catch {}
  }, [toolId]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem("aid-hub_favorites") || "[]";
      const data: string[] = JSON.parse(raw);
      const next = data.includes(toolId)
        ? data.filter((id) => id !== toolId)
        : [...data, toolId];
      localStorage.setItem("aid-hub_favorites", JSON.stringify(next));
      setOn(!on);
    } catch {}
  };

  return [on, toggle];
}

export function useFavorites(): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("aid-hub_favorites") || "[]") as string[];
      setIds(data);
    } catch {}
  }, []);

  return ids;
}
