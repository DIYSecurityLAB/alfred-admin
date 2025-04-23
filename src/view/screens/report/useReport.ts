import { ReportedDeposit } from '@/domain/entities/report.entity';
import { UseCases } from '@/domain/usecases/UseCases';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useReport() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [error, setError] = useState<string | null>(null);

  const formatDateForApi = (dateStr: string) => {
    if (!dateStr) return undefined;

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr;
    }

    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  // Preparar filtros para a API
  const prepareApiFilters = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiFilters: any = {};

    if (filters.status) apiFilters.status = filters.status;
    if (filters.paymentMethod) apiFilters.paymentMethod = filters.paymentMethod;
    if (filters.username) apiFilters.username = filters.username;
    if (filters.cryptoType) apiFilters.cryptoType = filters.cryptoType;

    // Converter formatos de data
    if (filters.startAt) apiFilters.startAt = formatDateForApi(filters.startAt);
    if (filters.endAt) apiFilters.endAt = formatDateForApi(filters.endAt);

    return apiFilters;
  };

  // Buscar dados dos relatórios
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', page, perPage, filters],
    queryFn: async () => {
      try {
        const filters = prepareApiFilters();

        const { result } = await UseCases.report.deposit.paginated.execute({
          page: page - 1,
          pageSize: perPage,
          status: filters.status,
          startAt: filters.startAt,
          endAt: filters.endAt,
        });

        if (result.type === 'ERROR') {
          throw new Error(result.error?.code || 'Erro ao carregar relatórios');
        }

        return {
          reports: result.data?.data || [],
          total: (result.data?.totalPages || 0) * (result.data?.pageSize || 0),
          totalPages: result.data?.totalPages || 0,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        return { reports: [], total: 0, totalPages: 0 };
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Funções para manipulação de estado
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (newFilters: any) => {
    // Resetar página ao mudar filtros
    if (Object.keys(newFilters).length > 0) {
      setPage(1);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const clearError = () => {
    setError(null);
  };

  const exportToExcel = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true;
    } catch {
      setError('Erro ao exportar para Excel');
      return false;
    }
  };

  return {
    reports: (data?.reports as ReportedDeposit[]) || [],
    totalReports: data?.total || 0,
    page,
    perPage,
    filters,
    isLoading,
    error,
    viewMode,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    setViewMode,
    clearFilters,
    clearError,
    exportToExcel,
    refetch,
  };
}
