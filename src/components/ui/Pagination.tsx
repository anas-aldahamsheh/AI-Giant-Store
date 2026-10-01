"use client";

import { Button } from "@/components/ui/Button";

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const canGoBack = page > 1;
  const canGoForward = page < pageCount;

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <Button
        type="button"
        variant="secondary"
        disabled={!canGoBack}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      <Button
        type="button"
        variant="secondary"
        disabled={!canGoForward}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
