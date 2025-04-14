import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configRepository } from '../data/repositories/config.repository';
import type { UpdateConfigReq } from '../data/repositories/config.repository';

export function useConfig() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Buscar configurações
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      try {
        const result = await configRepository.getConfig();
        if (!result.isSuccess) {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }
        return result.value;
      } catch (err) {
        setError('Erro ao carregar configurações');
        return null;
      }
    },
  });

  // Atualizar configurações
  const updateMutation = useMutation({
    mutationFn: async (newConfig: UpdateConfigReq) => {
      const result = await configRepository.updateConfig(newConfig);
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar configurações: ${error.message}`);
    }
  });

  const updateConfig = async (config: UpdateConfigReq) => {
    return updateMutation.mutateAsync(config);
  };

  const clearError = () => setError(null);

  return {
    config,
    isLoading,
    error,
    updateConfig,
    isUpdating: updateMutation.isPending,
    clearError,
  };
}
