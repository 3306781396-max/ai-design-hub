"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface MockComment {
  id: string;
  author: string;
  content: string;
  postSlug: string;
  postTitle: string;
  date: string;
}

const MOCK_COMMENTS: MockComment[] = [
  {
    id: "1",
    author: "David Wang",
    content: "Great comparison! I've been using Midjourney for months and this really helped clarify the differences.",
    postSlug: "midjourney-vs-dalle-vs-stable-diffusion-2025",
    postTitle: "Midjourney vs DALL-E 3 vs Stable Diffusion 3: Ultimate 2025 Comparison",
    date: "2025-07-15T08:30:00.000Z",
  },
  {
    id: "2",
    author: "Lisa Zhang",
    content: "The UI design tools section is incredibly useful. Would love to see a deeper dive into Figma AI plugins.",
    postSlug: "top-ai-ui-design-tools-2025",
    postTitle: "Top 10 AI UI/UX Design Tools in 2025: Revolutionize Your Workflow",
    date: "2025-07-14T14:20:00.000Z",
  },
  {
    id: "3",
    author: "Mike Chen",
    content: "Finally a clear explanation of how Runway Gen-3 works. The examples are super helpful!",
    postSlug: "runway-gen3-complete-guide",
    postTitle: "Runway Gen-3 Complete Guide: Features, Tips, and Creative Use Cases",
    date: "2025-07-13T11:45:00.000Z",
  },
  {
    id: "4",
    author: "Anna Liu",
    content: "This guide saved me hours of research. The pricing comparison table is exactly what I needed.",
    postSlug: "best-ai-video-tools-beginners-guide",
    postTitle: "Best AI Video Tools for Beginners: A Comprehensive Guide",
    date: "2025-07-12T16:10:00.000Z",
  },
  {
    id: "5",
    author: "Tom Wilson",
    content: "I switched to Galileo AI after reading this. The workflow improvements are incredible!",
    postSlug: "ai-design-workflow-automation-2025",
    postTitle: "How to Automate Your Design Workflow with AI in 2025",
    date: "2025-07-11T09:00:00.000Z",
  },
];

const AVATAR_COLORS = [
  "from-primary-500 to-purple-500",
  "from-accent-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500",
];

function Avatar({ name, idx }: { name: string; idx: number }) {
  const gradient = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div
      className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-[11px] font-semibold`}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function RecentComments() {
  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <Card className="border-dark-700 bg-dark-800/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-emerald-400" />
          Recent Comments
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-dark-700/50">
          {MOCK_COMMENTS.map((comment, idx) => (
            <li key={comment.id} className="py-3 first:pt-0 last:pb-0">
              <Link href={`/blog/${comment.postSlug}`} className="group block">
                <div className="flex items-start gap-2.5">
                  <Avatar name={comment.author} idx={idx} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-dark-200 group-hover:text-white transition-colors">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-dark-600">&middot;</span>
                      <span className="text-[10px] text-dark-500">
                        {formatRelativeTime(comment.date)}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 line-clamp-2 mt-1 group-hover:text-dark-300 transition-colors">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
