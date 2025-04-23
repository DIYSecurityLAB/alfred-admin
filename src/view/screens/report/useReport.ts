import { ReportedDeposit } from '@/domain/entities/report.entity';
import { UseCases } from '@/domain/usecases/UseCases';
import { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export function useReport() {
  const [deposits, setDeposits] = useState<ReportedDeposit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<
    'paid' | 'expired' | 'pending' | 'canceled' | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, statusFilter, searchQuery]);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: itemsPerPage,
        status: statusFilter,
        startAt: startDate,
        endAt: endDate,
        search: searchQuery || undefined,
      };

      const { result } =
        await UseCases.report.deposit.paginated.execute(params);

      if (result.type === 'ERROR') {
        handleError(result.error);
        return;
      }

      setDeposits(result.data.data);
      setTotalPages(result.data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao buscar depósitos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, startDate, endDate, statusFilter, searchQuery]);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handleError = (error: { code: string; message?: string }) => {
    switch (error.code) {
      case 'NOT_FOUND':
        setDeposits([]);
        break;
      default:
        alert(error.message || 'Erro ao buscar depósitos');
        break;
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('A data final deve ser posterior à data inicial.');
        return;
      }

      let allDeposits: ReportedDeposit[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const params = {
          page,
          pageSize: itemsPerPage,
          status: statusFilter,
          startAt: startDate,
          endAt: endDate,
          search: searchQuery || undefined,
        };

        const { result } =
          await UseCases.report.deposit.paginated.execute(params);

        if (result.type === 'ERROR') {
          alert('Erro ao exportar depósitos: ' + result.error.code);
          return;
        }

        allDeposits = [...allDeposits, ...result.data.data];
        hasMore = page < (result.data.totalPages || 1);
        page++;
      }

      generateExcelFile(allDeposits);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateExcelFile = (data: ReportedDeposit[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((deposit) => ({
        'ID da Transação': deposit.transactionId,
        Telefone: deposit.phone,
        Carteira: deposit.coldWallet,
        'Rede Selecionada': deposit.network,
        'Método de Pagamento': deposit.paymentMethod,
        'CPF/CNPJ': deposit.documentId,
        'Data da Transação': deposit.transactionDate,
        Cupom: deposit.coupon,
        'Valor em BTC': deposit.assetValue,
        'Valor em BRL': deposit.valueBRL,
        Status: deposit.status,
        Desconto: `${deposit.discountValue}%`,
        'Valor Recolhido': deposit.valueCollected,
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Depósitos');
    XLSX.writeFile(workbook, 'depositos.xlsx');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    loading,
    exportToExcel,
    deposits,
    handlePageChange,
    currentPage,
    totalPages,
    startDate,
    endDate,
    statusFilter,
    searchQuery,
    setStartDate,
    setEndDate,
    setStatusFilter,
    setSearchQuery,
  };
}
