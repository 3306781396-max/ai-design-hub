"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import type { Tool, Category } from "@/types";

const PER_PAGE = 12;

interface Props {
  allTools: Tool[];
  allCategories: Category[];
}

export function ToolsFilteredGrid({ allTools, allCategories }: Props) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sort, setSort] = useState<"rating" | "newest" | "clicks">("rating");
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize fuse for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(allTools, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "description", weight: 0.2 },
        { name: "tags", weight: 0.3 },
      ],
      threshold: 0.4,
      includeMatches: true,
    });
  }, [allTools]);

  // Get search suggestions (top 5 matches)
  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const results = fuse.search(search, { limit: 5 });
    return results.map((r) => r.item);
  }, [search, fuse]);

  // Filter tools
  const filtered = useMemo(() => {
    let result = [...allTools];

    // Use fuse.js for fuzzy search if search query exists
    if (search) {
      const fuseResults = fuse.search(search);
      result = fuseResults.map((r) => r.item);
    }

    // Category filter
    if (category) {
      result = result.filter((t) => t.category_slug === category);
    }

    // Price filter
    if (priceFilter) {
      result = result.filter((t) => t.pricing === priceFilter);
    }

    // Sort
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") result.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "clicks") result.sort((a, b) => b.clicks - a.clicks);

    return result;
  }, [allTools, search, category, sort, fuse]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, sort, priceFilter]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools";
    window.history.replaceState(null, "", newUrl);
  }, [search, searchParams]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (toolSlug: string) => {
    setShowSuggestions(false);
    router.push(`/tool/${toolSlug}`);
  };

  const sortOptions = [
    { value: "rating" as const, label: t("common.highest_rated") },
    { value: "newest" as const, label: t("common.newest") },
    { value: "clicks" as const, label: t("common.most_popular") },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        <div className="sticky top-24 space-y-6">
          {/* Search Input with Suggestions */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t("tools.search_placeholder")}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => search.length >= 2 && setShowSuggestions(true)}
              className="w-full px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 dark:text-white text-gray-900 placeholder-dark-500 focus:outline-none focus:border-primary-500"
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-dark-900 border border-dark-800 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                {suggestions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSuggestionClick(tool.slug)}
                    className="w-full text-left px-4 py-2 hover:bg-dark-800 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-sm font-bold text-primary-400 shrink-0">
                      {tool.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {tool.name}
                      </div>
                      <div className="text-xs text-dark-400 truncate">
                        {tool.tags.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-4 py-2 text-xs text-dark-500 border-t border-dark-800">
                  {t("tools.search_results_for")} &quot;{search}&quot; →{" "}
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    {t("tools.see_all_results")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="dark:text-white text-gray-900 font-semibold mb-3">
              {t("tools.sidebar.categories")}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !category
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-dark-300 hover:bg-dark-800"
                }`}
              >
                {t("tools.sidebar.all_tools")}
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setCategory(cat.slug);
                    setPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    category === cat.slug
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-dark-300 hover:bg-dark-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="dark:text-white text-gray-900 font-semibold mb-3">
              {t("common.pricing")}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setPriceFilter("")}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !priceFilter
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-dark-300 hover:bg-dark-800"
                }`}
              >
                {t("common.all")}
              </button>
              {(["Free", "Freemium", "Free Trial", "Paid"] as const).map((pricing) => (
                <button
                  key={pricing}
                  onClick={() => setPriceFilter(pricing)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    priceFilter === pricing
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-dark-300 hover:bg-dark-800"
                  }`}
                >
                  {t(`common.${pricing.toLowerCase().replace(" ", "_")}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="dark:text-white text-gray-900 font-semibold mb-3">
              {t("tools.sidebar.sort_by")}
            </h3>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value);
                    setPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sort === opt.value
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-dark-300 hover:bg-dark-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {/* Results count */}
        <div className="mb-6 text-sm text-dark-400">
          {total} {t("tools.results_found")}
        </div>

        {paged.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">{t("tools.empty")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((tool) => (
                <Link key={tool.id} href={`/tool/${tool.slug}`}>
                  <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-all h-full card-hover">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-xl font-bold text-primary-400 shrink-0">
                          {tool.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold dark:text-white text-gray-900 truncate">
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-amber-400 text-sm">★</span>
                            <span className="text-sm dark:text-white text-gray-900">
                              {tool.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {tool.pricing}
                        </Badge>
                      </div>
                      <p className="text-sm text-dark-400 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
