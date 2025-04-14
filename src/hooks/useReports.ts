import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportRepository } from '../data/repositories/Report.repository';
import type { DepositReport, DepositFilter } from '../data/types';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function useReports() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<DepositFilter>({});
  const [selectedReport, setSelectedReport] = useState<DepositReport | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [error, setError] = useState<string | null>(null);

  // Buscar relatórios paginados
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', page, pageSize, filters],
    queryFn: async () => {
      try {
        const result = await reportRepository.getPaginated({
          page,
          pageSize,
          filters
        });
        
        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }
        
        return {
          reports: result.value?.data || [],
          total: result.value?.total || 0,
          totalPages: result.value?.totalPages || 0
        };
      } catch (err) {
        setError('Erro ao carregar relatórios');
        return { reports: [], total: 0, totalPages: 0 };
      }
    },
  });

  // Buscar um relatório pelo ID
  const fetchReportById = async (id: string): Promise<DepositReport | null> => {
    setError(null);
    try {
      const result = await reportRepository.getById({ id });
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      return result.value || null; // Retorna null explicitamente se o valor for undefined
    } catch (error) {
      setError(`Erro ao buscar detalhes do relatório: ${(error as Error).message}`);
      return null;
    }
  };

  // Exportar para Excel
  const exportToExcel = async (): Promise<boolean> => {
    try {
      setError(null);
      
      console.log("Iniciando exportação para Excel...");
      
      // Buscar todos os dados (sem paginação)
      const result = await reportRepository.getAll();
      
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      
      const data = result.value;
      console.log(`Processando ${data?.length ?? 0} registros para exportação...`);
      
      // Preparar dados para Excel
      const worksheet = XLSX.utils.json_to_sheet(
        (data ?? []).map(item => ({
          'ID': item.id,
          'ID Transação': item.transactionId,
          'Usuário': item.username || 'N/A',
          'Telefone': item.phone,
          'Carteira': item.coldWallet,
          'Rede': item.network,
          'Método de Pagamento': item.paymentMethod,
          'Documento': item.documentId || 'N/A',
          'Data da Transação': item.transactionDate,
          'Cupom': item.cupom || 'N/A',
          'Valor (BRL)': item.valueBRL.toFixed(2),
          'Valor (BTC)': item.valueBTC.toFixed(8),
          'Valor Coletado': item.valueCollected?.toFixed(2) || 'N/A',
          'Status': item.status
        }))
      );
      
      console.log("Criando arquivo Excel...");
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatórios');
      
      // Gerar arquivo e fazer download
      const fileName = `relatorio_depositos_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      console.log("Exportação concluída com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro durante exportação:", error);
      setError(`Erro ao exportar para Excel: ${(error as Error).message}`);
      return false;
    }
  };

  // Funções de utilitário
  const handlePageChange = (newPage: number) => setPage(newPage);
  
  const handleFilterChange = (newFilters: Partial<DepositFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };
  
  const openDetailsModal = async (report: DepositReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };
  
  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const clearError = () => setError(null);

  return {
    reports: data?.reports || [],
    totalReports: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    selectedReport,
    isDetailsModalOpen,
    viewMode,
    
    handlePageChange,
    handleFilterChange,
    setPageSize,
    openDetailsModal,
    setIsDetailsModalOpen,
    setViewMode,
    clearFilters,
    clearError,
    fetchReportById,
    exportToExcel,
    refetch,
  };
}
