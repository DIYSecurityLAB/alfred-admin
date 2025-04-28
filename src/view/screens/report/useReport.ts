import { ReportedDeposit } from '@/domain/entities/report.entity';
import { UseCases } from '@/domain/usecases/UseCases';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import * as XLSX from 'xlsx';

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

  const prepareApiFilters = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiFilters: any = {};

    if (filters.status) apiFilters.status = filters.status;

    if (filters.startAt) apiFilters.startAt = formatDateForApi(filters.startAt);
    if (filters.endAt) apiFilters.endAt = formatDateForApi(filters.endAt);

    return apiFilters;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', page, perPage, filters],
    queryFn: async () => {
      try {
        const filters = prepareApiFilters();

        const { result } = await UseCases.report.deposit.paginated.execute({
          page: Math.max(0, page - 1),
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
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (newFilters: any) => {
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

  const exportToExcel = async (
    onProgress?: (message: string, percent: number) => void,
  ): Promise<boolean> => {
    try {
      // Função auxiliar para fazer pausas controladas e atualizar progresso
      const updateProgressWithDelay = async (
        message: string,
        percent: number,
        delayMs: number = 300,
      ) => {
        onProgress?.(message, percent);
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      };

      await updateProgressWithDelay('Iniciando exportação...', 5, 500);
      await updateProgressWithDelay('Buscando dados do servidor...', 10, 800);

      const hasFilters = Object.keys(prepareApiFilters()).length > 0;
      let result;

      if (hasFilters) {
        const filters = prepareApiFilters();
        await updateProgressWithDelay(
          'Processando dados filtrados para exportação...',
          20,
        );
        const response = await UseCases.report.deposit.paginated.execute({
          startAt: filters.startAt,
          endAt: filters.endAt,
          status: filters.status,
        });
        result = response.result;
        await updateProgressWithDelay('Dados filtrados recebidos', 30);
      } else {
        await updateProgressWithDelay('Buscando todos os depósitos...', 20);
        const response = await UseCases.report.deposit.all.execute();
        result = response.result;
        await updateProgressWithDelay('Dados completos recebidos', 30);
      }

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro ao exportar dados');
      }

      const deposits = Array.isArray(result.data)
        ? result.data
        : result.data?.data || [];

      if (deposits.length === 0) {
        throw new Error('Não há dados para exportar');
      }

      await updateProgressWithDelay(
        `Preparando ${deposits.length} registros para exportação...`,
        40,
        500,
      );

      // Dividimos o processamento em lotes para exibir progresso incremental
      const batchSize = Math.min(
        100,
        Math.max(10, Math.floor(deposits.length / 10)),
      );
      const batches = Math.ceil(deposits.length / batchSize);
      let workbookData: ReturnType<typeof formatDepositForExcel>[] = [];

      for (let i = 0; i < batches; i++) {
        const startIdx = i * batchSize;
        const endIdx = Math.min((i + 1) * batchSize, deposits.length);
        const batchItems = deposits.slice(startIdx, endIdx);

        const batchData = batchItems.map(formatDepositForExcel);
        workbookData = [...workbookData, ...batchData];

        // Atualizamos o progresso apenas em intervalos específicos para não sobrecarregar a UI
        if (
          batches <= 5 ||
          i % Math.floor(batches / 5) === 0 ||
          i === batches - 1
        ) {
          const progressPercent = 40 + Math.floor(((i + 1) / batches) * 30);
          await updateProgressWithDelay(
            `Processando dados (${startIdx + 1} até ${endIdx} de ${deposits.length})...`,
            progressPercent,
            300,
          );
        }
      }

      await updateProgressWithDelay('Gerando planilha Excel...', 75, 500);

      const ws = XLSX.utils.json_to_sheet(workbookData);

      const columnWidths = [
        { wch: 15 }, // ID
        { wch: 25 }, // Transaction ID
        { wch: 15 }, // Username
        { wch: 15 }, // Data
        { wch: 15 }, // Método
        { wch: 10 }, // Tipo Crypto
        { wch: 15 }, // Valor BRL
        { wch: 15 }, // Valor Crypto
        { wch: 12 }, // Status
        { wch: 15 }, // Phone
      ];

      ws['!cols'] = columnWidths;

      await updateProgressWithDelay('Formatando planilha...', 80, 400);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Depósitos');

      await updateProgressWithDelay(
        'Preparando arquivo para download...',
        90,
        500,
      );

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });

      const fileName = `depositos_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(data, fileName);

      await updateProgressWithDelay(
        'Exportação concluída com sucesso!',
        100,
        500,
      );
      return true;
    } catch (error) {
      console.error('Erro na exportação:', error);
      setError(
        error instanceof Error ? error.message : 'Erro ao exportar para Excel',
      );
      return false;
    }
  };

  const formatDepositForExcel = (deposit: ReportedDeposit) => {
    // Lidamos com cryptoType potencialmente nulo/indefinido
    const cryptoType = deposit.cryptoType || 'N/A';

    return {
      ID: deposit.id,
      'ID Transação': deposit.transactionId,
      Usuário: deposit.username || 'N/A',
      Data: deposit.transactionDate,
      'Método de Pagamento': deposit.paymentMethod,
      'Tipo de Crypto': cryptoType,
      'Valor (R$)': formatBRLValue(deposit.valueBRL),
      'Valor Crypto': `${formatCryptoValue(deposit.assetValue)} ${cryptoType}`,
      Status: formatStatus(deposit.status),
      Telefone: deposit.phone || 'N/A',
      Rede: deposit.network || 'N/A',
      Wallet: deposit.coldWallet || 'N/A',
      Cupom: deposit.coupon || 'N/A',
      Desconto: deposit.discountValue
        ? deposit.discountType === 'fixed'
          ? formatBRLValue(deposit.discountValue)
          : `${deposit.discountValue}%`
        : 'N/A',
      'Valor Coletado': deposit.valueCollected
        ? formatBRLValue(deposit.valueCollected)
        : 'N/A',
    };
  };

  const formatBRLValue = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatCryptoValue = (value: number): string => {
    return value.toFixed(8);
  };

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      complete: 'Completo',
      completed: 'Completo',
      paid: 'Pago',
      pending: 'Pendente',
      review: 'Em revisão',
      canceled: 'Cancelado',
      cancelled: 'Cancelado',
      expired: 'Expirado',
      refunded: 'Reembolsado',
    };

    return statusMap[status.toLowerCase()] || status;
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
