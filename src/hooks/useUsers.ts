/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UserFilterModel } from '../data/model/Old/Users.model';
import { usersRepository } from '../data/repositories/old/users.repository';
// import type { User, UserFilter } from '../data/types';

// Mapeia filtros da UI para o modelo
const mapUiFilterToModel = (filter: any): UserFilterModel => ({
  username: filter.username || undefined,
  status: filter.status,
  level: filter.level,
});

export function useUsers() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<any>({
    username: '',
    status: 'all',
  });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Buscar usuários
  const { data, isLoading } = useQuery({
    queryKey: ['users', page, perPage, filters],
    queryFn: async () => {
      try {
        const result = await usersRepository.getUsers({
          page,
          limit: perPage,
          filters: mapUiFilterToModel(filters),
        });

        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }

        return {
          users: result.value?.users || [],
          total: result.value?.total || 0,
        };
      } catch {
        setError('Erro ao carregar usuários');
        return { users: [], total: 0 };
      }
    },
  });

  // Atualizar status do usuário
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const result = await usersRepository.updateUserStatus({ id, isActive });
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsStatusConfirmOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar status: ${error.message}`);
    },
  });

  // Atualizar nível do usuário
  const updateLevelMutation = useMutation({
    mutationFn: async ({ id, level }: { id: string; level: number }) => {
      const result = await usersRepository.updateUserLevel({ id, level });
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar nível: ${error.message}`);
    },
  });

  // Funções de utilitário
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleFilterChange = (newFilters: Partial<any>) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const openDetailsModal = (user: any) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openStatusConfirm = (user: any) => {
    setSelectedUser(user);
    setIsStatusConfirmOpen(true);
  };

  const clearError = () => setError(null);

  const updateUserStatus = async (id: string, isActive: boolean) => {
    return updateStatusMutation.mutateAsync({ id, isActive });
  };

  const updateUserLevel = async (id: string, level: number) => {
    return updateLevelMutation.mutateAsync({ id, level });
  };

  return {
    users: data?.users || [],
    totalUsers: data?.total || 0,
    page,
    perPage,
    filters,
    isLoading,
    error,
    selectedUser,
    isDetailsModalOpen,
    isEditModalOpen,
    isStatusConfirmOpen,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openDetailsModal,
    openEditModal,
    openStatusConfirm,
    setIsDetailsModalOpen,
    setIsEditModalOpen,
    setIsStatusConfirmOpen,
    updateUserStatus,
    updateUserLevel,
    clearError,
  };
}
