"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

type TablePaginationProps = {
  page: number;
  total: number;
  limit?: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  page,
  total,
  limit = DEFAULT_PAGE_SIZE,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{total}</span> entries
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-9 gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-600 min-w-[100px] text-center">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-9 gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
