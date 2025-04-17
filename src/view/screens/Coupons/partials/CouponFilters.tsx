import { Search, FilterX, SortAsc } from "lucide-react";
import type { CouponFilter } from "../../../../data/types";

interface CouponFiltersProps {
  filters: CouponFilter;
  onFilterChange: (filters: Partial<CouponFilter>) => void;
}

export function CouponFilters({ filters, onFilterChange }: CouponFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      code: "",
      status: "all",
      sort: "none",
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por código..."
            value={filters.code}
            onChange={(e) => onFilterChange({ code: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as CouponFilter["status"],
              })
            }
            className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({ sort: e.target.value as CouponFilter["sort"] })
              }
              className="w-full pl-10 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
            >
              <option value="none">Ordenar por</option>
              <option value="most-used">Mais utilizados</option>
              <option value="least-used">Menos utilizados</option>
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
          title="Limpar filtros"
        >
          <FilterX className="h-5 w-5" />
          <span className="hidden md:inline">Limpar</span>
        </button>
      </div>
    </div>
  );
}
