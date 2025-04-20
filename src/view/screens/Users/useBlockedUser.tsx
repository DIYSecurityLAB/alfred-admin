import { useCallback, useEffect, useState } from 'react';

export interface BlockedUserData {
  id: string;
  documentId?: string;
  username?: string;
  userId?: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  blockedBy: string;
}

interface BlockedUserFilters {
  search: string;
  status: 'all' | 'recent' | 'old';
}

interface CreateBlockedUserData {
  documentId?: string;
  username?: string;
  userId?: string;
  reason: string;
}

interface UpdateBlockedUserData {
  id: string;
  data: CreateBlockedUserData;
}

export function useBlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserData[]>([]);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<BlockedUserFilters>({
    search: '',
    status: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlockedUser, setSelectedBlockedUser] =
    useState<BlockedUserData | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchBlockedUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const mockData: BlockedUserData[] = [
        {
          id: '1',
          documentId: '11275271693',
          username: 'Milene2d',
          userId: '646e7154-ecab-4d41-a992-e564a57062c1',
          reason: 'SOLICITAÇÃO DE MED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          blockedBy: 'admin',
        },
        {
          id: '2',
          username: 'JoaoSilva',
          userId: '7f8d6a25-4c3b-4d5e-a9f8-e7d6c5b4a3f2',
          reason: 'SPAM NOS COMENTÁRIOS',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          blockedBy: 'moderator',
        },
        {
          id: '3',
          documentId: '98765432100',
          userId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
          reason: 'LINGUAGEM INAPROPRIADA',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          blockedBy: 'system',
        },
      ];

      let filteredData = [...mockData];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (user) =>
            (user.username &&
              user.username.toLowerCase().includes(searchLower)) ||
            (user.documentId && user.documentId.includes(filters.search)) ||
            (user.userId && user.userId.toLowerCase().includes(searchLower)) ||
            (user.reason && user.reason.toLowerCase().includes(searchLower)),
        );
      }

      if (filters.status === 'recent') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filteredData = filteredData.filter(
          (user) => new Date(user.createdAt) >= sevenDaysAgo,
        );
      } else if (filters.status === 'old') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filteredData = filteredData.filter(
          (user) => new Date(user.createdAt) < sevenDaysAgo,
        );
      }

      setTotalBlockedUsers(filteredData.length);

      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedData = filteredData.slice(start, end);

      setBlockedUsers(paginatedData);
    } catch (err) {
      setError(
        'Erro ao carregar usuários bloqueados. Por favor, tente novamente.',
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

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

  const openEditModal = (blockedUser: BlockedUserData) => {
    setSelectedBlockedUser(blockedUser);
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (blockedUser: BlockedUserData) => {
    setSelectedBlockedUser(blockedUser);
    setIsDetailsModalOpen(true);
  };

  const createBlockedUser = async (data: CreateBlockedUserData) => {
    try {
      const newBlockedUser: BlockedUserData = {
        id: Math.random().toString(36).substring(2, 15),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        blockedBy: 'current_user',
      };

      setBlockedUsers((prev) => [newBlockedUser, ...prev]);
      setTotalBlockedUsers((prev) => prev + 1);
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Erro ao bloquear usuário. Por favor, tente novamente.');
      console.error(err);
    }
  };

  const updateBlockedUser = async ({ id, data }: UpdateBlockedUserData) => {
    try {
      setBlockedUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : user,
        ),
      );
      setIsEditModalOpen(false);
    } catch (err) {
      setError(
        'Erro ao atualizar usuário bloqueado. Por favor, tente novamente.',
      );
      console.error(err);
    }
  };

  const unblockUser = async (id: string) => {
    try {
      setBlockedUsers((prev) => prev.filter((user) => user.id !== id));
      setTotalBlockedUsers((prev) => prev - 1);
    } catch (err) {
      setError('Erro ao desbloquear usuário. Por favor, tente novamente.');
      console.error(err);
    }
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
    updateBlockedUser,
    unblockUser,
    clearError,
  };
}
