/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Calendar, Filter, FilterX, Loader } from 'lucide-react';
import { useState } from 'react';

interface ReportFiltersProps {
  filters: any;
  onFilterChange: (filter: any) => void;
  onClearFilters: () => void;
  onExportToExcel: () => Promise<boolean>;
  isExporting?: boolean;
  exportProgress?: string;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  //   onExportToExcel,
  isExporting = false,
  exportProgress = '',
}: ReportFiltersProps) {
  const [startDate, setStartDate] = useState<string>(filters.startAt || '');
  const [endDate, setEndDate] = useState<string>(filters.endAt || '');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    // Converter para o formato dd-MM-yyyy para a API
    if (value) {
      const [year, month, day] = value.split('-');
      onFilterChange({ startAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ startAt: undefined });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    // Converter para o formato dd-MM-yyyy para a API
    if (value) {
      const [year, month, day] = value.split('-');
      onFilterChange({ endAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ endAt: undefined });
    }
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    onClearFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 mb-6 shadow-md border border-blue-50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-48">
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                onFilterChange({
                  status: e.target.value || undefined,
                })
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
              <option value="">Todos os status</option>
              <option value="complete">Completo</option>
              <option value="pending">Pendente</option>
              <option value="canceled">Cancelado</option>
              <option value="review">Em revisão</option>
              <option value="expired">Expirado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Data Inicial
            </label>
            <div className="relative">
              <Calendar
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block mb-1.5 text-sm font-medium text-gray-600">
              Data Final
            </label>
            <div className="relative">
              <Calendar
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2 gap-3">
          <motion.button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Limpar filtros"
            disabled={isExporting}
          >
            <FilterX className="h-5 w-5" />
            <span>Limpar filtros</span>
          </motion.button>

          <motion.button
            onClick={() => onFilterChange(filters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Aplicar filtros"
            disabled={isExporting}
          >
            <Filter className="h-5 w-5" />
            <span>Aplicar filtros</span>
          </motion.button>
        </div>

        {isExporting && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700">
            <Loader className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">{exportProgress}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
