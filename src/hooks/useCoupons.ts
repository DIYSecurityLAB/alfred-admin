import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponRepository } from '../data/repositories/Coupon.repository';
import { FilterCouponsModel } from '../data/model/Coupons.model';
import type { Coupon, CouponFilter, CreateCouponDTO, UpdateCouponDTO } from '../data/types';
import { debounce } from 'lodash';

// Mapeia os filtros da UI para o modelo do repositório
const mapUiFilterToModel = (filter: CouponFilter): FilterCouponsModel => ({
  code: filter.code || undefined,
  status: filter.status
});

export function useCoupons() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<CouponFilter>({
    code: '',
    status: 'all',
    sort: 'none',
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Hook para buscar todos os cupons
  const { data: allCouponsData, isLoading } = useQuery({
    queryKey: ['allCoupons'],
    queryFn: async () => {
      try {
        const result = await couponRepository.listAll({
          page: 1,
          limit: 1000, // Buscar todos os cupons de uma vez
          filters: {} // Sem filtros do lado do servidor
        });
        
        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }
        
        return result.value?.data || [];
      } catch (err) {
        setError('Erro ao carregar cupons');
        return [];
      }
    },
  });

  // Filtrar e ordenar cupons localmente
  const filteredCoupons = useCallback(() => {
    if (!allCouponsData) return [];

    let result = [...allCouponsData];

    // Filtrar por código (case insensitive)
    if (filters.code) {
      result = result.filter(coupon => 
        coupon.code.toLowerCase().includes(filters.code.toLowerCase())
      );
    }

    // Filtrar por status
    if (filters.status !== 'all') {
      result = result.filter(coupon => 
        filters.status === 'active' ? coupon.isActive : !coupon.isActive
      );
    }

    // Ordenar 
    if (filters.sort !== 'none') {
      result.sort((a, b) => {
        switch (filters.sort) {
          case 'most-used':
            return b.usedCount - a.usedCount;
          case 'least-used':
            return a.usedCount - b.usedCount;
          case 'newest':
            return new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime();
          case 'oldest':
            return new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime();
          default:
            return 0;
        }
      });
    }

    return result;
  }, [allCouponsData, filters]);

  // Obter cupons para a página atual
  const paginatedCoupons = useCallback(() => {
    const filtered = filteredCoupons();
    const startIndex = (page - 1) * perPage;
    return filtered.slice(startIndex, startIndex + perPage);
  }, [filteredCoupons, page, perPage]);

  // Debounce para alterações de filtro
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((newFilters: Partial<CouponFilter>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
      setPage(1);
    }, 300),
    []
  );

  // Criar cupom
  const createMutation = useMutation({
    mutationFn: async (couponData: CreateCouponDTO) => {
      const result = await couponRepository.insert(couponData as any);
      if (!result.isSuccess) {
        const errorMessage = result.error?.code 
          ? `Erro ao criar cupom: ${result.error.code}` 
          : 'Erro desconhecido ao criar cupom';
        throw new Error(errorMessage);
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCoupons'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao criar cupom: ${error.message}`);
    }
  });

  // Atualizar cupom
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCouponDTO }) => {
      const result = await couponRepository.update(id, data as any);
      if (!result.isSuccess) {
        const errorMessage = result.error?.code 
          ? `Erro ao atualizar cupom: ${result.error.code}` 
          : 'Erro desconhecido ao atualizar cupom';
        throw new Error(errorMessage);
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCoupons'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar cupom: ${error.message}`);
    }
  });

  // Alternar status do cupom
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await couponRepository.toggleStatus({ id });
      
      if (!result.isSuccess) {
        const errorMessage = result.error?.code 
          ? `Erro ao alternar status: ${result.error.code}` 
          : 'Erro desconhecido ao alternar status';
        throw new Error(errorMessage);
      }
      
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCoupons'] });
    },
    onError: (error: Error) => {
      setError(`Erro ao alterar status do cupom: ${error.message}`);
    }
  });

  // Validate coupon (nova função)
  const validateCoupon = async (code: string) => {
    setError(null);
    try {
      const result = await couponRepository.isValid(code);
      if (!result.isSuccess) {
        const errorMessage = result.error?.code 
          ? `Erro na validação: ${result.error.code}` 
          : 'Erro desconhecido na validação';
        throw new Error(errorMessage);
      }
      return result.value;
    } catch (error) {
      setError(`Erro ao validar cupom: ${(error as Error).message}`);
      throw error;
    }
  };

  // Funções de utilitário
  const handlePageChange = (newPage: number) => setPage(newPage);
  
  const handleFilterChange = (newFilters: Partial<CouponFilter>) => {
    debouncedFilterChange(newFilters);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  
  const openEditModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };
  
  const openDetailsModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailsModalOpen(true);
  };
  
  const clearError = () => setError(null);

  return {
    coupons: paginatedCoupons(),
    totalCoupons: filteredCoupons().length,
    page,
    perPage,
    filters,
    isLoading,
    error,
    selectedCoupon,
    isCreateModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
  
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openCreateModal,
    openEditModal,
    openDetailsModal,
    
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDetailsModalOpen,
    
    createCoupon: createMutation.mutateAsync,
    updateCoupon: updateMutation.mutateAsync,
    toggleCouponStatus: toggleStatusMutation.mutateAsync,
    validateCoupon,
    clearError,
  };
}
