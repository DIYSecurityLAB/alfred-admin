import { BlockUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

interface BlockedUserFilters {
  search: string;
  status: 'all' | 'recent' | 'old';
}

export function useBlockedUsers() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<BlockedUserFilters>({
    search: '',
    status: 'all',
  });
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBlockedUser, setSelectedBlockedUser] = useState<any | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const fetchBlockedUsers = useCallback(async () => {
    try {
      // const { result } = await UseCases.user.block.list.execute({
      //   page,
      //   perPage,
      //   filters,
      // });
      // if (result.type === 'ERROR') {
      //   throw new Error(result.error?.code || 'Erro desconhecido');
      // }
      // return result.data;
    } catch (error) {
      setError(
        'Erro ao carregar usuários bloqueados. Por favor, tente novamente.',
      );
      console.error(error);
      return { blockedUsers: [], total: 0 };
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['blockedUsers', page, perPage, filters],
    queryFn: fetchBlockedUsers,
  });

  const blockedUsers = data?.blockedUsers || [];
  const totalBlockedUsers = data?.total || 0;

  const createMutation = useMutation({
    mutationFn: async (userData: BlockUser) => {
      const { result } = await UseCases.user.block.execute(userData);

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: Error) => {
      setError(`Erro ao bloquear usuário: ${error.message}`);
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilters: Partial<BlockedUserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const openCreateModal = () => {
    setSelectedBlockedUser(null);
    setIsCreateModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (blockedUser: any) => {
    setSelectedBlockedUser(blockedUser);
    setIsEditModalOpen(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openDetailsModal = (blockedUser: any) => {
    setSelectedBlockedUser(blockedUser);
    setIsDetailsModalOpen(true);
  };

  const createBlockedUser = async (data: BlockUser) => {
    await createMutation.mutateAsync(data);
  };

  const unblockUser = async () => {
    // await unblockMutation.mutateAsync(id);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    blockedUsers,
    totalBlockedUsers,
    page,
    perPage,
    filters,
    isLoading,
    error,
    selectedBlockedUser,
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
    createBlockedUser,
    unblockUser,
    clearError,
  };
}
