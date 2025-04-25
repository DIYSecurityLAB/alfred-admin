/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Filter,
  FilterX,
  Loader,
  Lock,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReportFiltersProps {
  filters: any;
  onFilterChange: (filter: any) => void;
  onClearFilters: () => void;
  onExportToExcel: () => Promise<boolean>;
  isExporting?: boolean;
  exportProgress?: string;
  canExport?: boolean;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onExportToExcel,
  isExporting = false,
  exportProgress = '',
  canExport = false,
}: ReportFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    startAt: filters.startAt || '',
    endAt: filters.endAt || '',
  });

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    setLocalFilters({
      status: filters.status || '',
      startAt: filters.startAt || '',
      endAt: filters.endAt || '',
    });

    setStartDate(convertDateForInput(filters.startAt));
    setEndDate(convertDateForInput(filters.endAt));
  }, [filters]);

  const convertDateForInput = (dateStr: string): string => {
    if (!dateStr) return '';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const convertDateForAPI = (dateStr: string): string => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);

    if (value) {
      setLocalFilters((prev) => ({
        ...prev,
        startAt: convertDateForAPI(value),
      }));
    } else {
      setLocalFilters((prev) => ({ ...prev, startAt: '' }));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);

    if (value) {
      setLocalFilters((prev) => ({
        ...prev,
        endAt: convertDateForAPI(value),
      }));
    } else {
      setLocalFilters((prev) => ({ ...prev, endAt: '' }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value || '',
    }));
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setLocalFilters({
      status: '',
      startAt: '',
      endAt: '',
    });

    onClearFilters();
  };

  const applyFilters = () => {
    const filtersToApply = Object.fromEntries(
      Object.entries(localFilters).map(([key, value]) => [
        key,
        value || undefined,
      ]),
    );

    onFilterChange(filtersToApply);
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
              value={localFilters.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
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
              <option value="paid">Pago</option>
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

        <div className="flex justify-between mt-2">
          <div>
            {canExport && (
              <motion.button
                onClick={onExportToExcel}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
                  isExporting
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-50 hover:bg-green-100 border border-green-200 text-green-700'
                } transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Exportar para Excel"
              >
                {isExporting ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                <span>{isExporting ? 'Exportando...' : 'Exportar Excel'}</span>
              </motion.button>
            )}
          </div>

          <div className="flex gap-3">
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
              onClick={applyFilters}
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
        </div>

        {isExporting && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700">
            <Loader className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">{exportProgress}</span>
          </div>
        )}

        {!canExport && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-500">
            <Lock className="h-5 w-5" />
            <span className="text-sm">
              Você não tem permissão para exportar dados.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
