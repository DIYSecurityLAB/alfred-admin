import { UseCases } from '@/domain/usecases/UseCases';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface BlockUserPayload {
  userId?: string;
  username?: string;
  documentId?: string;
  reason?: string;
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
    setIsSuccessful(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setIsSuccessful(false);
  };

  const blockUser = async (data: BlockUserPayload) => {
    setIsLoading(true);
    setError(null);
    setIsSuccessful(false);

    try {
      if (!data.userId && !data.username && !data.documentId) {
        throw new Error(
          'É necessário fornecer um identificador para bloquear o usuário',
        );
      }

      const { result } = await UseCases.user.block.create.execute({
        userId: data.userId || undefined,
        username: data.username || undefined,
        documentId: data.documentId || undefined,
        reason: data.reason || null,
      });

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro ao bloquear usuário');
      }

      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      setIsSuccessful(true);

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear usuário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    blockUser,
    isLoading,
    error,
    isSuccessful,
    isModalOpen,
    openModal,
    closeModal,
    clearError: () => setError(null),
  };
}
