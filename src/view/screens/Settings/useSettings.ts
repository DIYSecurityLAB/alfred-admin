import { Config, UpdateConfig } from '@/domain/entities/Config';
import { UseCases } from '@/domain/usecases/UseCases';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function useSettings() {
  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      try {
        const { result } = await UseCases.config.list.execute();

        if (result.type === 'ERROR') {
          throw new Error(result.error?.code || 'Erro desconhecido');
        }

        return result.data;
      } catch {
        setErrors('Erro ao carregar configurações');
        return null;
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Config>({
    resolver: zodResolver(Config),
    defaultValues: {
      isMaintenanceMode: config?.isMaintenanceMode || false,
      isSwapPegActive: config?.isSwapPegActive || false,
      feeWithoutCouponBelowValue: config?.feeWithoutCouponBelowValue ?? 0,
      feeWithoutCouponAboveValue: config?.feeWithoutCouponAboveValue ?? 0,
      feeWithCouponAboveValue: config?.feeWithCouponAboveValue ?? 0,
      feeValue: config?.feeValue ?? 0,
    },
    values: {
      isMaintenanceMode: config?.isMaintenanceMode || false,
      isSwapPegActive: config?.isSwapPegActive || false,
      feeWithoutCouponBelowValue: config?.feeWithoutCouponBelowValue ?? 0,
      feeWithoutCouponAboveValue: config?.feeWithoutCouponAboveValue ?? 0,
      feeWithCouponAboveValue: config?.feeWithCouponAboveValue ?? 0,
      feeValue: config?.feeValue ?? 0,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newConfig: UpdateConfig) => {
      const { result } = await UseCases.config.update.execute(newConfig);

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro desconhecido');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
    onError: (error: Error) => {
      setErrors(`Erro ao atualizar configurações: ${error.message}`);
    },
  });

  const clearErrors = () => setErrors(null);

  const onSubmit = async (data: UpdateConfig) => {
    updateMutation.mutateAsync(data);
  };

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  return {
    errors,
    isLoading,
    collapsedHeader,
    clearErrors,
    toggleHeader,
    onsubmit: handleSubmit(onSubmit),
    isUpdating: updateMutation.isPending,
    form: {
      register,
      isDirty,
    },
  };
}
