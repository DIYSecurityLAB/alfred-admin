import { motion } from 'framer-motion';
import { FilterX, Search, SortAsc } from 'lucide-react';
import type { CouponFilter } from '../../../../data/types';

interface CouponFiltersProps {
  filters: CouponFilter;
  onFilterChange: (filters: Partial<CouponFilter>) => void;
}

export function CouponFilters({ filters, onFilterChange }: CouponFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      code: '',
      status: 'all',
      sort: 'none',
    });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-6 mb-6 shadow-md border border-gray-100"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
          <input
            type="text"
            placeholder="Buscar por código..."
            value={filters.code}
            onChange={(e) => onFilterChange({ code: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
          />
        </div>

        <motion.div className="w-full md:w-48" whileHover={{ scale: 1.01 }}>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as CouponFilter['status'],
              })
            }
            className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </motion.div>

        <motion.div className="w-full md:w-56" whileHover={{ scale: 1.01 }}>
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
            <select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({ sort: e.target.value as CouponFilter['sort'] })
              }
              className="w-full pl-10 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
            >
              <option value="none">Ordenar por</option>
              <option value="most-used">Mais utilizados</option>
              <option value="least-used">Menos utilizados</option>
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>
        </motion.div>

        <motion.button
          onClick={handleClearFilters}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-100"
          title="Limpar filtros"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FilterX className="h-5 w-5 text-blue-500" />
          <span className="hidden md:inline text-gray-800">Limpar</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
