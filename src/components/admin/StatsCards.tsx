import type { AdminStats } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: AdminStats;
}

const statItems: { key: keyof AdminStats; label: string; icon: string; color: string; format?: (v: number) => string }[] = [
  {
    key: "total_tools",
    label: "Total Tools",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    color: "from-blue-500 to-cyan-400",
  },
  {
    key: "total_blogs",
    label: "Total Blogs",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    color: "from-violet-500 to-purple-400",
  },
  {
    key: "total_categories",
    label: "Categories",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    color: "from-emerald-500 to-green-400",
  },
  {
    key: "total_clicks",
    label: "Total Clicks",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "from-amber-500 to-yellow-400",
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
  },
  {
    key: "total_views",
    label: "Blog Views",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    color: "from-rose-500 to-pink-400",
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
  },
  {
    key: "seo_score",
    label: "SEO Score",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    color: "from-orange-500 to-red-400",
    format: (v) => `${v}/100`,
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => {
        const raw = stats[item.key] as number;
        const display = item.format ? item.format(raw) : String(raw);
        return (
          <Card
            key={item.key}
            className="border-0 bg-slate-900/80 backdrop-blur overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <svg className="w-4 h-4 dark:text-white text-gray-900" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold dark:text-white text-gray-900">{display}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
