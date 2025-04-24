import { motion } from 'framer-motion';
import { Filter, FilterX, Search } from 'lucide-react';
import { useState } from 'react';
import { UserFilter } from '../useUsers';

interface UserFiltersProps {
  filters: UserFilter;
  onFilterChange: (filters: Partial<UserFilter>) => void;
  onClearFilters: () => void;
}

export function UserFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: UserFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.username || '');
  const [searchType, setSearchType] = useState<'username' | 'userId'>(
    'username',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchType === 'username') {
      onFilterChange({ username: searchTerm, userId: undefined });
    } else {
      onFilterChange({ userId: searchTerm, username: undefined });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClearFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 mb-6 shadow-md border border-blue-50 transition-all duration-300 hover:shadow-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-64 lg:w-96">
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Buscar usuário
            </label>
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  searchType === 'username'
                    ? 'Buscar por nome de usuário'
                    : 'Buscar por ID do usuário'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Tipo de busca
            </label>
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as 'username' | 'userId')
              }
              className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              <option value="username">Nome de Usuário</option>
              <option value="userId">ID do Usuário</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-2 gap-3">
          <motion.button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FilterX className="h-5 w-5" />
            <span>Limpar filtros</span>
          </motion.button>

          <motion.button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="h-5 w-5" />
            <span>Aplicar filtro</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
