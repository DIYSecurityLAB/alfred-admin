import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsRepository } from '../data/repositories/transactions.repository';
import type { Transaction, TransactionFilter, TransactionStatus } from '../data/types';

export function useTransactions() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<TransactionFilter>({
    transactionId: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: undefined
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, perPage, filters],
    queryFn: async () => {
      try {
        const result = await transactionsRepository.getTransactions({
          page, 
          limit: perPage,
          filters
        });
        
        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }
        
        return {
          transactions: result.value?.transactions || [],
          total: result.value?.total || 0
        };
      } catch (err) {
        setError('Erro ao carregar transações');
        return { transactions: [], total: 0 };
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TransactionStatus }) => {
      const result = await transactionsRepository.updateTransactionStatus({ 
        id, 
        status 
      });
      
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsStatusModalOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar status: ${error.message}`);
    }
  });

  const openDetailsModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  const openStatusModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsStatusModalOpen(true);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  
  const handleFilterChange = (newFilters: Partial<TransactionFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const updateTransactionStatus = async (id: string, status: TransactionStatus) => {
    return updateStatusMutation.mutateAsync({ id, status });
  };

  return {
    transactions: data?.transactions || [],
    totalTransactions: data?.total || 0,
    page,
    perPage,
    filters,
    isLoading,
    error,
    selectedTransaction,
    isDetailsModalOpen,
    isStatusModalOpen,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openDetailsModal,
    openStatusModal,
    setIsDetailsModalOpen,
    setIsStatusModalOpen,
    updateTransactionStatus,
    clearError: () => setError(null),
  };
}
