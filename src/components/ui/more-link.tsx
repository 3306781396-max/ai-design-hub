import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes } from "react";

interface MoreLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MoreLink({ href, children, className, ...props }: MoreLinkProps) {
  return (
    <Link
      href={href}
      className={cn("text-primary-400 hover:underline", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
