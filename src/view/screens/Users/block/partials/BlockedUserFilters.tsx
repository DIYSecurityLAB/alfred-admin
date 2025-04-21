import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

interface BlockedUserFiltersProps {
  filters: {
    search: string;
    status: 'all' | 'recent' | 'old';
  };
  onFilterChange: (
    filters: Partial<{ search: string; status: 'all' | 'recent' | 'old' }>,
  ) => void;
}

export function BlockedUserFilters({
  filters,
  onFilterChange,
}: BlockedUserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (status: 'all' | 'recent' | 'old') => {
    onFilterChange({ status });
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Buscar por username, ID, documento ou razão..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors bg-gray-50 hover:border-gray-300"
          />
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg flex items-center gap-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">Filtros</span>
        </motion.button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700">Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange('all')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filters.status === 'all'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => handleStatusChange('recent')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filters.status === 'recent'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Recentes (7 dias)
                </button>
                <button
                  onClick={() => handleStatusChange('old')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filters.status === 'old'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  Antigos (+ 7 dias)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {filters.search && (
          <div className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-md flex items-center gap-1 text-sm">
            <span>Busca: {filters.search}</span>
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="ml-1 hover:text-blue-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {filters.status !== 'all' && (
          <div className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-md flex items-center gap-1 text-sm">
            <span>
              Status: {filters.status === 'recent' ? 'Recentes' : 'Antigos'}
            </span>
            <button
              onClick={() => onFilterChange({ status: 'all' })}
              className="ml-1 hover:text-blue-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
