import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponRepository } from '../data/repositories/Coupon.repository';
import { FilterCouponsModel } from '../data/model/Coupons.model';
import type { Coupon, CouponFilter, CreateCouponDTO, UpdateCouponDTO } from '../data/types';

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
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Buscar cupons
  const { data, isLoading } = useQuery({
    queryKey: ['coupons', page, perPage, filters],
    queryFn: async () => {
      try {
        const result = await couponRepository.listAll({
          page,
          limit: perPage,
          filters: {
            code: filters.code || undefined,
            status: filters.status
          }
        });
        
        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }
        
        // Calcular o total com base no comprimento do array de dados
        // ou usar um valor padrão se a API não enviar um valor total
        return {
          coupons: result.value?.data || [],
          total: result.value?.data?.length || 0
        };
      } catch (err) {
        setError('Erro ao carregar cupons');
        return { coupons: [], total: 0 };
      }
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
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
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
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
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
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
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
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
    coupons: data?.coupons || [],
    totalCoupons: data?.total || 0,
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
