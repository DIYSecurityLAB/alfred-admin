import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsRepository } from '../data/repositories/settings.repository';
import type { Settings } from '../data/types';

export function useSettings() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Buscar configurações
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const result = await settingsRepository.getSettings();
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
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<Settings>) => {
      const result = await settingsRepository.updateSettings(settings);
      if (!result.isSuccess) {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: Error) => {
      setError(`Erro ao atualizar configurações: ${error.message}`);
    }
  });

  const updateSettings = async (settings: Partial<Settings>) => {
    return updateSettingsMutation.mutateAsync(settings);
  };

  const clearError = () => setError(null);

  return {
    settings: data,
    isLoading,
    error,
    updateSettings,
    clearError,
  };
}
