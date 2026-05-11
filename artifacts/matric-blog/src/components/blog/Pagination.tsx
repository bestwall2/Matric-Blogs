import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-10" data-testid="pagination">
      <Button
        size="icon"
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="border-border"
        data-testid="button-page-prev"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
        ) : (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p as number)}
            className={cn("w-9", p === page && "bg-primary hover:bg-primary/90 border-primary")}
            data-testid={`button-page-${p}`}
          >
            {p}
          </Button>
        )
      )}
      <Button
        size="icon"
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="border-border"
        data-testid="button-page-next"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    </div>
  );
}
