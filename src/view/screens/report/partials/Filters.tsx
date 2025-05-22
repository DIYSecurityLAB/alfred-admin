/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Download,
  Filter,
  FilterX,
  Loader,
  LockIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Interface atualizada para incluir progresso percentual
interface ReportFiltersProps {
  filters: any;
  onFilterChange: (filter: any) => void;
  onClearFilters: () => void;
  onExportToExcel: () => Promise<boolean>;
  isExporting?: boolean;
  exportProgress?: string;
  exportPercent?: number;
  canExport?: boolean;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onExportToExcel,
  isExporting = false,
  exportProgress = '',
  exportPercent = 0,
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
    setLocalFilters((prev) => {
      if (field === 'status') {
        const currentValues: string[] = prev.status || []; // Define que é um array de strings

        if (value === '') {
          // Se "Todos os status" for selecionado, reseta os filtros
          return { ...prev, [field]: [] };
        }

        // Adiciona ou remove o status do array
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter((item: string) => item !== value) // Define o tipo de 'item'
          : [...currentValues, value];

        return { ...prev, [field]: updatedValues };
      }

      // Para outros campos, mantém a lógica original
      return { ...prev, [field]: value || '' };
    });
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

  const StatusFilter = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDropdown = () => {
      setIsExpanded((prev) => !prev);
    };

    return (
      <div className="relative inline-block text-left">
        {/* Botão para exibir ou esconder as opções */}
        <button
          onClick={toggleDropdown}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Selecionar status
          <svg
            className={`w-5 h-5 ml-2 transition-transform ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Opções de filtro */}
        {isExpanded && (
          <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-4 flex flex-wrap gap-2">
              {[
                { value: '', label: 'Todos os status' },
                { value: 'complete', label: 'Completo' },
                { value: 'paid', label: 'Pago' },
                { value: 'pending', label: 'Pendente' },
                { value: 'canceled', label: 'Cancelado' },
                { value: 'review', label: 'Em revisão' },
                { value: 'expired', label: 'Expirado' },
                { value: 'refunded', label: 'Reembolsado' },
              ].map((status) => (
                <label
                  key={status.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.status.includes(status.value)}
                    onChange={() => handleFieldChange('status', status.value)}
                    className="form-checkbox cursor-pointer"
                  />
                  <span className="text-gray-800">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
            <div className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 cursor-pointer">
              <StatusFilter />
            </div>
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
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-amber-700">
                {exportProgress}
              </span>
              <span className="text-sm font-medium text-amber-700">
                {exportPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${exportPercent}%` }}
                transition={{ duration: 0.3 }}
                className={`h-2.5 rounded-full ${
                  exportPercent < 100 ? 'bg-amber-500' : 'bg-green-500'
                }`}
              />
            </div>

            {exportPercent === 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-2 text-sm text-green-600"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Exportação concluída com sucesso!</span>
              </motion.div>
            )}
          </div>
        )}

        {!canExport && !isExporting && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-500">
            <LockIcon className="h-5 w-5" />
            <span className="text-sm">
              Você não tem permissão para exportar dados.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
