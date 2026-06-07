"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash } from "lucide-react";

interface TagCloudProps {
  tags: (string | { name: string; count: number })[];
  max?: number;
}

export function TagCloud({ tags, max = 25 }: TagCloudProps) {
  // Normalize tags to { name, count } format
  const normalized = useMemo(() => {
    return tags
      .map((t) => (typeof t === "string" ? { name: t, count: 1 } : t))
      .sort((a, b) => b.count - a.count)
      .slice(0, max);
  }, [tags, max]);

  // Determine max count for relative sizing
  const maxCount = useMemo(
    () => Math.max(...normalized.map((t) => t.count), 1),
    [normalized]
  );

  const getWeightClass = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-sm font-medium";
    if (ratio > 0.5) return "text-sm";
    if (ratio > 0.3) return "text-xs";
    return "text-[11px]";
  };

  return (
    <Card className="border-dark-700 bg-dark-800/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Hash className="h-4 w-4 text-amber-400" />
          Tags
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          {normalized.map((tag) => (
            <Link key={tag.name} href={`/blog?tag=${encodeURIComponent(tag.name)}`}>
              <Badge
                variant="outline"
                className={`cursor-pointer transition-colors hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 whitespace-nowrap ${getWeightClass(tag.count)}`}
              >
                {tag.name}
                {tag.count > 1 && (
                  <span className="ml-1 text-dark-500">×{tag.count}</span>
                )}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
