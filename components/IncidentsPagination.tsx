import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function IncidentsPagination({ page, totalPages }: { page: number; totalPages: number }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page > 1 ? `/incidents?page=${page - 1}` : "#"}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href={`/incidents?page=${pageNum}`}
              isActive={pageNum === page}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={page < totalPages ? `/incidents?page=${page + 1}` : "#"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}