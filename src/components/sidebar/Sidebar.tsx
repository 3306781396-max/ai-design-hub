"use client";

import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export function Sidebar({ children, className = "" }: SidebarProps) {
  return (
    <aside className={`space-y-5 ${className}`}>
      {children}
    </aside>
  );
}

export function SidebarSection({ children }: { children: ReactNode }) {
  return <div className="border-t border-dark-700/50 pt-5 first:border-t-0 first:pt-0">{children}</div>;
}
