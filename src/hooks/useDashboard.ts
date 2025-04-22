import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dashboardRepository } from '../data/repositories/old/dashboard.repository';
import type { DashboardStats } from '../data/types';

export function useDashboard() {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const [error, setError] = useState<string | null>(null);

  // Funções de formatação
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Consultar estatísticas do dashboard
  const { data: statsResult, isLoading } = useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: async () => {
      try {
        const result = await dashboardRepository.getDashboardStats();

        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }

        return result.value;
      } catch {
        setError('Erro ao carregar estatísticas do dashboard');
        return null;
      }
    },
  });

  // Extraímos os stats do resultado
  const stats: DashboardStats | null = statsResult || null;

  return {
    stats,
    isLoading,
    error,
    dateRange,
    setDateRange,
    formatCurrency,
    formatNumber,
    formatPercentage,
    clearError: () => setError(null),
  };
}
