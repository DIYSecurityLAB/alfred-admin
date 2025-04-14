import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { settingsRepository } from '../../data/repositories/settings.repository';
import type { Settings } from '../../data/types';

const settingsSchema = z.object({
  maintenanceMode: z.boolean(),
  enabledPaymentMethods: z.array(
    z.object({
      method: z.string(),
      enabled: z.boolean(),
    })
  ),
  emailNotifications: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function Settings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsRepository.getSettings(),
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Settings>) => settingsRepository.updateSettings(data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onSubmit = async (data: SettingsFormData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configurações Gerais</h2>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-medium">Modo Manutenção</h3>
                <p className="text-text-secondary text-sm">
                  Ative para colocar o site em modo de manutenção
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('maintenanceMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-medium">Notificações por Email</h3>
                <p className="text-text-secondary text-sm">
                  Ative para receber notificações por email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Métodos de Pagamento</h2>
            {settings?.enabledPaymentMethods.map((method, index) => (
              <div
                key={method.method}
                className="flex items-center justify-between p-4 bg-background rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{method.method}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(`enabledPaymentMethods.${index}.enabled`)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isDirty || mutation.isPending}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}