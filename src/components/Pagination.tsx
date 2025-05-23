import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  totalPages?: number;
  totalItems?: number;
  perPage?: number;
}

export function Pagination({
  currentPage,
  onPageChange,
  siblingCount = 1,
  totalPages: propsTotalPages,
  totalItems,
  perPage,
}: PaginationProps) {
  const totalPages =
    propsTotalPages ||
    (totalItems && perPage ? Math.ceil(totalItems / perPage) : 1);

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const createPaginationItems = () => {
    if (totalPages <= 7 + 2 * siblingCount) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return range(1, totalPages);
  };

  const paginationItems = createPaginationItems();

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 transition-colors"
        aria-label="Primeira página"
      >
        <ChevronsLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {paginationItems?.map((item, index) => {
        if (item === '...') {
          return (
            <span key={`dots-${index}`} className="px-3 py-1 text-gray-600">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            onClick={() => onPageChange(+item)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              currentPage === item
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 transition-colors"
        aria-label="Última página"
      >
        <ChevronsRight className="h-5 w-5" />
      </button>
    </div>
  );
}
