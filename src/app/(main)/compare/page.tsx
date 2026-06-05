"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getToolBySlug, getTools } from "@/lib/supabase";
import type { Tool } from "@/types";
import { Star, Check, X, ArrowRight, Trash2, Plus } from "lucide-react";

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const loadTools = useCallback(async () => {
    setLoading(true);
    const slugs = searchParams.get("tools")?.split(",").filter(Boolean) || [];
    const all = await getTools({ limit: 100 });
    setAllTools(all.tools);

    const loaded = await Promise.all(
      slugs.map((s) => getToolBySlug(s))
    );
    setTools(loaded.filter(Boolean) as Tool[]);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    loadTools();
  }, [loadTools]);

  const removeTool = (slug: string) => {
    const slugs = searchParams.get("tools")?.split(",").filter(Boolean) || [];
    const next = slugs.filter((s) => s !== slug);
    router.push(`/compare?tools=${next.join(",")}`);
  };

  const addTool = (slug: string) => {
    const slugs = searchParams.get("tools")?.split(",").filter(Boolean) || [];
    if (slugs.includes(slug)) return;
    if (slugs.length >= 3) return;
    router.push(`/compare?tools=[...slugs, slug].join(",")}`);
    setShowAddDialog(false);
  };

  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-dark-600"}`}
      />
    ));

  const compareFields = [
    { label: t("compare.fields.rating"), render: (t2: Tool) => <div className="flex items-center gap-1">{renderStars(Math.round(t2.rating))}<span className="text-white ml-1">{t2.rating.toFixed(1)}</span></div> },
    { label: t("compare.fields.pricing"), render: (t2: Tool) => <Badge variant="outline" className="border-dark-600">{t2.pricing}</Badge> },
    { label: t("compare.fields.views"), render: (t2: Tool) => <span className="text-dark-300">{t2.clicks.toLocaleString()}</span> },
    { label: t("compare.fields.tags"), render: (t2: Tool) => <div className="flex flex-wrap gap-1">{t2.tags.slice(0, 4).map(tag => <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-dark-700 text-dark-300">{tag}</span>)}</div> },
    { label: t("compare.fields.pros"), render: (t2: Tool) => <ul className="text-sm text-left space-y-1">{t2.pros?.slice(0, 3).map((p, i) => <li key={i} className="text-green-400 flex items-start gap-1"><Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />{p}</li>)}</ul> },
    { label: t("compare.fields.cons"), render: (t2: Tool) => <ul className="text-sm text-left space-y-1">{t2.cons?.slice(0, 3).map((c, i) => <li key={i} className="text-red-400 flex items-start gap-1"><X className="w-3.5 h-3.5 mt-0.5 shrink-0" />{c}</li>)}</ul> },
    { label: t("compare.fields.features"), render: (t2: Tool) => <div className="text-sm text-dark-300 text-left">{t2.features?.slice(0, 3).join("、")}</div> },
    { label: t("compare.fields.use_cases"), render: (t2: Tool) => <div className="text-sm text-dark-300 text-left">{t2.use_cases?.slice(0, 2).join("、")}</div> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="pt-32 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Link href="/tools" className="text-dark-400 hover:text-white text-sm mb-4 inline-block">
            ← {t("common.back_to_tools")}
          </Link>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t("compare.page_title")}
              </h1>
              <p className="text-dark-400">
                {t("compare.page_subtitle")}
              </p>
            </div>
            {tools.length < 3 && (
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("compare.add_tool")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Compare Table */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {tools.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t("compare.no_tools")}</h2>
              <p className="text-dark-400 mb-6">{t("compare.no_tools_desc")}</p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("compare.select_tools")}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-dark-400 text-sm font-medium pb-4 w-40">{t("compare.fields.feature")}</th>
                    {tools.map((tool) => (
                      <th key={tool.id} className="text-center pb-4 min-w-56">
                        <div className="relative">
                          <button
                            onClick={() => removeTool(tool.slug)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                            aria-label={t("compare.remove_tool", { name: tool.name })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-2xl font-bold text-primary-400 mx-auto mb-3">
                            {tool.name.charAt(0)}
                          </div>
                          <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                          <p className="text-xs text-dark-400 mt-1">{tool.category_name}</p>
                          <Link href={`/tool/${tool.slug}`}>
                            <Button variant="link" className="text-primary-400 p-0 h-auto mt-2">
                              {t("compare.fields.view_details")} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </th>
                    ))}
                    {/* Empty slots */}
                    {Array.from({ length: 3 - tools.length }).map((_, i) => (
                      <th key={i} className="text-center pb-4 min-w-56">
                        <div className="border-2 border-dashed border-dark-700 rounded-2xl p-8 flex flex-col items-center justify-center h-40">
                          <Plus className="w-8 h-8 text-dark-600 mb-2" />
                          <span className="text-dark-500 text-sm">{t("compare.add_tool_placeholder")}</span>
                          <Button
                            onClick={() => setShowAddDialog(true)}
                            variant="ghost"
                            className="mt-2 text-dark-400 hover:text-white"
                          >
                            {t("compare.select")}
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => (
                    <tr key={field.label} className="border-t border-dark-800">
                      <td className="py-4 text-sm font-medium text-dark-300 pr-4 align-top pt-4">
                        {field.label}
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.id} className="py-4 px-4 align-top">
                          {field.render(tool)}
                        </td>
                      ))}
                      {Array.from({ length: 3 - tools.length }).map((_, i) => (
                        <td key={i} className="py-4 px-4" />
                      ))}
                    </tr>
                  ))}
                  {/* CTA Row */}
                  <tr className="border-t border-dark-800">
                    <td className="py-4 pr-4" />
                    {tools.map((tool) => (
                      <td key={tool.id} className="py-4 px-4 text-center">
                        <Button
                          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
                          asChild
                        >
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                            {t("compare.fields.visit_website")}
                          </a>
                        </Button>
                      </td>
                    ))}
                    {Array.from({ length: 3 - tools.length }).map((_, i) => (
                      <td key={i} className="py-4 px-4" />
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add Tool Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddDialog(false)} />
          <Card className="relative bg-dark-900 border-dark-700 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-xl font-bold text-white">{t("compare.select_dialog_title")}</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allTools
                  .filter((t: Tool) => !tools.some((tt) => tt.id === t.id))
                  .map((tool: Tool) => (
                    <button
                      key={tool.id}
                      onClick={() => addTool(tool.slug)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-sm font-bold text-primary-400">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{tool.name}</div>
                        <div className="text-xs text-dark-400">{tool.category_name}</div>
                      </div>
                      <Badge variant="outline" className="border-dark-600 text-xs">
                        {tool.pricing}
                      </Badge>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
