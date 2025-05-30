import { useCallback, useState } from 'react';

import { ListAllUser, ListedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { ROUTES } from '@/view/routes/Routes';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export interface UserFilter {
  username: string | undefined;
  userId: string | undefined;
}

export function useUsers() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilter>({
    username: undefined,
    userId: undefined,
  });
  const [selectedUser, setSelectedUser] = useState<ListedUser | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (): Promise<ListAllUser> => {
    try {
      const { result } = await UseCases.user.list.execute({
        page: page - 1,
        itemsPerPage: perPage,
        userId: filters.userId,
        username: filters.username,
      });

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }

      return result.data;
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar usuários. Por favor, tente novamente.');
      return {
        data: [],
        page: 0,
        itemsPerPage: 10,
        totalPages: 0,
      } as ListAllUser;
    }
  }, [page, perPage, filters.userId, filters.username]);

  const { data: response, isLoading } = useQuery<ListAllUser, Error>({
    queryKey: ['users', page, perPage, filters],
    queryFn: fetchUsers,
  });

  const users = response?.data || [];
  const totalUsers = response?.totalPages ?? 0;

  const handleFilterChange = (newFilters: Partial<UserFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const clearError = () => setError(null);

  const clearFilters = () => {
    setFilters({
      username: undefined,
      userId: undefined,
    });
    setPage(1);
  };

  const openDetailsModal = (user: ListedUser) => {
    setSelectedUser(user);
    navigate(ROUTES.users.details.call(user.id));
  };

  return {
    users,
    totalUsers,
    page,
    perPage,
    isLoading,
    error,
    filters,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openDetailsModal,
    clearError,
    clearFilters,
    selectedUser,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
  };
}
