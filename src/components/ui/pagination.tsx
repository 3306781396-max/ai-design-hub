"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

import Link from "next/link";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  siblingCount?: number;
}

function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "dots")[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "dots", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, "dots", ...rightRange];
  }

  return [1, "dots", ...Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i), "dots", totalPages];
}

function PaginationButton({
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      {...props}
    />
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  const pages = generatePaginationRange(currentPage, totalPages, siblingCount);

  if (baseUrl) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return (
      <nav
        role="navigation"
        aria-label="Pagination"
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <Link
          href={currentPage > 1 ? `${baseUrl}${separator}page=${currentPage - 1}` : "#"}
          className={cn(
            "inline-flex items-center justify-center rounded-md h-9 w-9 border border-dark-700 text-sm",
            currentPage <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-dark-800"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {pages.map((page, index) =>
          page === "dots" ? (
            <span
              key={`dots-${index}`}
              className="flex h-9 w-9 items-center justify-center text-dark-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Link
              key={page}
              href={`${baseUrl}${separator}page=${page}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md h-9 w-9 text-sm",
                page === currentPage
                  ? "bg-primary-500 text-white"
                  : "border border-dark-700 hover:bg-dark-800"
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}

        <Link
          href={currentPage < totalPages ? `${baseUrl}${separator}page=${currentPage + 1}` : "#"}
          className={cn(
            "inline-flex items-center justify-center rounded-md h-9 w-9 border border-dark-700 text-sm",
            currentPage >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-dark-800"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </nav>
    );
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <PaginationButton
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      {pages.map((page, index) =>
        page === "dots" ? (
          <span
            key={`dots-${index}`}
            className="flex h-9 w-9 items-center justify-center text-dark-500"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <PaginationButton
            key={page}
            onClick={() => onPageChange?.(page)}
            variant={page === currentPage ? "default" : "outline"}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PaginationButton>
        )
      )}

      <PaginationButton
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
}

export { Pagination };
