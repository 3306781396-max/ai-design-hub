"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Calendar, ChevronsUpDown } from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogArchiveClientProps {
  archive: Record<string, Record<string, BlogPost[]>>;
  sortedYears: string[];
  monthOrder: string[];
}

export function BlogArchiveClient({
  archive,
  sortedYears,
  monthOrder,
}: BlogArchiveClientProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(
    new Set(sortedYears.slice(0, 2))
  );

  const allExpanded = expandedYears.size === sortedYears.length;

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedYears(new Set());
    } else {
      setExpandedYears(new Set(sortedYears));
    }
  };

  const totalPosts = useMemo(
    () => sortedYears.reduce((sum, y) => sum + Object.values(archive[y]).flat().length, 0),
    [archive, sortedYears]
  );

  // Sort months within each year descending (newest first)
  const sortMonthsDesc = (a: string, b: string) => {
    return monthOrder.indexOf(b) - monthOrder.indexOf(a);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-dark-400">
          {totalPosts} {totalPosts === 1 ? "article" : "articles"} across {sortedYears.length} {sortedYears.length === 1 ? "year" : "years"}
        </p>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary-400 transition-colors"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {sortedYears.map((year) => {
        const isExpanded = expandedYears.has(year);
        const months = Object.keys(archive[year]).sort(sortMonthsDesc);
        const yearCount = Object.values(archive[year]).flat().length;

        return (
          <div key={year} className="border border-dark-700 rounded-xl bg-dark-800/50 overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary-500/5">
            {/* Year header */}
            <button
              onClick={() => toggleYear(year)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">{year}</span>
                <Badge variant="secondary" className="text-xs tabular-nums">
                  {yearCount} {yearCount === 1 ? "post" : "posts"}
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-dark-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-dark-400" />
              )}
            </button>

            {/* Months list */}
            {isExpanded && (
              <div className="border-t border-dark-700 animate-in fade-in slide-in-from-top-2 duration-200">
                {months.map((month) => {
                  const monthPosts = archive[year][month];
                  return (
                    <div key={month} className="border-b border-dark-700/50 last:border-b-0">
                      <div className="px-5 py-2 bg-dark-800/30">
                        <span className="text-sm font-medium text-dark-300">
                          {month}
                        </span>
                        <span className="ml-2 text-xs text-dark-500 tabular-nums">
                          ({monthPosts.length})
                        </span>
                      </div>
                      <ul className="divide-y divide-dark-700/30">
                        {monthPosts.map((post) => (
                          <li key={post.id}>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="flex items-center gap-3 px-5 py-2.5 hover:bg-dark-700/30 transition-colors group"
                            >
                              <Calendar className="h-3.5 w-3.5 text-dark-500 shrink-0" />
                              <span className="text-sm text-dark-200 group-hover:text-primary-400 transition-colors line-clamp-1">
                                {post.title}
                              </span>
                              {post.featured && (
                                <Badge variant="premium" className="text-[10px] shrink-0 ml-auto">
                                  Featured
                                </Badge>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {sortedYears.length === 0 && (
        <div className="text-center py-16 text-dark-400">
          No posts found.
        </div>
      )}
    </div>
  );
}
