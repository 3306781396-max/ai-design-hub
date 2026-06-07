"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BlogPost } from "@/types";
import { Clock, ArrowRight } from "lucide-react";

interface RecentPostsProps {
  posts: BlogPost[];
  max?: number;
}

export function RecentPosts({ posts, max = 5 }: RecentPostsProps) {
  const pathname = usePathname();
  const recent = posts.slice(0, max);

  return (
    <Card className="border-dark-700 bg-dark-800/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-400" />
          Recent Posts
        </h3>
        <Link
          href="/blog/archive"
          className="text-[11px] text-dark-500 hover:text-primary-400 transition-colors flex items-center gap-1"
        >
          All <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-dark-700/50">
          {recent.map((post) => {
            const isActive = pathname === `/blog/${post.slug}`;
            return (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`group block py-2.5 -mx-2 px-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-500/10"
                      : "hover:bg-dark-700/30"
                  }`}
                >
                  <h4
                    className={`text-sm leading-snug transition-colors line-clamp-2 ${
                      isActive
                        ? "text-primary-400 font-medium"
                        : "text-dark-200 group-hover:text-primary-400"
                    }`}
                  >
                    {post.title}
                  </h4>
                  <p className="text-xs text-dark-500 mt-1.5">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
