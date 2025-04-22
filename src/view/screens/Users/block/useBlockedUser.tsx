import { BlockUser, ListAllBlockedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

interface BlockedUsersResponse {
  blockedUsers: ListAllBlockedUser[];
  total: number;
}

export function useBlockedUsers() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [error, setError] = useState<string | null>(null);
  const [selectedBlockedUser, setSelectedBlockedUser] =
    useState<null | ListAllBlockedUser>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const fetchBlockedUsers =
    useCallback(async (): Promise<BlockedUsersResponse> => {
      try {
        const { result } = await UseCases.user.block.list.execute({
          page,
          itemsPerPage: perPage,
          userId: undefined,
        });

        if (result.type === 'ERROR') {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }

        const raw = result.data;
        if (
          typeof raw === 'object' &&
          'blockedUsers' in raw &&
          'total' in raw
        ) {
          return raw as BlockedUsersResponse;
        }
        if (Array.isArray(raw)) {
          return {
            blockedUsers: raw,
            total: raw.length,
          };
        }
        return { blockedUsers: [], total: 0 };
      } catch (err) {
        console.error(err);
        setError(
          'Erro ao carregar usuários bloqueados. Por favor, tente novamente.',
        );
        return { blockedUsers: [], total: 0 };
      }
    }, [page, perPage]);

  const { data, isLoading } = useQuery<BlockedUsersResponse, Error>({
    queryKey: ['blockedUsers', page, perPage],
    queryFn: fetchBlockedUsers,
  });

  const blockedUsers = data?.blockedUsers || [];
  const totalBlockedUsers = data?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: async (userData: BlockUser) => {
      const { result } = await UseCases.user.block.create.execute(userData);
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

  const handlePageChange = (newPage: number) => setPage(newPage);
  const openCreateModal = () => {
    setSelectedBlockedUser(null);
    setIsCreateModalOpen(true);
  };
  const openEditModal = (blockedUser: ListAllBlockedUser) => {
    setSelectedBlockedUser(blockedUser);
    setIsEditModalOpen(true);
  };
  const createBlockedUser = async (data: BlockUser) => {
    await createMutation.mutateAsync(data);
  };
  const clearError = () => setError(null);

  return {
    blockedUsers,
    totalBlockedUsers,
    page,
    perPage,
    isLoading,
    error,
    selectedBlockedUser,
    isCreateModalOpen,
    isEditModalOpen,
    handlePageChange,
    setPerPage,
    openCreateModal,
    openEditModal,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    createBlockedUser,
    clearError,
  };
}
