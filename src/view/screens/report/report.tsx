import { StatusBadge } from '@/view/components/StatusBadge';
import { ROUTES } from '@/view/routes/Routes';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useReport } from './useReport';

type FilterFormValues = {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
};

export function Report() {
  const {
    loading,
    exportToExcel,
    deposits,
    handlePageChange,
    currentPage,
    totalPages,
    setStartDate,
    setEndDate,
    setStatusFilter,
    setSearchQuery,
  } = useReport();

  const form = useForm<FilterFormValues>();
  const [showFilters, setShowFilters] = useState(false);

  const startDateValue = useWatch({ control: form.control, name: 'startDate' });
  const endDateValue = useWatch({ control: form.control, name: 'endDate' });
  const statusValue = useWatch({ control: form.control, name: 'status' });
  const searchValue = useWatch({ control: form.control, name: 'search' });

  useEffect(() => {
    const start = startDateValue === '' ? undefined : startDateValue;
    const end = endDateValue === '' ? undefined : endDateValue;
    const status = statusValue === '' ? undefined : statusValue;

    setStartDate(start);
    setEndDate(end);
    setStatusFilter(
      status as 'paid' | 'expired' | 'pending' | 'canceled' | undefined,
    );
  }, [
    startDateValue,
    endDateValue,
    statusValue,
    setStartDate,
    setEndDate,
    setStatusFilter,
  ]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(searchValue || '');
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchValue, setSearchQuery]);

  const hasActiveFilters = !!startDateValue || !!endDateValue || !!statusValue;

  const clearFilters = () => {
    form.reset({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {loading && <>LOADING</>}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Reporte de Depósitos
        </h2>

        <FormProvider {...form}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar transações..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...form.register('search')}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setShowFilters(!showFilters)}
              type="button"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                  {
                    [startDateValue, endDateValue, statusValue].filter(Boolean)
                      .length
                  }
                </span>
              )}
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={exportToExcel}
              type="button"
            >
              <Download className="h-5 w-5" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </FormProvider>
      </div>
      {showFilters && (
        <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 w-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700">
              Filtros Avançados
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                type="button"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </button>
            )}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data Inicial
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...form.register('startDate')}
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data Final
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...form.register('endDate')}
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    {...form.register('status')}
                  >
                    <option value="">Todos</option>
                    <option value="paid">Pago</option>
                    <option value="pending">Pendente</option>
                    <option value="canceled">Cancelado</option>
                    <option value="expired">Expirado</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID da Transação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor BRL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor BTC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deposits.map((deposit) => (
              <tr key={deposit.transactionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {deposit.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {deposit.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(deposit.transactionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(deposit.valueBRL)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {deposit.assetValue.toFixed(8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={
                      deposit.status as
                        | 'paid'
                        | 'expired'
                        | 'pending'
                        | 'canceled'
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    to={ROUTES.sales.details.call(deposit.id)}
                    state={{ deposit }}
                    className="text-blue-500 hover:underline"
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Página {currentPage} de {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="px-4 py-2 rounded-lg bg-gray-100">
            {currentPage}
          </span>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
