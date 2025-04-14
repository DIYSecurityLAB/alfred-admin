import React from 'react';
import { Search, FilterX } from 'lucide-react';
import type { UserFilter } from '../../../data/types';

interface UserFiltersProps {
  filters: UserFilter;
  onFilterChange: (filters: Partial<UserFilter>) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      username: '',
      status: 'all',
      level: undefined
    });
  };

  // Para controle do campo de nível (que precisa ser convertido entre string e number)
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onFilterChange({ level: undefined });
    } else {
      onFilterChange({ level: parseInt(value) });
    }
  };

  return (
    <div className="bg-surface rounded-lg p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por username..."
            value={filters.username || ''}
            onChange={(e) => onFilterChange({ username: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="w-full">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as UserFilter['status'] })}
            className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div className="w-full">
          <select
            value={filters.level !== undefined ? filters.level.toString() : ''}
            onChange={handleLevelChange}
            className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          >
            <option value="">Todos os níveis</option>
            <option value="0">Nível 0</option>
            <option value="1">Nível 1</option>
            <option value="2">Nível 2</option>
            <option value="3">Nível 3</option>
            <option value="4">Nível 4</option>
            <option value="5">Nível 5</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
          title="Limpar filtros"
        >
          <FilterX className="h-5 w-5" />
          <span>Limpar filtros</span>
        </button>
      </div>
    </div>
  );
}
