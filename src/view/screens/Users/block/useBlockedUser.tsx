import { ListAllBlockedUser } from '@/domain/entities/User';
import { UseCases } from '@/domain/usecases/UseCases';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

interface BlockedUsersResponse {
  blockedUsers: ListAllBlockedUser[];
  total: number;
}

export function useBlockedUsers() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [error, setError] = useState<string | null>(null);

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

  const handlePageChange = (newPage: number) => setPage(newPage);
  const clearError = () => setError(null);

  return {
    blockedUsers,
    totalBlockedUsers,
    page,
    perPage,
    isLoading,
    error,
    handlePageChange,
    setPerPage,
    clearError,
  };
}
