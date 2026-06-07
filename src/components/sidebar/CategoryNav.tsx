"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";

interface CategoryNavProps {
  categories: { name: string; count: number; slug: string }[];
  basePath?: string;
}

export function CategoryNav({ categories, basePath = "/blog" }: CategoryNavProps) {
  return (
    <Card className="border-dark-700 bg-dark-800/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-accent-400" />
          Categories
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-dark-700/30">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`${basePath}?category=${cat.slug}`}
                className="flex items-center justify-between text-sm text-dark-300 hover:text-primary-400 transition-colors py-2.5"
              >
                <span>{cat.name}</span>
                <Badge variant="secondary" className="text-[11px] ml-2 tabular-nums">
                  {cat.count}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
