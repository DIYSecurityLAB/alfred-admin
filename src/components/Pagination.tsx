import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  className = '',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  
  // Determinar quais páginas mostrar
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas visíveis antes e depois da página atual
    const range = [];
    const rangeWithDots = [];

    // Sempre inclui a primeira página
    range.push(1);

    // Adiciona páginas próximas à atual
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Sempre inclui a última página
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Adiciona reticências onde necessário
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // -1 representa reticências
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-md hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {getVisiblePages().map((page, index) => (
          page === -1 ? (
            <span key={`dots-${index}`} className="px-3.5 py-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-md hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
